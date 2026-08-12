import json

with open('src/messages/en-US.json', 'r') as f:
    en_us = json.load(f)

with open('src/messages/zh-CN.json', 'r') as f:
    zh_cn = json.load(f)

missing = []

def find_missing(en, zh, path=""):
    for k, v in en.items():
        if k not in zh:
            missing.append(f"{path}{k}")
            zh[k] = v
        elif isinstance(v, dict):
            if not isinstance(zh[k], dict):
                print(f"Type mismatch at {path}{k}")
            else:
                find_missing(v, zh[k], path + k + ".")

find_missing(en_us, zh_cn)
print("Missing keys added to zh-CN:", missing)

with open('src/messages/zh-CN-merged.json', 'w', encoding='utf-8') as f:
    json.dump(zh_cn, f, ensure_ascii=False, indent=2)
