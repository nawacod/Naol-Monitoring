import os
import json
import math

# --- Configuration ---
local_video_folder = r"C:\Users\user\Desktop\startup\cropped_videos"
gcs_bucket_uri = "gs://my-vision-dataset-bucket-123" # Make sure to put your real bucket name!
output_jsonl_file = "vertex_ai_dataset.jsonl"

# 1. Abstracted prompt (Removed "on the desk" to force generalization)
prompt_text = "Task: Analyze this video clip. Briefly describe the physical trajectory of the individual's hand and the cash, then state the final classification as 'Verdict: cash_pocketing' or 'Verdict: normal'."

# --- Step 1: Auto-Balance Calculation ---
# Count the files first so the script can perfectly balance itself
theft_count = 0
normal_count = 0

for filename in os.listdir(local_video_folder):
    if filename.endswith(".mp4"):
        if "cash_pocketing" in filename.lower():
            theft_count += 1
        elif "normal" in filename.lower():
            normal_count += 1

# Calculate how many times to multiply the theft videos to match the normal videos
if theft_count > 0:
    multiplier = math.ceil(normal_count / theft_count)
else:
    multiplier = 1

print(f"Found {normal_count} Normal videos and {theft_count} Theft videos.")
print(f"Auto-applying a {multiplier}x multiplier to Theft videos to achieve balance...\n")

dataset_lines = []

# --- Step 2: Process Videos ---
for filename in os.listdir(local_video_folder):
    # Updated to look for .mp4 because your cropping script changed the extensions
    if filename.endswith(".mp4"):
        
        file_uri = f"{gcs_bucket_uri}/{filename}"
        
        # 2. Abstracted Expected Outputs (Removed room-specific words to train pure physics)
        if "cash_pocketing" in filename.lower():
            expected_output = "The individual secures the cash from the surface and moves their hand directly downward toward their body or pocket to conceal it. Verdict: cash_pocketing"
            current_multiplier = multiplier 
        
        elif "normal" in filename.lower():
            # This covers counting, scratching, or pocketing a phone (since it notes cash is kept visible or no cash is pocketed)
            expected_output = "The individual handles items or cash within the visible workspace, or performs hand movements without concealing cash. Verdict: normal"
            current_multiplier = 1 
        
        else:
            continue
        
        # Build the strict Gemini tuning JSON structure
        json_object = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "fileData": {
                                "mimeType": "video/mp4", # Updated to mp4
                                "fileUri": file_uri
                            }
                        },
                        {
                            "text": prompt_text
                        }
                    ]
                },
                {
                    "role": "model",
                    "parts": [
                        {
                            "text": expected_output
                        }
                    ]
                }
            ]
        }
        
        # Add to dataset_lines based on the multiplier
        for _ in range(current_multiplier):
            dataset_lines.append(json_object)

# --- Save to JSONL ---
with open(output_jsonl_file, "w") as f:
    for line in dataset_lines:
        f.write(json.dumps(line) + "\n")

print(f"✅ Successfully generated {output_jsonl_file} with {len(dataset_lines)} total training examples!")