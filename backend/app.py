# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import requests  # for /api/gemini/models health check
from typing import Dict, Any

# ──────────────────────────────────────────────────────────────────────────────
# ENV + GEMINI CONFIG
# ──────────────────────────────────────────────────────────────────────────────
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY in your .env")

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
TEMP = float(os.getenv("GEMINI_TEMP", "1.0"))
TOP_P = float(os.getenv("GEMINI_TOP_P", "0.95"))
TOP_K = int(os.getenv("GEMINI_TOP_K", "64"))

genai.configure(api_key=GEMINI_API_KEY)

# System style for your cooking game
# how bad they did before context
SYSTEM_INSTRUCTION = (
    "The user may or may not have cooked the meal in a timely manner."
    "Please reply with an emotionally grounded dialogue. Remember your backstory and arc. Reply like a human. "
    "Keep outputs normal, natural, and aligned to the NPC. Return a score of how well the character would rate them from 1-10"
    "recieves or responds to."
)

model = genai.GenerativeModel(
    model_name=MODEL_NAME,
    system_instruction=SYSTEM_INSTRUCTION,
    generation_config={
        "temperature": TEMP,
        "top_p": TOP_P,
        "top_k": TOP_K,
    },
)


from characters import characters  # noqa: E402

# Case-insensitive index (e.g., "aya" -> "Aya")
CHAR_INDEX: Dict[str, str] = {k.lower(): k for k in characters.keys()}

def resolve_npc_id(npc_id_raw: str):
    return CHAR_INDEX.get((npc_id_raw or "").lower())

def register_character(cid: str, payload: Dict[str, Any]):
    """Upsert a character in memory."""
    record = characters.get(cid, {})
    record["Backstory"] = payload.get("backstory") or payload.get("Backstory") or record.get("Backstory", "")
    record["Arc"] = payload.get("arc") or payload.get("Arc") or record.get("Arc", "")
    record["fallback"] = payload.get("fallback") or record.get("fallback", {})
    characters[cid] = record
    CHAR_INDEX[cid.lower()] = cid
    return record


def generate_character_dialogue(npc_id: str, stage: int, player_text: str):
    c = characters.get(npc_id)
    if not c:
        return ["I'm not sure who that is."]
#have a get score and update score by x find some sort of way if the ai gives a positive response.
    prompt = f"""
NPC: {npc_id}
Backstory: {c.get('Backstory','')}
Arc: {c.get('Arc','')}

Scene: A small, cozy restaurant where the player serves food.
Conversation Stage: {stage}
The player just said: "{player_text}"

Write 1–3 short lines of dialogue for {npc_id} that feel natural and align with their arc.
No stage directions. Each line on its own line. 
""".strip()
# keeps tracks of the score, if the ai responds in a positive way, user has this score they need more hearts
#some sort of helper method that calls the backend when they need
#
    try:
        resp = model.generate_content(prompt)
        text = (getattr(resp, "text", "") or "").strip()
        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        if lines:
            return lines[:3]
        # fallback by stage then generic
        fall = c.get("fallback", {})
        return fall.get(str(stage)) or fall.get("1") or ["(They smile quietly.)"]
    except Exception as e:
        print(f"Gemini API error: {e}")
        fall = c.get("fallback", {})
        return fall.get(str(stage)) or fall.get("1") or ["(They seem lost in thought.)"]

# ──────────────────────────────────────────────────────────────────────────────
# FLASK APP + ROUTES
# ──────────────────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.get("/")
def home():
    return jsonify({
        "status": "online",
        "gemini": {
            "model": MODEL_NAME,
            "temperature": TEMP,
            "top_p": TOP_P,
            "top_k": TOP_K
        },
        "endpoints": {
            "dialogue": "/api/dialogue/generate",
            "characters_upsert": "/api/characters",
        },
        "availableNPCs": sorted(characters.keys())
    })

# Generate dialogue
@app.post("/api/dialogue/generate")
def dialogue():
    try:
        body = request.get_json(silent=True) or {}
        npc_id_raw = body.get("npcId")
        if not npc_id_raw:
            return jsonify({"status": "error", "error": "npcId is required"}), 400

        npc_id = resolve_npc_id(npc_id_raw)
        if not npc_id:
            return jsonify({
                "status": "error",
                "error": f"NPC '{npc_id_raw}' not found",
                "availableNPCs": sorted(characters.keys())
            }), 404

        ctx = body.get("context", {}) or {}
        stage = int(ctx.get("stage", 1))
        player_text = ctx.get("playerText", "")

        print(f"\nGenerating dialogue for {npc_id} at stage {stage}...")
        lines = generate_character_dialogue(npc_id, stage, player_text)

        resp = {
            "status": "success",
            "npcId": npc_id,
            "stage": stage,
            "lines": lines,
            "nextStage": stage + 1
            "rating": rating
        }
        print(f"Response: {resp}")
        return jsonify(resp)
    except Exception as e:
        print(f"Error in dialogue endpoint: {str(e)}")
        return jsonify({"status": "error", "error": str(e)}), 500

# Upsert a character at runtime (e.g., Aya)
@app.post("/api/characters")
def upsert_character():
    try:
        body = request.get_json(silent=True) or {}
        cid = (body.get("id") or body.get("name") or "").strip()
        if not cid:
            return jsonify({"status": "error", "error": "id is required"}), 400
        record = register_character(cid, body)
        return jsonify({"status": "success", "id": cid, "character": record})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# Quick Gemini ping
@app.post('/api/gemini/test')
def gemini_test():
    """POST JSON {"prompt": "..."} → returns generated text."""
    try:
        body = request.get_json(silent=True) or {}
        prompt = body.get('prompt', "Say a single friendly sentence: 'Hello from Gemini!'.")
        print(f"Running Gemini test prompt: {prompt}")
        resp = model.generate_content(prompt)
        text = getattr(resp, 'text', None) or str(resp)
        return jsonify({'status': 'success', 'prompt': prompt, 'text': text})
    except Exception as e:
        print(f"Gemini test error: {e}")
        return jsonify({ 'status': 'error', 'error': str(e) }), 500

# List available models (helpful for debugging model names)
@app.get("/api/gemini/models")
def list_models():
    try:
        r = requests.get(
            "https://generativelanguage.googleapis.com/v1beta/models",
            params={"key": GEMINI_API_KEY},
            timeout=10
        )
        return jsonify(r.json()), r.status_code
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# ──────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Starting Flask server on http://localhost:5001")
    app.config["JSON_SORT_KEYS"] = False
    app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True
    app.run(debug=True, host="localhost", port=5001)

