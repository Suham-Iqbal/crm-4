# CRM Application with JSON File Storage

This application stores user signup and login data directly in JSON files (`login.json` and `signup.json`) that you can see in VS Code.

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 3: Access the Application
Open your browser and go to `http://localhost:3000/login.html`

## 📁 How It Works

### JSON File Storage
- **`signup.json`**: Stores all user signup records
- **`login.json`**: Stores all user login records

### Data Structure

**signup.json:**
```json
{
  "signupRecords": [
    {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "password": "password123",
      "userType": "regular",
      "signupDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**login.json:**
```json
{
  "loginRecords": [
    {
      "id": 1,
      "email": "test@example.com",
      "username": "testuser",
      "password": "password123",
      "userType": "regular",
      "loginTime": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

## 🔧 Features

### User Management
- **Sign Up**: Creates new user accounts and stores in `signup.json`
- **Login**: Authenticates users and logs login attempts in `login.json`
- **User Types**: Regular User and Admin options

### Real-time JSON Updates
- When you sign up → data is saved to `signup.json`
- When you login → data is saved to `login.json`
- You can see the files update in real-time in VS Code

### Admin Panel
- View login history
- Export user data
- System logs

## 🛠️ Development

### Server Endpoints
- `POST /api/signup` - Save signup record to JSON
- `POST /api/login` - Save login record to JSON  
- `GET /api/users` - Get all users for authentication

### File Structure
```
App/
├── server.js          # Node.js server
├── package.json       # Dependencies
├── login.html         # Login/signup page
├── login.js           # Frontend logic
├── login.json         # Login records (auto-updated)
├── signup.json        # Signup records (auto-updated)
└── ... (other files)
```

## 📝 Usage

1. **Start the server**: `npm start`
2. **Open the app**: Go to `http://localhost:3000/login.html`
3. **Sign up**: Create a new account
4. **Check JSON files**: See data appear in `signup.json`
5. **Login**: Use your credentials
6. **Check JSON files**: See login data in `login.json`

## ⚠️ Important Notes

- The server must be running for JSON file updates to work
- Data is stored directly in the JSON files you see in VS Code
- No localStorage or export needed - everything is automatic
- Files are updated in real-time as you sign up and login

## 🎯 What You'll See

After signing up and logging in, your JSON files will contain actual data:

**signup.json will show:**
```json
{
  "signupRecords": [
    {
      "id": 1,
      "username": "yourusername",
      "email": "your@email.com",
      "password": "yourpassword",
      "userType": "regular",
      "signupDate": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**login.json will show:**
```json
{
  "loginRecords": [
    {
      "id": 1,
      "email": "your@email.com",
      "username": "yourusername", 
      "password": "yourpassword",
      "userType": "regular",
      "loginTime": "2024-01-15T10:35:00.000Z"
    }
  ]
}
```

The data will be stored exactly as you see it in the VS Code files! 🎉
