export interface DialogueRequest {
  customerId: string;               // NPC id (e.g., "raj")
  context?: {
    stage?: number;                 // simple stage counter (1,2,3...)
    playerText?: string;            // <— NEW: the player’s free-form reply
  };
}

export interface DialogueResponse {
  status: "success" | "error";
  character?: string;
  stage?: number;
  lines?: string[];                 // Gemini’s 2–3 lines
  nextStage?: number;
  error?: string;
}
