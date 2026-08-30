import re

with open('backend/src/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

bad_init_urls = '''        success_url: `/api/payments/sslcommerz/success`,
        fail_url: `/api/payments/sslcommerz/fail`,
        cancel_url: `/api/payments/sslcommerz/cancel`,
        ipn_url: `/api/payments/sslcommerz/ipn`,'''

good_init_urls = '''        success_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/success`,
        fail_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/fail`,
        cancel_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/cancel`,
        ipn_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/ipn`,'''

content = content.replace(bad_init_urls, good_init_urls)

content = content.replace('res.redirect(`/workspace/${payment.teamId}?payment=success`);', 'res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/${payment.teamId}?payment=success`);')
content = content.replace('res.redirect(`/dashboard?payment=fail`);', 'res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?payment=fail`);')
content = content.replace('res.redirect(`/workspace/${payment.teamId}?payment=fail`);', 'res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/${payment.teamId}?payment=fail`);')
content = content.replace('res.redirect(`/workspace/${payment.teamId}?payment=cancel`);', 'res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/${payment.teamId}?payment=cancel`);')
content = content.replace('res.redirect(`/dashboard`);', 'res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`);')

with open('backend/src/index.ts', 'w', encoding='utf-8') as f:
    f.write(content)
