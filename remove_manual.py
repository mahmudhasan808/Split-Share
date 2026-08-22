import re

with open('src/pages/TeamWorkspacePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the '?' with '?'
content = content.replace('Pay ?{team.costPerMemberBDT}', 'Pay ?{team.costPerMemberBDT}')

# Remove manual transfer UI block
search_str = '''            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">OR MANUAL TRANSFER</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <Card className="p-6 opacity-75 hover:opacity-100 transition-opacity">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                1. Transfer Payment to Team Host
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Accepted Method</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <CreditCard className="w-4 h-4 text-indigo-500" />
                    <span>{team.paymentMethod} Personal</span>
                  </h4>
                  <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {team.paymentNumber}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                  onClick={() => handleCopy(team.paymentNumber, \\ Number\)}
                >
                  Copy Number
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                2. Submit bKash / Nagad Transaction ID
              </h3>
              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4 max-w-md">
                <Input
                  label="Transaction ID (TxID)"
                  placeholder="e.g. BK9928172X or NG7739011Z"
                  value={txIdInput}
                  onChange={e => setTxIdInput(e.target.value)}
                  required
                />

                <Button type="submit" variant="primary" leftIcon={<Send className="w-4 h-4" />}>
                  Submit Payment Proof for Verification
                </Button>
              </form>
            </Card>'''

content = content.replace(search_str, '')

# Remove handlePaymentSubmit function
fn_str = '''  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !txIdInput) return;
    submitPayment({
      variables: {
        teamId: team.id,
        amount: team.costPerMemberBDT,
        method: team.paymentMethod,
        transactionId: txIdInput
      }
    });
    setTxIdInput('');
    setProofPreview(null);
  };'''

content = content.replace(fn_str, '')

with open('src/pages/TeamWorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
