import type { DialogueRequest, DialogueResponse } from "../types";

const API_BASE = "http://localhost:5001";

export async function fetchDialogue(req: DialogueRequest): Promise<DialogueResponse> {
  const res = await fetch(`${API_BASE}/api/dialogue/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  const data: DialogueResponse = await res.json();
  return data;
}
