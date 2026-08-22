import sys

with open('src/pages/ManageTeamPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('bKash / Nagad Payment Verification', 'Automated SSLCommerz Payments')

content = content.replace('Billing Verification ({teamPayments.filter((p: any) => p.status === \'PENDING\').length} pending)', 'Billing History')

# The exact block to remove:
block_to_remove = '''                    {pay.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="danger" onClick={() => rejectPaymentReq({ variables: { id: pay.id } })}>
                          Reject
                        </Button>
                        <Button size="sm" variant="success" onClick={() => verifyPaymentReq({ variables: { id: pay.id } })}>
                          Verify & Grant Credentials
                        </Button>
                      </div>
                    )}'''

if block_to_remove in content:
    content = content.replace(block_to_remove, '')
else:
    print("Block not found!")

with open('src/pages/ManageTeamPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
