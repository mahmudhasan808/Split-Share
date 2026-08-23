import re

with open('backend/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('http://localhost:5173/workspace', '/workspace')
content = content.replace('http://localhost:5173/dashboard', '/dashboard')

# Also the api endpoints in initialization
content = content.replace('http://localhost:4000/api', '/api')

with open('backend/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
