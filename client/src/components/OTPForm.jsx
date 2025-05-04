import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const OTPForm = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.post('/auth/verify-otp', { email, otp });
      setMsg(res.data.message);
      
      onSuccess();
      
      navigate('/auth', { state: { showLogin: true } });

    } catch (err) {
      setMsg(err.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-gradient-to-br from-yellow-50 to-green-100 rounded-2xl shadow-xl border border-yellow-200 mt-4">
      <h2 className="text-2xl font-bold mb-6 text-yellow-700 flex items-center gap-2 justify-center">
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-yellow-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4' /></svg>
        Verify OTP
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          className="border border-yellow-200 w-full p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition mb-2 bg-white placeholder-yellow-300"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className="bg-gradient-to-r from-yellow-500 to-green-500 text-white w-full py-3 rounded-lg font-semibold shadow hover:from-yellow-600 hover:to-green-600 transition"
          onClick={handleVerify}
        >
          Verify
        </button>
        {msg && <p className="text-sm mt-2 text-center text-red-500">{msg}</p>}
      </div>
    </div>
  );
};

export default OTPForm;
