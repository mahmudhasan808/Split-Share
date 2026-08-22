with open('src/pages/TeamWorkspacePage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
count = 0

for line in lines:
    if 'const handleSSLCommerzInit = async () => {' in line:
        count += 1
        if count > 1:
            skip = True
    
    if skip and 'const handlePaymentSubmit = (e: React.FormEvent) => {' in line:
        skip = False
        # We also don't append this line because the previous block probably ended right before it, 
        # wait, we need to append handlePaymentSubmit.
        new_lines.append(line)
        continue
        
    if not skip:
        new_lines.append(line)

with open('src/pages/TeamWorkspacePage.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
