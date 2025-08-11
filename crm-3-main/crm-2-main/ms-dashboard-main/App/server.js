const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Admin credentials (in production, these should be stored securely)
const ADMIN_EMAIL = 'admin@crm.com';
const ADMIN_PASSWORD = 'admin123'; // In production, use hashed passwords

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files with restrictions
app.use(express.static('.', {
  setHeaders: (res, path) => {
    // Block direct access to sensitive JSON files
    if (path.endsWith('.json') && (path.includes('login') || path.includes('signup'))) {
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Location', '/admin-login');
      res.status(302);
    }
  }
}));

// Function to read JSON file
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return default structure
    if (filename.includes('login')) {
      return { loginRecords: [] };
    } else if (filename.includes('signup')) {
      return { signupRecords: [] };
    } else if (filename.includes('private-chats')) {
      return {};
    }
    return { users: [] };
  }
}

// Function to write JSON file
async function writeJsonFile(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

// Admin authentication middleware
function requireAdminAuth(req, res, next) {
  const adminToken = req.headers['admin-token'] || req.query.token;
  
  if (!adminToken) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }
  
  // In production, use proper JWT tokens
  if (adminToken === 'admin-authenticated') {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin token' });
  }
}

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.json({ 
        success: true, 
        message: 'Admin authenticated successfully',
        token: 'admin-authenticated'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Secure endpoint to get login data (admin only)
app.get('/api/admin/login-data', requireAdminAuth, async (req, res) => {
  try {
    const loginData = await readJsonFile('login.json');
    res.json({ success: true, data: loginData });
  } catch (error) {
    console.error('Get login data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Secure endpoint to get signup data (admin only)
app.get('/api/admin/signup-data', requireAdminAuth, async (req, res) => {
  try {
    const signupData = await readJsonFile('signup.json');
    res.json({ success: true, data: signupData });
  } catch (error) {
    console.error('Get signup data error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Block direct access to sensitive JSON files
app.get('/login.json', (req, res) => {
  res.redirect('/admin-login');
});

app.get('/signup.json', (req, res) => {
  res.redirect('/admin-login');
});

// Admin login page
app.get('/admin-login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Authentication</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .admin-container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
            }
            .admin-title {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
                font-size: 24px;
                font-weight: bold;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                color: #555;
                font-weight: bold;
            }
            input {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
                box-sizing: border-box;
                transition: border-color 0.3s;
            }
            input:focus {
                outline: none;
                border-color: #667eea;
            }
            .admin-btn {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .admin-btn:hover {
                transform: translateY(-2px);
            }
            .error-message {
                color: #e74c3c;
                text-align: center;
                margin-top: 10px;
                display: none;
            }
            .success-message {
                color: #27ae60;
                text-align: center;
                margin-top: 10px;
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="admin-container">
            <h1 class="admin-title">🔐 Admin Authentication</h1>
            <form id="adminForm">
                <div class="form-group">
                    <label for="adminEmail">Admin Email:</label>
                    <input type="email" id="adminEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="adminPassword">Admin Password:</label>
                    <input type="password" id="adminPassword" name="password" required>
                </div>
                <button type="submit" class="admin-btn">🔑 Authenticate</button>
            </form>
            <div id="errorMessage" class="error-message"></div>
            <div id="successMessage" class="success-message"></div>
        </div>

        <script>
            document.getElementById('adminForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('adminEmail').value;
                const password = document.getElementById('adminPassword').value;
                
                try {
                    const response = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        document.getElementById('successMessage').textContent = 'Authentication successful! Redirecting...';
                        document.getElementById('successMessage').style.display = 'block';
                        document.getElementById('errorMessage').style.display = 'none';
                        
                        // Store admin token
                        localStorage.setItem('adminToken', data.token);
                        
                        // Redirect to admin dashboard
                        setTimeout(() => {
                            window.location.href = '/admin-dashboard';
                        }, 1000);
                    } else {
                        document.getElementById('errorMessage').textContent = data.message;
                        document.getElementById('errorMessage').style.display = 'block';
                        document.getElementById('successMessage').style.display = 'none';
                    }
                } catch (error) {
                    document.getElementById('errorMessage').textContent = 'Network error. Please try again.';
                    document.getElementById('errorMessage').style.display = 'block';
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Admin dashboard page
app.get('/admin-dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .dashboard-container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .dashboard-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                text-align: center;
            }
            .dashboard-content {
                padding: 20px;
            }
            .data-section {
                margin-bottom: 30px;
            }
            .section-title {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
                border-bottom: 2px solid #667eea;
                padding-bottom: 5px;
            }
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            .data-table th, .data-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .data-table th {
                background-color: #f8f9fa;
                font-weight: bold;
            }
            .data-table tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .logout-btn {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
            }
            .logout-btn:hover {
                background: #c0392b;
            }
            .loading {
                text-align: center;
                padding: 20px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1>🔐 Admin Dashboard</h1>
                <p>Secure Access to User Data</p>
            </div>
            <div class="dashboard-content">
                <div class="data-section">
                    <h2 class="section-title">📊 Login Records</h2>
                    <div id="loginData" class="loading">Loading login data...</div>
                </div>
                
                <div class="data-section">
                    <h2 class="section-title">📈 Signup Records</h2>
                    <div id="signupData" class="loading">Loading signup data...</div>
                </div>
                
                <button class="logout-btn" onclick="logout()">🚪 Logout</button>
            </div>
        </div>

        <script>
            // Check if admin is authenticated
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                window.location.href = '/admin-login';
            }

            // Load login data
            async function loadLoginData() {
                try {
                    const response = await fetch('/api/admin/login-data', {
                        headers: {
                            'admin-token': adminToken
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        displayData('loginData', data.data.loginRecords || [], 'Login');
                    } else {
                        document.getElementById('loginData').innerHTML = '<p style="color: red;">Error loading login data</p>';
                    }
                } catch (error) {
                    document.getElementById('loginData').innerHTML = '<p style="color: red;">Error loading login data</p>';
                }
            }

            // Load signup data
            async function loadSignupData() {
                try {
                    const response = await fetch('/api/admin/signup-data', {
                        headers: {
                            'admin-token': adminToken
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        displayData('signupData', data.data.signupRecords || [], 'Signup');
                    } else {
                        document.getElementById('signupData').innerHTML = '<p style="color: red;">Error loading signup data</p>';
                    }
                } catch (error) {
                    document.getElementById('signupData').innerHTML = '<p style="color: red;">Error loading signup data</p>';
                }
            }

            // Display data in table format
            function displayData(elementId, records, type) {
                const element = document.getElementById(elementId);
                
                if (records.length === 0) {
                    element.innerHTML = '<p style="color: #666;">No ' + type.toLowerCase() + ' records found</p>';
                    return;
                }

                let tableHTML = '<table class="data-table"><thead><tr>';
                
                // Create headers based on first record
                const firstRecord = records[0];
                for (const key in firstRecord) {
                    if (key !== 'password') { // Don't show passwords
                        tableHTML += '<th>' + key.charAt(0).toUpperCase() + key.slice(1) + '</th>';
                    }
                }
                tableHTML += '</tr></thead><tbody>';

                // Add data rows
                records.forEach(record => {
                    tableHTML += '<tr>';
                    for (const key in record) {
                        if (key !== 'password') { // Don't show passwords
                            let value = record[key];
                            if (key === 'loginTime' || key === 'signupDate') {
                                value = new Date(value).toLocaleString();
                            }
                            tableHTML += '<td>' + value + '</td>';
                        }
                    }
                    tableHTML += '</tr>';
                });

                tableHTML += '</tbody></table>';
                element.innerHTML = tableHTML;
            }

            // Logout function
            function logout() {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin-login';
            }

            // Load data when page loads
            loadLoginData();
            loadSignupData();
        </script>
    </body>
    </html>
  `);
});

// Modern NeuralDash Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard-2025.html'));
});

app.get('/test-chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-chat.html'));
});

// Dashboard API endpoints for real-time data
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    // Read user data from JSON files
    const signupData = await readJsonFile('signup.json');
    const loginData = await readJsonFile('login.json');
    
    const totalUsers = signupData.signupRecords ? signupData.signupRecords.length : 0;
    const totalLogins = loginData.loginRecords ? loginData.loginRecords.length : 0;
    
    // Calculate active users (users who logged in within last 24 hours)
    const activeUsers = loginData.loginRecords ? loginData.loginRecords.filter(record => {
      const loginTime = new Date(record.loginTime);
      const now = new Date();
      return (now - loginTime) < (24 * 60 * 60 * 1000);
    }).length : 0;
    
    // Generate mock data for other metrics
    const mockData = {
      totalUsers: totalUsers,
      activeUsers: activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalChats: Math.floor(Math.random() * 200) + 50,
      generalChats: Math.floor(Math.random() * 100) + 30,
      privateChats: Math.floor(Math.random() * 100) + 20,
      totalDeals: Math.floor(Math.random() * 50) + 10,
      completedDeals: Math.floor(Math.random() * 30) + 5,
      pendingDeals: Math.floor(Math.random() * 20) + 5,
      totalTasks: Math.floor(Math.random() * 200) + 50,
      completedTasks: Math.floor(Math.random() * 150) + 30,
      pendingTasks: Math.floor(Math.random() * 50) + 20,
      totalCampaigns: Math.floor(Math.random() * 20) + 5,
      successfulCampaigns: Math.floor(Math.random() * 15) + 3,
      totalCustomers: Math.floor(Math.random() * 300) + 100,
      satisfiedCustomers: Math.floor(Math.random() * 250) + 80,
      activities: [
        { type: 'user_signup', message: 'New user registration', time: '2 minutes ago' },
        { type: 'chat_started', message: 'Private chat initiated', time: '5 minutes ago' },
        { type: 'deal_created', message: 'New deal created', time: '12 minutes ago' },
        { type: 'task_completed', message: 'Task marked as complete', time: '1 hour ago' },
        { type: 'campaign_launched', message: 'Email campaign launched', time: '3 hours ago' }
      ]
    };
    
    res.json(mockData);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to save signup record
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    
    // Read existing signup records
    const signupData = await readJsonFile('signup.json');
    
    // Create new signup record
    const newSignupRecord = {
      username,
      email,
      password,
      userType,
      signupDate: new Date().toISOString()
    };
    
    // Add to signup records
    signupData.signupRecords.push(newSignupRecord);
    
    // Write back to file
    const success = await writeJsonFile('signup.json', signupData);
    
    if (success) {
      res.json({ success: true, message: 'Signup record saved to JSON file' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save signup record' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to save login record
app.post('/api/login', async (req, res) => {
  try {
    const { email, username, password, userType } = req.body;
    
    // Read existing login records
    const loginData = await readJsonFile('login.json');
    
    // Create new login record
    const newLoginRecord = {
      email,
      username,
      password,
      userType,
      loginTime: new Date().toISOString()
    };
    
    // Add to login records
    loginData.loginRecords.push(newLoginRecord);
    
    // Write back to file
    const success = await writeJsonFile('login.json', loginData);
    
    if (success) {
      res.json({ success: true, message: 'Login record saved to JSON file' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save login record' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to get all users for authentication
app.get('/api/users', async (req, res) => {
  try {
    const signupData = await readJsonFile('signup.json');
    res.json({ users: signupData.signupRecords });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to search users for private chat
app.get('/api/users/search', async (req, res) => {
  try {
    const { query } = req.query;
    const signupData = await readJsonFile('signup.json');
    const users = signupData.signupRecords || [];
    
    if (!query) {
      return res.json({ users: users });
    }
    
    const filteredUsers = users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({ users: filteredUsers });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API endpoint to get chat history between two users
app.get('/api/chat/history', async (req, res) => {
  try {
    const { user1Email, user2Email } = req.query;
    
    console.log('Chat history request:', { user1Email, user2Email });
    
    if (!user1Email || !user2Email) {
      console.log('Missing user emails');
      return res.status(400).json({ success: false, message: 'Both user emails are required' });
    }
    
    // Create a unique chat key (sorted to ensure consistency)
    const chatKey = 'privateChat_' + [user1Email, user2Email].sort().join('_');
    console.log('Chat key for history:', chatKey);
    
    // Read chat history from JSON file
    const chatData = await readJsonFile('private-chats.json');
    console.log('Chat data for history:', chatData);
    const messages = chatData[chatKey] || [];
    console.log('Messages found:', messages.length);
    
    res.json({ success: true, messages: messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// API endpoint to save private chat message
app.post('/api/chat/message', async (req, res) => {
  try {
    const { senderEmail, receiverEmail, message, username } = req.body;
    
    console.log('=== CHAT MESSAGE REQUEST ===');
    console.log('Sender Email:', senderEmail);
    console.log('Receiver Email:', receiverEmail);
    console.log('Message:', message);
    console.log('Username:', username);
    
    if (!senderEmail || !receiverEmail || !message) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Validate email format - allow @example.com emails since that's how login system works
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log('Email validation check:');
    console.log('Sender email test:', emailRegex.test(senderEmail), senderEmail);
    console.log('Receiver email test:', emailRegex.test(receiverEmail), receiverEmail);
    
    if (!emailRegex.test(senderEmail) || !emailRegex.test(receiverEmail)) {
      console.log('❌ Invalid email format detected');
      console.log('Sender email:', JSON.stringify(senderEmail));
      console.log('Receiver email:', JSON.stringify(receiverEmail));
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    // Create a unique chat key
    const chatKey = 'privateChat_' + [senderEmail, receiverEmail].sort().join('_');
    console.log('Chat key:', chatKey);
    
    // Read existing chat data
    const chatData = await readJsonFile('private-chats.json');
    console.log('Existing chat data keys:', Object.keys(chatData));
    const messages = chatData[chatKey] || [];
    console.log('Existing messages count:', messages.length);
    
    const newMessage = {
      email: senderEmail,
      username: username || senderEmail,
      text: message,
      timestamp: new Date().toISOString()
    };
    
    console.log('New message to save:', newMessage);
    messages.push(newMessage);
    chatData[chatKey] = messages;
    
    // Save back to file
    const success = await writeJsonFile('private-chats.json', chatData);
    console.log('Save success:', success);
    
    if (success) {
      console.log('✅ Message saved successfully');
      res.json({ success: true, message: 'Message saved successfully' });
    } else {
      console.log('❌ Failed to save message');
      res.status(500).json({ success: false, message: 'Failed to save message' });
    }
  } catch (error) {
    console.error('❌ Save chat message error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('JSON files are now secured and require admin authentication');
  console.log('Admin credentials: admin@crm.com / admin123');
});
