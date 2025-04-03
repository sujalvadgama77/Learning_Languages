import os
import pandas as pd
from gtts import gTTS

# Load CSV file
data = pd.read_csv(r"D:\Internship Outamation\Learning-Languages\client\src\data\csv\shlok_output.csv", encoding="utf-8")

# Create output folder
os.makedirs("mp3_output", exist_ok=True)

# Generate MP3s using gTTS (Gujarati language for pronunciation)
for index, row in data.iterrows():
    gujarati_word = row["english"]  # Extract Gujarati word (for text)
    pronunciation = row["pronunciation"]  # Extract pronunciation for filename
    
    if pd.notna(gujarati_word) and pd.notna(pronunciation):  # Check for valid data
        try:
            # Generate speech using Gujarati text
            tts = gTTS(text=gujarati_word, lang='en', tld='co.in')  # Gujarati (Indian accent)
            filename = f"mp3_output/{pronunciation}.mp3"  # Save as pronunciation.mp3
            tts.save(filename)
            print(f"Saved: {filename}")
        except Exception as e:
            print(f"Error generating MP3 for {pronunciation}: {e}")

print("\n✅ All MP3s saved")
