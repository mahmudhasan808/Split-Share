import re

with open('src/lib/apollo.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'http://localhost:4000/graphql'", "import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql'")

with open('src/lib/apollo.ts', 'w', encoding='utf-8') as f:
    f.write(content)


with open('src/pages/TeamWorkspacePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("'http://localhost:4000/api/payments/sslcommerz/init'", "${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/payments/sslcommerz/init")

with open('src/pages/TeamWorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
