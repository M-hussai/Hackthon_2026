import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// Sign In Route
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await axios.get(`${SCRIPT_URL}?action=signin&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during sign in.' });
  }
});

// Sign Up Route
app.post('/api/signup', async (req, res) => {
  try {
    const response = await axios.post(SCRIPT_URL, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during sign up.' });
  }
});

// Get Dashboard Data Route
app.get('/api/sheet-tabs', async (req, res) => {
  try {
    const response = await axios.get(`${SCRIPT_URL}?action=getAllTabs`);
    res.json({ success: true, tabs: response.data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch sheet tabs.' });
  }
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));