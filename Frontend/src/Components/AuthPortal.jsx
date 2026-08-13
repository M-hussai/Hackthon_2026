import React, { useState } from 'react';

export default function AuthPortal() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'dashboard'
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '', password: '', skills: '' });
  const [message, setMessage] = useState('');
  const [tabsData, setTabsData] = useState({});
  const [selectedTab, setSelectedTab] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('Authenticating...');
    const res = await fetch('http://localhost:5000/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setMessage('');
      fetchDashboard();
      setMode('dashboard');
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('Registering...');
    const res = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) {
      setMessage('🟢 Registered successfully! Please Sign In.');
      setMode('signin');
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  // Fetch Dashboard Tabs Data
  const fetchDashboard = async () => {
    const res = await fetch('http://localhost:5000/api/sheet-tabs');
    const data = await res.json();
    if (data.success) {
      setTabsData(data.tabs);
      const keys = Object.keys(data.tabs);
      if (keys.length > 0) setSelectedTab(keys[0]);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      {/* Navigation Header */}
      {mode !== 'dashboard' && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => { setMode('signin'); setMessage(''); }}>Sign In</button>
          <button onClick={() => { setMode('signup'); setMessage(''); }}>Sign Up</button>
        </div>
      )}

      {message && <p style={{ padding: '10px', background: '#eee' }}>{message}</p>}

      {/* SIGN IN FORM */}
      {mode === 'signin' && (
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2>Sign In</h2>
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit" style={{ padding: '10px', background: '#0d6efd', color: '#fff', border: 'none' }}>Sign In</button>
        </form>
      )}

      {/* SIGN UP FORM */}
      {mode === 'signup' && (
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2>Sign Up</h2>
          <input name="studentId" placeholder="Student ID" onChange={handleChange} required />
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="skills" placeholder="Skills" onChange={handleChange} required />
          <button type="submit" style={{ padding: '10px', background: '#198754', color: '#fff', border: 'none' }}>Sign Up & Sync</button>
        </form>
      )}

      {/* DASHBOARD AFTER SIGN IN */}
      {mode === 'dashboard' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Welcome, {user?.email}!</h2>
            <button onClick={() => setMode('signin')}>Logout</button>
          </div>

          <h3>Google Sheet Dashboard (4 Tabs)</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            {Object.keys(tabsData).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  padding: '8px 14px',
                  background: selectedTab === tab ? '#0d6efd' : '#f0f0f0',
                  color: selectedTab === tab ? '#fff' : '#000',
                  border: 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {tabsData[selectedTab] && tabsData[selectedTab].length > 0 ? (
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {Object.keys(tabsData[selectedTab][0]).map((h) => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tabsData[selectedTab].map((row, idx) => (
                  <tr key={idx}>
                    {Object.keys(row).map((h) => <td key={h}>{row[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No records in this tab.</p>
          )}
        </div>
      )}
    </div>
  );
}