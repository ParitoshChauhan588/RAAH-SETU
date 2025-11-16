/**
 * RAAH-SETU: Node.js Express Backend
 * Alternative to Flask - runs without Python
 * Port: 5000
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const mockDB = {
  users: {
    'test@example.com': {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      phone: '+1234567890'
    }
  },
  emergencyContacts: {
    1: [
      { id: 1, userId: 1, name: 'Mom', relationship: 'Mother', phone: '+1111111111', email: 'mom@example.com' },
      { id: 2, userId: 1, name: 'Dad', relationship: 'Father', phone: '+2222222222', email: 'dad@example.com' }
    ]
  },
  healthChecks: {
    1: [
      { id: 1, userId: 1, bloodPressure: '120/80', heartRate: 72, timestamp: new Date() },
      { id: 2, userId: 1, bloodPressure: '118/76', heartRate: 68, timestamp: new Date() }
    ]
  },
  incidents: {
    1: [
      { id: 1, userId: 1, title: 'Accident Report', description: 'Minor accident', severity: 'low', timestamp: new Date() }
    ]
  },
  sosAlerts: {
    1: []
  }
};

// ============ AUTHENTICATION ENDPOINTS ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RAAH-SETU Backend Running (Node.js)',
    timestamp: new Date()
  });
});

// Sign up
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  if (mockDB.users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Object.keys(mockDB.users).length + 1,
    name,
    email,
    phone,
    password: `hashed_${password}`
  };

  mockDB.users[email] = newUser;
  mockDB.emergencyContacts[newUser.id] = [];
  mockDB.healthChecks[newUser.id] = [];
  mockDB.incidents[newUser.id] = [];

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: newUser.id, name, email, phone }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = mockDB.users[email];
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    success: true,
    message: 'Login successful',
    token: `token_${user.id}_${Date.now()}`,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const user = Object.values(mockDB.users)[0];
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ============ EMERGENCY CONTACTS ENDPOINTS ============

// Get all emergency contacts for user
app.get('/api/emergency-contacts', (req, res) => {
  const userId = 1; // Mock user
  const contacts = mockDB.emergencyContacts[userId] || [];
  res.json({ contacts, total: contacts.length });
});

// Create emergency contact
app.post('/api/emergency-contacts', (req, res) => {
  const { name, relationship, phone, email } = req.body;
  const userId = 1;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }

  const contact = {
    id: Date.now(),
    userId,
    name,
    relationship,
    phone,
    email,
    createdAt: new Date()
  };

  if (!mockDB.emergencyContacts[userId]) {
    mockDB.emergencyContacts[userId] = [];
  }
  mockDB.emergencyContacts[userId].push(contact);

  res.status(201).json({ success: true, contact });
});

// Update emergency contact
app.put('/api/emergency-contacts/:id', (req, res) => {
  const { id } = req.params;
  const userId = 1;
  const contacts = mockDB.emergencyContacts[userId] || [];
  const index = contacts.findIndex(c => c.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  contacts[index] = { ...contacts[index], ...req.body, id: parseInt(id) };
  res.json({ success: true, contact: contacts[index] });
});

// Delete emergency contact
app.delete('/api/emergency-contacts/:id', (req, res) => {
  const { id } = req.params;
  const userId = 1;
  const contacts = mockDB.emergencyContacts[userId] || [];
  const index = contacts.findIndex(c => c.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  contacts.splice(index, 1);
  res.json({ success: true, message: 'Contact deleted' });
});

// ============ HEALTH CHECKS ENDPOINTS ============

// Get health checks
app.get('/api/health-checks', (req, res) => {
  const userId = 1;
  const checks = mockDB.healthChecks[userId] || [];
  res.json({ checks, total: checks.length });
});

// Create health check
app.post('/api/health-checks', (req, res) => {
  const { bloodPressure, heartRate, temperature, notes } = req.body;
  const userId = 1;

  const check = {
    id: Date.now(),
    userId,
    bloodPressure,
    heartRate,
    temperature,
    notes,
    timestamp: new Date()
  };

  if (!mockDB.healthChecks[userId]) {
    mockDB.healthChecks[userId] = [];
  }
  mockDB.healthChecks[userId].push(check);

  res.status(201).json({ success: true, check });
});

// ============ INCIDENT ENDPOINTS ============

// Get incidents
app.get('/api/incidents', (req, res) => {
  const userId = 1;
  const incidents = mockDB.incidents[userId] || [];
  res.json({ incidents, total: incidents.length });
});

// Create incident
app.post('/api/incidents', (req, res) => {
  const { title, description, severity, location } = req.body;
  const userId = 1;

  if (!title) {
    return res.status(400).json({ error: 'Title required' });
  }

  const incident = {
    id: Date.now(),
    userId,
    title,
    description,
    severity: severity || 'medium',
    location,
    timestamp: new Date(),
    status: 'open'
  };

  if (!mockDB.incidents[userId]) {
    mockDB.incidents[userId] = [];
  }
  mockDB.incidents[userId].push(incident);

  res.status(201).json({ success: true, incident });
});

// ============ ACTIVITIES ENDPOINTS ============

// Get activities
app.get('/api/activities', (req, res) => {
  const userId = 1;
  const activities = [
    { id: 1, userId, action: 'Logged in', timestamp: new Date() },
    { id: 2, userId, action: 'Updated profile', timestamp: new Date() },
    { id: 3, userId, action: 'Added emergency contact', timestamp: new Date() }
  ];
  res.json({ activities, total: activities.length });
});

// Log activity
app.post('/api/activities/log', (req, res) => {
  const { action } = req.body;
  const activity = {
    id: Date.now(),
    userId: 1,
    action,
    timestamp: new Date()
  };
  res.status(201).json({ success: true, activity });
});

// ============ SOS ENDPOINTS ============

// Activate SOS
app.post('/api/sos/activate', (req, res) => {
  const { location } = req.body;
  const sosAlert = {
    id: Date.now(),
    userId: 1,
    activated: true,
    location,
    timestamp: new Date()
  };
  res.status(201).json({ success: true, message: 'SOS activated', alert: sosAlert });
});

// ============ ERROR HANDLING ============

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  RAAH-SETU Backend (Node.js Express) ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('📚 Available Endpoints:');
  console.log('  GET  /api/health                   - Health check');
  console.log('  POST /api/auth/signup              - Register user');
  console.log('  POST /api/auth/login               - Login user');
  console.log('  GET  /api/emergency-contacts       - Get contacts');
  console.log('  POST /api/emergency-contacts       - Add contact');
  console.log('  PUT  /api/emergency-contacts/:id   - Update contact');
  console.log('  DELETE /api/emergency-contacts/:id - Delete contact');
  console.log('  GET  /api/health-checks            - Get health checks');
  console.log('  POST /api/health-checks            - Log health check');
  console.log('  GET  /api/incidents                - Get incidents');
  console.log('  POST /api/incidents                - Report incident');
  console.log('  POST /api/sos/activate             - Activate SOS');
  console.log('');
  console.log('💡 Press Ctrl+C to stop server');
  console.log('');
});
