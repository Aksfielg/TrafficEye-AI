import json
import re

transcript_path = r"C:\Users\risha\.gemini\antigravity-ide\brain\afaf85b0-0d6e-4bf9-a178-b96e7970e315\.system_generated\logs\transcript.jsonl"
target_file = r"c:\Users\risha\OneDrive\Documents\Desktop\TrafficEye AI\traffic-eye-ai\backend\routes\analyze.py"

analyze_content = ""
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'VIEW_FILE' and 'analyze.py' in data.get('content', ''):
            content = data['content']
            if 'Showing lines 1 to 143' in content:
                analyze_content = content

if analyze_content:
    lines = analyze_content.split('\n')
    extracted_lines = []
    capture = False
    for l in lines:
        if '1: import os' in l:
            capture = True
        if capture:
            if l.startswith('The above content'):
                break
            # Remove line number '1: '
            match = re.match(r'^\d+: (.*)', l)
            if match:
                extracted_lines.append(match.group(1))
            else:
                extracted_lines.append(l)
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(extracted_lines))
    print("RESTORED analyze.py")
else:
    print("COULD NOT FIND analyze.py content")
