// src/components/LoginForm.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      setMsg(res.data.message);

      login(res.data.token, res.data.user); 
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl border border-blue-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2 justify-center">
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4' /></svg>
        Login
      </h2>
      <div className="space-y-4">
        <input
          type="email"
          className="border border-blue-200 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition mb-2 bg-white placeholder-blue-300"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border border-blue-200 w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition mb-2 bg-white placeholder-blue-300"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-full py-3 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition"
          onClick={handleLogin}
        >
          Login
        </button>
        {msg && <p className="text-sm mt-2 text-center text-red-500">{msg}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
