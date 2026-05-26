import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import useStore from '../store';
import logo from '../assets/logo.svg';

function LoginPage() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="CollabWrite" className="w-16 h-16 animate-fade-in" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-dark-400">Sign in to your CollabWrite account</p>
        </div>

        {/* Form Card */}
        <div className="glass-card animate-slide-up">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
