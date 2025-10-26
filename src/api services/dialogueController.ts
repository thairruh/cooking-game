import { fetchDialogue } from "./dialogues";

type Listener = (evt: any) => void;

/**
 * A tiny event bus so Phaser and React can talk without extra libraries.
 */
class Bus {
  private map = new Map<string, Set<Listener>>();
  on(type: string, fn: Listener) {
    if (!this.map.has(type)) this.map.set(type, new Set());
    this.map.get(type)!.add(fn);
  }
  off(type: string, fn: Listener) {
    this.map.get(type)?.delete(fn);
  }
  emit(type: string, payload?: any) {
    this.map.get(type)?.forEach((fn) => fn(payload));
  }
}

export const dialogueBus = new Bus();

/**
 * Minimal controller that:
 * - shows a local opening line first (no API call)
 * - then sends player's reply to the backend to get Gemini's response
 */
export class DialogueController {
  private npcStage: Record<string, number> = {};
  private activeNpc: string | null = null;
  private lines: string[] = [];
  private index = 0;

  // Built-in first lines per character (local, no API)
  private openings: Record<string, string> = {
    anika: "Hey beautiful! Can I get butter chicken please?",
    // add more NPCs as needed
  };

  start(npcId: string) {
    // If we’re already in a conversation with this NPC, just advance.
    if (this.activeNpc === npcId && this.hasNextLine()) {
      this.advance();
      return;
    }

    // Start new conversation: open with local line
    this.activeNpc = npcId;
    this.index = 0;

    const opening = this.openings[npcId] ?? "(They glance your way.)";
    this.lines = [opening];

    // Let UI/game know a new dialogue started with the opening line
    dialogueBus.emit("dialogue:start", {
      npcId,
      stage: this.getStage(npcId),
      line: opening,
    });
  }

  hasNextLine() {
    return this.index < this.lines.length - 1;
  }

  advance() {
    if (!this.activeNpc) return;
    if (!this.hasNextLine()) {
      // finished current local/Gemini batch
      dialogueBus.emit("dialogue:end", {
        npcId: this.activeNpc,
        stage: this.getStage(this.activeNpc),
      });
      return;
    }
    this.index += 1;
    dialogueBus.emit("dialogue:line", {
      npcId: this.activeNpc,
      index: this.index,
      line: this.lines[this.index],
    });
  }

  /**
   * Player typed a reply. We call Flask, which calls Gemini,
   * and then we display Gemini's lines.
   */
  async sendPlayerReply(playerText: string) {
    if (!this.activeNpc) return;
    const npcId = this.activeNpc;
    const stage = this.getStage(npcId);

    // optimistic: append the player's line to the transcript (optional)
    // (we don’t emit this to UI by default; up to you)
    // this.lines.push(`You: ${playerText}`);

    try {
      const res = await fetchDialogue({
        customerId: npcId,
        context: { stage, playerText }, // <— player text forwarded to backend
      });

      if (res.status !== "success" || !res.lines?.length) {
        throw new Error(res.error || "No lines returned");
      }

      // Stage advances for next turn
      this.npcStage[npcId] = res.nextStage ?? stage + 1;

      // Load the model’s lines as the new batch and show first one
      this.lines = res.lines.slice();
      this.index = 0;

      dialogueBus.emit("dialogue:line", {
        npcId,
        index: 0,
        line: this.lines[0],
      });
    } catch (e: any) {
      dialogueBus.emit("dialogue:error", {
        npcId,
        message: e?.message ?? String(e),
      });
    }
  }

  cancel() {
    if (!this.activeNpc) return;
    const npcId = this.activeNpc;
    this.activeNpc = null;
    this.lines = [];
    this.index = 0;
    dialogueBus.emit("dialogue:end", {
      npcId,
      stage: this.getStage(npcId),
    });
  }

  getStage(npcId: string) {
    return this.npcStage[npcId] ?? 1;
  }
}

export const dialogue = new DialogueController();
