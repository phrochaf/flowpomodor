// client/src/DashboardView.js

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function DashboardView({ user, categories }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Your new state variables!
  const [chartType, setChartType] = useState('pie');
  const [timeFilter, setTimeFilter] = useState('all');

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];
  const isProUser = false;

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }
    
    try {
      // We add orderBy to get the newest sessions first, which is more efficient.
      const sessionsQuery = query(collection(db, 'sessions'), where('userId', '==', user.uid));

      const unsubscribe = onSnapshot(sessionsQuery, (querySnapshot) => {
        const sessionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort the data in JavaScript instead of in the query
        sessionsData.sort((a, b) => b.timestamp - a.timestamp);
        // Limit to last 100 sessions for performance
        const limitedSessions = sessionsData.slice(0, 500);
        setSessions(limitedSessions);
        setLoading(false);
        setError(null);
      }, (error) => {
        console.error("Error fetching sessions:", error);
        setError("Failed to load sessions");
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up sessions listener:", error);
      setError("Failed to connect to database");
      setLoading(false);
    }
  }, [user]);

  // --- Filtering Logic ---
  const filteredSessions = sessions.filter(session => {
    if (!isProUser) {
      return true;
    }
    if (!session || !session.timestamp) return false;
    
    if (timeFilter === 'all') return true;
    
    const sessionDate = new Date(session.timestamp);
    const now = new Date();
    
    if (timeFilter === 'day') {
      return sessionDate.toDateString() === now.toDateString();
    }
    if (timeFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return sessionDate > oneWeekAgo;
    }
    if (timeFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return sessionDate > oneMonthAgo;
    }
    return true;
  });
  
  // The final, corrected chartData calculation!
  const chartData = filteredSessions.reduce((acc, session) => {
    if (!session || !session.category || !session.duration) return acc;
    
    const existingCategory = acc.find(item => item.name === session.category);
    if (existingCategory) {
      existingCategory.value += session.duration;
    } else {
      const categoryInfo = safeCategories.find(cat => cat && cat.name === session.category);
      // This check prevents the crash!
      const color = categoryInfo ? categoryInfo.color : '#A0AEC0'; // Default gray for 'Uncategorized'
      acc.push({ name: session.category, value: session.duration, color: color });
    }
    return acc;
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return <div className="text-white text-center p-10">Loading Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="bg-gray-800 text-white shadow-2xl p-8 w-full max-w-4xl mx-auto rounded-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white shadow-2xl p-8 w-full max-w-4xl mx-auto rounded-2xl">
      <h2 className="text-3xl font-bold mb-6">My Dashboard</h2>
      
      {/* The new controls container */}
      <div className="flex justify-between items-center mb-8 bg-gray-900 p-2 rounded-lg">
        {/* Your chart toggle buttons */}
        <div className="flex gap-2">
          <button className={`px-3 py-1 text-sm rounded-md ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`} onClick={() => setChartType('pie')}>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg></button>
          <button className={`px-3 py-1 text-sm rounded-md ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`} onClick={() => setChartType('bar')}>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg></button>
        </div>
        {/* Your time filter buttons */}
        {isProUser ? (
        <div className="flex gap-2">
            <button className={`px-3 py-1 text-sm rounded-md ${timeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`} onClick={() => setTimeFilter('all')}>All Time</button>
            <button className={`px-3 py-1 text-sm rounded-md ${timeFilter === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`} onClick={() => setTimeFilter('day')}>Day</button>
            <button className={`px-3 py-1 text-sm rounded-md ${timeFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`} onClick={() => setTimeFilter('week')}>Week</button>
            <button className={`px-3 py-1 text-sm rounded-md ${timeFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`} onClick={() => setTimeFilter('month')}>Month</button>
        </div>
        ) : (
        <div className="flex items-center gap-4">
            <p className="text-sm text-gray-400">Filter by day, week or month with Pro!</p>
            <button className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md">
            Upgrade Now
            </button>
        </div>
        )}
      </div>
      
      {sessions.length > 0 && chartData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side: The Chart */}
          <div className="w-full h-96">
            <ResponsiveContainer>
              {/* Conditional rendering for the chart type! */}
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                    {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value) => formatDuration(value)} />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis type="number" tickFormatter={formatDuration} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => formatDuration(value)} />
                  <Bar dataKey="value" fill="#8884d8">
                    {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Right Side: The Session Log */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
            <ul className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
              {filteredSessions.map(session => (
                <li key={session.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between transition-colors m-2">
                  <div>
                    <h4 className="text-lg font-semibold">{session.category || 'Uncategorized'}</h4>
                    <p className="text-sm text-gray-400">{new Date(session.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="text-lg font-semibold text-green-400">{formatDuration(session.duration)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mt-4 text-center">You haven't completed any sessions yet. Go focus!</p>
      )}
    </div>
  );
};

export default DashboardView;