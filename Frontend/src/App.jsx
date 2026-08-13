import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('signup'); // 'signup' or 'dashboard'
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    skills: ''
  });
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Backend API Base URL
  const API_BASE = 'http://localhost:5000/api';

  // Fetch students from MongoDB when dashboard tab is opened
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students`);
      const result = await response.json();
      if (result.success) {
        setStudents(result.data || []);
      } else {
        setStatus({ type: 'error', message: 'Failed to fetch student list.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Cannot connect to backend server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Saving to MongoDB & Syncing Sheet...' });

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: '✅ Saved to MongoDB & Synced with Google Sheet!' });
        setFormData({ studentId: '', name: '', email: '', skills: '' });
      } else {
        setStatus({ type: 'error', message: '❌ Error: ' + data.message });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: '❌ Could not connect to Express backend (Port 5000).' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Tab Navigation */}
        <div style={styles.navTabs}>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'signup' ? styles.activeTab : {}) }}
            onClick={() => { setActiveTab('signup'); setStatus({ type: '', message: '' }); }}
          >
            Student Sign Up
          </button>
          <button
            style={{ ...styles.tabBtn, ...(activeTab === 'dashboard' ? styles.activeTab : {}) }}
            onClick={() => { setActiveTab('dashboard'); setStatus({ type: '', message: '' }); }}
          >
            Placement Dashboard
          </button>
        </div>

        {/* --- TAB 1: SIGN UP FORM --- */}
        {activeTab === 'signup' && (
          <div>
            <h2 style={styles.heading}>Student Registration</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="studentId"
                placeholder="Student ID (e.g. STU1001)"
                value={formData.studentId}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <input
                type="text"
                name="skills"
                placeholder="Skills (e.g. React, Node, MongoDB)"
                value={formData.skills}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.submitBtn}>
                Sign Up & Sync
              </button>
            </form>
          </div>
        )}

        {/* --- TAB 2: DASHBOARD TABLE --- */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={styles.dashboardHeader}>
              <h2 style={{ ...styles.heading, margin: 0 }}>Registered Students</h2>
              <button onClick={fetchStudents} style={styles.refreshBtn}>
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading data...</p>
            ) : students.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>No records found in database.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((stu, index) => (
                      <tr key={stu._id || index} style={styles.tdRow}>
                        <td style={styles.td}>{stu.studentId}</td>
                        <td style={styles.td}>{stu.name}</td>
                        <td style={styles.td}>{stu.email}</td>
                        <td style={styles.td}>{stu.skills}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Alert Status Banners */}
        {status.message && (
          <div style={{
            ...styles.alert,
            backgroundColor: status.type === 'success' ? '#d4edda' : status.type === 'error' ? '#f8d7da' : '#e2e3e5',
            color: status.type === 'success' ? '#155724' : status.type === 'error' ? '#721c24' : '#383d41'
          }}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

// Clean inline modern styling
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '650px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '28px',
    boxSizing: 'border-box'
  },
  navTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
    borderBottom: '2px solid #e9ecef',
    paddingBottom: '8px'
  },
  tabBtn: {
    flex: 1,
    padding: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    fontWeight: '600',
    color: '#6c757d',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s'
  },
  activeTab: {
    backgroundColor: '#0d6efd',
    color: '#ffffff'
  },
  heading: {
    fontSize: '20px',
    color: '#212529',
    marginBottom: '16px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    outline: 'none'
  },
  submitBtn: {
    padding: '12px',
    backgroundColor: '#198754',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '6px'
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  refreshBtn: {
    padding: '6px 12px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  thRow: {
    backgroundColor: '#f1f3f5'
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    fontSize: '13px',
    color: '#495057',
    borderBottom: '2px solid #dee2e6'
  },
  tdRow: {
    borderBottom: '1px solid #e9ecef'
  },
  td: {
    padding: '10px',
    fontSize: '13px',
    color: '#212529'
  },
  alert: {
    marginTop: '20px',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    textAlign: 'center',
    fontWeight: '500'
  }
};

export default App;