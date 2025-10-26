export interface DialogueResponse {
  message: string;
}

export async function generateDialogue(prompt: string): Promise<DialogueResponse> {
  const res = await fetch('http://127.0.0.1:5001/api/dialogue/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error(`Flask API error: ${res.status}`);
  }

  return res.json();
}
