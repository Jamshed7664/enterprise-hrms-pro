"""Create a source ZIP that excludes local files and secrets.

Usage: python scripts/create_release_zip.py
Review the resulting ZIP manually before uploading to a sales platform.
"""
from pathlib import Path
import zipfile
root = Path(__file__).resolve().parents[1]
output = root.parent / f'{root.name}-Source.zip'
excluded = {'.git', '.angular', 'node_modules', 'dist', 'target', 'data', 'uploads', '.idea', '.env', '__pycache__', '.venv', 'coverage'}
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=8) as archive:
    for path in sorted(root.rglob('*')):
        rel = path.relative_to(root)
        if not path.is_file() or any(part in excluded for part in rel.parts) or (path.name.startswith('.env') and path.name != '.env.example'):
            continue
        if path.suffix in {'.log', '.class', '.jar', '.zip', '.pyc'}:
            continue
        archive.write(path, str(root.name + '/' + str(rel)))
print(output)
