import re

with open('src/pages/AuthPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = '''  const navigate = useNavigate();

  // Redirect if already logged in
  if (useAuth().currentUser) {
    navigate('/dashboard', { replace: true });
  }'''

new_str = '''  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);'''

content = content.replace(old_str, new_str)

with open('src/pages/AuthPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
