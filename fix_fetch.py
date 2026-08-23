import re

with open('src/pages/TeamWorkspacePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("fetch(/payments/sslcommerz/init", "fetch(${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/payments/sslcommerz/init")

with open('src/pages/TeamWorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
