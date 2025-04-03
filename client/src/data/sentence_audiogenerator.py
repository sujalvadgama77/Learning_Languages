import os
import re
import json
from gtts import gTTS

# Step 1: Load and parse the JS file
with open("client/src/data/shlok_eng.js", "r", encoding="utf-8") as file:
    js_content = file.read()

# Clean JS -> JSON
array_text = re.sub(r'^export const \w+\s*=\s*', '', js_content).strip()  # Remove the export statement
array_text = re.sub(r';\s*$', '', array_text)  # Remove the trailing semicolon

# Replace keys without quotes with keys wrapped in quotes (this is to make the object keys valid JSON)
array_text = re.sub(r'(\w+):', r'"\1":', array_text)

# Replace single quotes with double quotes for string values
array_text = array_text.replace("'", '"')

# Remove trailing commas before closing braces or brackets
array_text = re.sub(r',\s*([}\]])', r'\1', array_text)

# Now print the array_text to verify the format before parsing
print(array_text)  # Debugging step: Check if the format looks correct

# Step 2: Parse the cleaned JSON string
try:
    data = json.loads(array_text)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    # If you need to investigate further, you can print the problematic content here
    exit()

# Create output folder
os.makedirs("mp3_output", exist_ok=True)

# Step 3: Generate MP3s using gTTS (Hindi language for pronunciation)
for item in data:
    text_to_speech_sentence = item.get("english")  # Extract English sentence for text
    pronunciation = item.get("pronunciation")  # Extract pronunciation for filename
    if text_to_speech_sentence and pronunciation:
        try:
            # Use the English sentence for the TTS text, and lang='en' for English pronunciation
            tts = gTTS(text=text_to_speech_sentence, lang='en', tld='co.in')  # English text-to-speech
            filename = f"mp3_output/{pronunciation}.mp3"  # Use pronunciation as filename
            tts.save(filename)
            print(f"Saved: {filename}")
        except Exception as e:
            print(f"Error generating MP3 for {pronunciation}: {e}")

print(f"\n✅ All MP3s saved")
