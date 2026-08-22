import re

with open('src/pages/TeamWorkspacePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the '?' with '?'
content = content.replace('Pay ?{team.costPerMemberBDT}', 'Pay ?{team.costPerMemberBDT}')

# Remove manual transfer UI block
# Everything from 'OR MANUAL TRANSFER' up to 'Submit Payment Proof for Verification'
content = re.sub(r'<div className="flex items-center gap-4 py-2">[\s\S]*?Submit Payment Proof for Verification[\s\S]*?</Button>\s*</form>\s*</Card>', '', content)

# Remove handlePaymentSubmit function
content = re.sub(r'  const handlePaymentSubmit = \(e: React.FormEvent\) => \{[\s\S]*?setProofPreview\(null\);\s*\};', '', content)

# Also remove the 	xIdInput state since we don't use it anymore
content = re.sub(r'  const \[txIdInput, setTxIdInput\] = useState\(''\);\n', '', content)

with open('src/pages/TeamWorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
