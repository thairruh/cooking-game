from flask import Flask, request, jsonify
from flask_cors import CORS
from time import time
import os
from dotenv import load_dotenv
import google.generativeai as genai
from characters import characters


load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
token = os.getenv("SECRET_TOKEN")

# Configure Gemini API
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-pro')

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "endpoints": {
            "dialogue": "/api/dialogue/generate",
            "menu": "/api/menu",
            "recipes": "/api/recipes/<dish_id>",
            "orders": "/api/orders"
        }
    })




# @app.post("/api/orders")
# def create_order():
#     data = request.get_json()
#     oid = f"ord_{int(time()*1000)}"
#     ORDERS[oid] = {"customerId":data["customerId"]}
#     return jsonify({"customer":CHARACTERS[data["customerId"]]})

# @app.post("/api/orders/<oid>/finish")
# def finish(oid):
#     body = request.get_json()
#     score = sum(s.get("score",0) for s in body.get("totalStepScores",[]))
#     ORDERS[oid]["score"] = score
#     return jsonify({"finalScore":score,"tags":["demo_tag"]})

def generate_character_dialogue(npc_id, stage):
    print(f"\nProcessing dialogue request:")
    print(f"- Character ID: {npc_id}")
    print(f"- Stage: {stage}")
    
    # First try the new characters dictionary
    if npc_id in characters:
        character = characters[npc_id]
        print(f"Found character in new dictionary: {npc_id}")
        print(f"- Backstory: {character['Backstory']}")
        print(f"- Arc: {character['Arc']}")
        
        prompt = f"""
        You are {npc_id}, with this backstory: {character['Backstory']}
        Your character arc is: {character['Arc']}
        You are in a small restaurant and the player is serving you food.
        Stage {stage} of the interaction.
        Generate 2-3 lines of natural dialogue that reflects your character's personality and story.
        Keep responses brief and conversational.
        """
        
        try:
            print("Generating response with Gemini...")
            response = model.generate_content(prompt)
            dialogue_lines = [line.strip() for line in response.text.split('\n') if line.strip()]
            print(f"Generated lines: {dialogue_lines[:3]}")
            return dialogue_lines[:3]
        except Exception as e:
            print(f"Gemini API error: {e}")
            # Fall back to basic response
            fallback = ["Enjoy your meal."]
            print(f"Using fallback response: {fallback}")
            return fallback
            
        
    # If character not found in dictionary
    print(f"Character {npc_id} not found in any dictionary")
    return ["I'm not sure who that is."]

@app.post("/api/dialogue/generate")
def dialogue():
    try:
        body = request.get_json()
        if not body:
            return jsonify({
                "error": "No JSON data provided",
                "status": "error"
            }), 400

        npc_id = body.get("customerId")
        if not npc_id:
            return jsonify({
                "error": "customerId is required",
                "status": "error"
            }), 400

        stage = body.get("context", {}).get("stage", 1)
        player_text = body.get("context", {}).get("playerText", "")
        print(f"\nGenerating dialogue for {npc_id} at stage {stage}...")
        
        lines = generate_character_dialogue(npc_id, stage)
        
        response = {
            "status": "success",
            "character": npc_id,
            "stage": stage,
            "lines": lines,
            "nextStage": stage + 1
        }
        print(f"Response: {response}")
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in dialogue endpoint: {str(e)}")
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Server will be available at http://localhost:5001")
    # Enable more verbose output
    app.config['JSON_SORT_KEYS'] = False
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
    app.run(debug=True, host='localhost', port=5001)