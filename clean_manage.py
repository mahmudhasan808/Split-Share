import re

with open('src/pages/ManageTeamPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change title
content = content.replace(
    'bKash / Nagad Payment Verification',
    'Automated SSLCommerz Payments'
)

# Remove manual verify buttons
content = re.sub(
    r'\{pay\.status === \'PENDING\' && \([\s\S]*?\}\)',
    '',
    content
)

# Update the sub-nav tab text to remove "(X pending)" since they don't manually approve
content = re.sub(
    r'Billing Verification \(\{teamPayments\.filter\(\(p: any\) => p\.status === \'PENDING\'\)\.length\} pending\)',
    'Billing History',
    content
)

# Also rename the handle verify/reject mutations in the file if needed, but not strictly necessary since they won't be used
# It's fine to leave them unused.

with open('src/pages/ManageTeamPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
