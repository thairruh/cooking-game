import { EventBus } from './EventBus';

type RequestPayload = {
  npcId: string;
  stage?: number;
  playerText?: string;
  lineDelayMs?: number;
};

const API_PATH = '/api/dialogue/generate';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function handleRequest(payload: RequestPayload) {
  const { npcId, stage = 1, playerText = '', lineDelayMs = 1600 } = payload;
  try {
    const res = await fetch(API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: npcId, context: { stage, playerText } }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Dialogue API error', res.status, text);
      EventBus.emit('show-message', "(Dialogue service unavailable)");
      return;
    }

    const data = await res.json();
    if (data.status !== 'success') {
      console.error('Dialogue API returned error', data);
      EventBus.emit('show-message', "(No response)");
      return;
    }

    const lines: string[] = data.lines || [];
    // Emit each line with a delay so the overlay shows them sequentially
    for (let i = 0; i < lines.length; i++) {
      EventBus.emit('show-message', lines[i]);
      await sleep(lineDelayMs);
    }
    EventBus.emit('dialogue-ended', { npcId, stage });
  } catch (err) {
    console.error('Dialogue fetch failed', err);
    EventBus.emit('show-message', "(Dialogue error)");
  }
}

// Register the event listener once
EventBus.on('request-dialogue', (payload: RequestPayload) => {
  // fire-and-forget
  void handleRequest(payload);
});

export default {
  request: (npcId: string, stage = 1, playerText = '') =>
    EventBus.emit('request-dialogue', { npcId, stage, playerText }),
};
