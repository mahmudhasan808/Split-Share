import re

with open('src/pages/TeamWorkspacePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update the button text
content = content.replace('Submit TxID Now ?', 'Make Payment ?')

# Also update the description paragraph slightly to remove "via {team.paymentMethod}" if we are strictly using SSLCommerz
content = re.sub(r'Submit your (.*?) payment via \{team\.paymentMethod\} to unlock the shared subscription credentials\.', r'Submit your \1 payment to unlock the shared subscription credentials.', content)

with open('src/pages/TeamWorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
