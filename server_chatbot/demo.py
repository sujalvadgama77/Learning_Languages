import json
import random

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
    return {random.choice(q_list) for category, q_list in questions.items() if q_list}

# Example usage
language = "hindi"  # Change this to "gujarati" or another language
questions_data = load_questions(language)

if questions_data:
    random_questions = select_random_questions(questions_data)
    print("Selected Questions:", random_questions)
