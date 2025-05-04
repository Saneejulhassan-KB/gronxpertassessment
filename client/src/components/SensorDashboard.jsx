import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../api/axiosInstance';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const SensorDashboard = () => {
  const [data, setData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    const socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: {
        token: token
      }
    });

    // Fetch historical data
    const fetchHistoricalData = async () => {
      try {
        console.log('Fetching historical data...');
        const response = await axios.get('/sensor/historical');
        console.log('Historical data response:', response.data);
        setData(response.data.reverse());
      } catch (error) {
        console.error('Error fetching historical data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
        } else {
          setError('Failed to fetch historical data');
        }
      }
    };

    fetchHistoricalData();

    // Socket.IO event listener
    socket.on('sensorData', (newData) => {
      setData(prevData => [...prevData, newData].slice(-100));
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      if (err.message === 'Authentication error') {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    });

    return () => {
      socket.off('sensorData');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [navigate]);

  const toggleSimulation = async () => {
    try {
      if (isSimulating) {
        await axios.post('/sensor/stop');
      } else {
        await axios.post('/sensor/start');
      }
      setIsSimulating(!isSimulating);
    } catch (error) {
      console.error('Error toggling simulation:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      } else {
        setError('Failed to toggle simulation');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-blue-700 drop-shadow">Sensor Dashboard</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/flowchart')}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700 transition"
          >
            <span className="inline-flex items-center gap-1">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2a4 4 0 014-4h4m0 0V7m0 4v4' /></svg>
              Create Chart
            </span>
          </button>
          <button
            onClick={toggleSimulation}
            className={`px-5 py-2 rounded-lg font-semibold shadow transition text-white ${isSimulating ? 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700' : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700'}`}
          >
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold shadow hover:from-gray-500 hover:to-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
          <h3 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2">
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3' /></svg>
            Temperature
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-green-100">
          <h3 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-green-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3' /></svg>
            Humidity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-yellow-100 md:col-span-2">
          <h3 className="text-xl font-bold mb-4 text-yellow-600 flex items-center gap-2">
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-yellow-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3' /></svg>
            Pressure
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pressure" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard; 