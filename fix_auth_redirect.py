import re

with open('src/pages/AuthPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a check for currentUser at the top of the component
inject_str = '''  const navigate = useNavigate();

  // Redirect if already logged in
  if (useAuth().currentUser) {
    navigate('/dashboard', { replace: True });
  }'''

content = content.replace('  const navigate = useNavigate();', inject_str)

with open('src/pages/AuthPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
