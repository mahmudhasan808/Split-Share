import re

with open('backend/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("data: { status: 'verified' }", "data: { status: 'VERIFIED' }")
content = content.replace("data: { status: 'rejected' }", "data: { status: 'REJECTED' }")

content = content.replace("cus_name: user.name", "cus_name: (user as any).name")
content = content.replace("cus_email: user.email", "cus_email: (user as any).email")
content = content.replace("ship_name: user.name", "ship_name: (user as any).name")

with open('backend/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
