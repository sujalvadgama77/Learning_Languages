import os
import pandas as pd

# Sample data based on the reference file
data = [
  {
    "english": "Hello, How are you?",
    "pronunciation": "he-lō, hau aar yoo?"
  },
]
    
# Convert to DataFrame
df = pd.DataFrame(data)

# Save to CSV file
csv_file_path = r"D:\Internship Outamation\Learning-Languages\client\src\data\csv\shlok_output.csv"
df.to_csv(csv_file_path, index=False, encoding="utf-8-sig")

csv_file_path
# print(f"CSV file saved at: {csv_file_path}")

print(os.getcwd())