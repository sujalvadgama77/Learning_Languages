from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import google.generativeai as genai  
import random 
import json

app = Flask(__name__)
CORS(app)  

load_dotenv()

# Configure API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Model settings
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

# Initialize Gemini model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash", 
    generation_config=generation_config, 
    safety_settings=safety_settings
)

# Separate chat histories and question tracking for each language
chat_histories = {
    "hindi": [],
    "english": [],
    "gujarati": []
}
question_indexes = {
    "hindi": 0,
    "english": 0,
    "gujarati": 0
}
def load_questions(language):
    """Loads questions from a JSON file based on language."""
    file_path = f"que_{language}.json"
    
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            questions = json.load(file)
        return questions
    except FileNotFoundError:
        print(f"Error: {file_path} not found!")
        return {}

def select_random_questions(questions):
    """Selects one random question from each category."""
    return [random.choice(q_list) for category, q_list in questions.items() if q_list]


# Function to handle chat in a specific language
def handle_chat(language, greeting):
    """Handles AI conversation in the given language with sequential question flow."""
    selected_questions = select_random_questions(load_questions(language))
    chat_history = chat_histories[language]  
    question_index = question_indexes[language]  

    # If it's the first message, start the conversation
    if not chat_history:
        chat_history.append({"role": "system", "content": f"Respond in {language.capitalize()} only."})
        chat_history.append({"role": "assistant", "content": greeting})  # Greeting first
        chat_history.append({"role": "assistant", "content": selected_questions[0]})
        question_indexes[language] = 1  # Move to the next question
        return jsonify({"response": selected_questions[0], "history": chat_history})

    data = request.json
    user_input = data.get("text", "").strip()

    if not user_input:
        return jsonify({"error": "No text provided"}), 400

    try:
        # Append user's response to history
        chat_history.append({"role": "user", "content": user_input})

        # Check if there are more questions left
        if question_indexes[language] < len(selected_questions):
            next_question = selected_questions[question_indexes[language]]  # Get the correct question
            question_indexes[language] += 1  # Increment BEFORE adding to history
            chat_history.append({"role": "assistant", "content": next_question})
            return jsonify({"response": next_question, "history": chat_history})
        
        # If all questions are answered, proceed with normal conversation
        conversation_context = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
        response = model.generate_content(conversation_context)
        ai_reply = response.text if response else "No response from AI"
        chat_history.append({"role": "assistant", "content": ai_reply})

        return jsonify({"response": ai_reply, "history": chat_history})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/chat/hindi', methods=['POST'])
def chat_hindi():
    """Chat endpoint for Hindi communication."""
    return handle_chat("hindi", "नमस्ते! क्या आप तैयार हैं?")

@app.route('/chat/english', methods=['POST'])
def chat_english():
    """Chat endpoint for English communication."""
    return handle_chat("english", "Hello! Are you ready to begin?")

@app.route('/chat/gujarati', methods=['POST'])
def chat_gujarati():
    """Chat endpoint for Gujarati communication."""
    return handle_chat("gujarati", "જાય શ્રી કૃષ્ણ! તમે તૈયાર છો?")

@app.route('/chat/hindi/reset', methods=['POST'])
def reset_hindi_chat():
    """Clears chat history for Hindi language and resets question index."""
    chat_histories["hindi"].clear()
    question_indexes["hindi"] = 0
    return jsonify({"message": "Hindi chat history cleared!"})

@app.route('/chat/english/reset', methods=['POST'])
def reset_english_chat():
    """Clears chat history for English language and resets question index."""
    chat_histories["english"].clear()
    question_indexes["english"] = 0
    return jsonify({"message": "English chat history cleared!"})

@app.route('/chat/gujarati/reset', methods=['POST'])
def reset_gujarati_chat():
    """Clears chat history for Gujarati language and resets question index."""
    chat_histories["gujarati"].clear()
    question_indexes["gujarati"] = 0
    return jsonify({"message": "Gujarati chat history cleared!"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
