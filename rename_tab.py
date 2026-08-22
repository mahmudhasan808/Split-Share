import re

with open('src/pages/TeamWorkspacePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Billing & TxID Submission', 'Billing')

with open('src/pages/TeamWorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
