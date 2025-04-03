import os
import re
import json
from gtts import gTTS

# Step 1: Load and parse the JS file
with open("client/src/data/words_eng.js", "r", encoding="utf-8") as file:
    js_content = file.read()

# Clean JS -> JSON
array_text = re.sub(r'^export const \w+\s*=\s*', '', js_content).strip()
array_text = re.sub(r';\s*$', '', array_text)
array_text = re.sub(r'(\w+):', r'"\1":', array_text)
array_text = array_text.replace("'", '"')
array_text = re.sub(r',\s*([}\]])', r'\1', array_text)

# Parse the cleaned JSON string
data = json.loads(array_text)

# Create output folder
os.makedirs("mp3_output", exist_ok=True)

# Step 2: Generate MP3s using gTTS (Gujarati language for pronunciation)
for item in data:
    gujarati_word = item.get("english")  # Extract Gujarati word (for text)
    pronunciation = item.get("pronunciation")  # Extract pronunciation for filename
    if gujarati_word and pronunciation:
        try:
            # Use the Gujarati word for the TTS text, and lang='gu' for Gujarati pronunciation
            tts = gTTS(text=gujarati_word, lang='en', tld='co.in')  # Gujarati (Indian accent)
            filename = f"mp3_output/{gujarati_word}_{pronunciation}.mp3"  # Use Gujarati word and pronunciation as filename
            tts.save(filename)
            print(f"Saved: {filename}")
        except Exception as e:
            print(f"Error generating MP3 for {pronunciation}: {e}")

# Step 3: Zip the files (optional)
# zip_filename = "pronunciations.zip"
# with ZipFile(zip_filename, "w") as zipf:
#     for file in os.listdir("mp3_output"):
#         zipf.write(f"mp3_output/{file}", arcname=file)

print(f"\n✅ All MP3s saved")
import os
import re
import json
from gtts import gTTS

# Step 1: Load and parse the JS file
with open("client/src/data/words_guj.js", "r", encoding="utf-8") as file:
    js_content = file.read()

# Clean JS -> JSON
array_text = re.sub(r'^export const \w+\s*=\s*', '', js_content).strip()
array_text = re.sub(r';\s*$', '', array_text)
array_text = re.sub(r'(\w+):', r'"\1":', array_text)
array_text = array_text.replace("'", '"')
array_text = re.sub(r',\s*([}\]])', r'\1', array_text)

# Parse the cleaned JSON string
data = json.loads(array_text)

# Create output folder
os.makedirs("mp3_output", exist_ok=True)

# Step 2: Generate MP3s using gTTS (Gujarati language for pronunciation)
for item in data:
    gujarati_word = item.get("gujarati")  # Extract Gujarati word (for text)
    pronunciation = item.get("pronunciation")  # Extract pronunciation for filename
    if gujarati_word and pronunciation:
        try:
            # Use the Gujarati word for the TTS text, and lang='gu' for Gujarati pronunciation
            tts = gTTS(text=gujarati_word, lang='gu', tld='co.in')  # Gujarati (Indian accent)
            filename = f"mp3_output/{pronunciation}.mp3"  # Use Gujarati word and pronunciation as filename
            tts.save(filename)
            print(f"Saved: {filename}")
        except Exception as e:
            print(f"Error generating MP3 for {pronunciation}: {e}")

# Step 3: Zip the files (optional)
# zip_filename = "pronunciations.zip"
# with ZipFile(zip_filename, "w") as zipf:
#     for file in os.listdir("mp3_output"):
#         zipf.write(f"mp3_output/{file}", arcname=file)

print(f"\n✅ All MP3s saved")
