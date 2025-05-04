import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import OTPForm from '../components/OTPForm';
import LoginForm from '../components/LoginForm';

const AuthPage = () => {
  const [email, setEmail] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showLogin) {
      setShowLogin(true);
      setEmail(null); 
    } else if (location.state?.showOTP && location.state?.email) {
      setEmail(location.state.email);
      setShowLogin(false);
    }
  }, [location]);
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
      <div className="w-full max-w-md">
        {!email ? (
          showLogin ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )
        ) : (
          <OTPForm 
            email={email} 
            onSuccess={() => {
              setEmail(null);
              setShowLogin(true);
            }} 
          />
        )}
        <div className="text-center mt-6">
          <button
            className="text-blue-700 font-semibold hover:text-blue-900 transition underline underline-offset-4"
            onClick={() => {
              setShowLogin(!showLogin);
              setEmail(null);
            }}
          >
            {showLogin ? 'Need to signup?' : 'Already have an account?'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
