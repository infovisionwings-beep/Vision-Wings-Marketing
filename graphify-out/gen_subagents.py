import json
from pathlib import Path

template = Path('C:/Users/wwwsr/.gemini/config/skills/graphify/references/extraction-spec.md').read_text(encoding='utf-8')
template = template.split('`')[1].strip()

uncached = [line.strip() for line in Path('graphify-out/.graphify_uncached.txt').read_text(encoding='utf-8').splitlines() if line.strip()]

image_exts = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'}
docs = [f for f in uncached if Path(f).suffix.lower() not in image_exts]

chunks = [docs] # just 1 chunk

cwd = Path('.').resolve().as_posix()
chunk = chunks[0]

Path('graphify-out/.graphify_chunk_01.txt').write_text('\n'.join(chunk), encoding='utf-8')

chunk_path = f'{cwd}/graphify-out/.graphify_chunk_01.json'
file_list_str = '\n'.join(chunk)

prompt = template.replace('FILE_LIST', file_list_str)
prompt = prompt.replace('CHUNK_NUM', '1')
prompt = prompt.replace('TOTAL_CHUNKS', '1')
prompt = prompt.replace('DEEP_MODE', 'false')
prompt = prompt.replace('CHUNK_PATH', chunk_path)

subagent = {
    'TypeName': 'self',
    'Role': 'Semantic Extractor Docs',
    'Prompt': prompt,
    'Model': 'flash'
}

Path('graphify-out/.subagent_docs.json').write_text(json.dumps([subagent], indent=2, ensure_ascii=False), encoding='utf-8')
