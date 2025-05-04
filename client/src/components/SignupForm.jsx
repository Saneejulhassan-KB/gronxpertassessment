import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post('/auth/signup', { email, password });
      setMsg(res.data.message);
     
      localStorage.setItem('signup_email', email);
     
      navigate('/auth', { 
        state: { 
          email,
          showOTP: true 
        } 
      });
    } catch (err) {
      setMsg(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-gradient-to-br from-green-50 to-blue-100 rounded-2xl shadow-xl border border-green-200">
      <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2 justify-center">
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4' /></svg>
        Signup with Email
      </h2>
      <div className="space-y-4">
        <input
          type="email"
          className="border border-green-200 w-full p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition mb-2 bg-white placeholder-green-300"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border border-green-200 w-full p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition mb-2 bg-white placeholder-green-300"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-full py-3 rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-600 transition"
          onClick={handleSignup}
        >
          Send OTP
        </button>
        {msg && <p className="text-sm mt-2 text-center text-red-500">{msg}</p>}
      </div>
    </div>
  );
};

export default SignupForm;
