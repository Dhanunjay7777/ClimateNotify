# ClimateNotify 🌍

> **Real-time climate monitoring and AI-powered predictions to help you stay ahead of environmental changes**

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Installation & Setup](#installation--setup)
6. [Environment Configuration](#environment-configuration)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Database Schema](#database-schema)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [License](#license)

---

## 🌟 Project Overview

**ClimateNotify** is a comprehensive climate monitoring and notification system that provides real-time environmental data, weather forecasts, air quality monitoring, and intelligent climate alerts. Built with modern web technologies, it serves as a platform for environmental awareness and early warning systems.

### 🎯 Key Objectives

- **Real-time Monitoring**: Track climate data from 190+ countries with instant updates
- **AI-Powered Predictions**: Early warnings about climate events using machine learning
- **Global Community**: Connect researchers, advocates, and concerned citizens worldwide
- **Actionable Insights**: Transform complex climate data into understandable alerts and reports

### 🔥 Live Features

- Interactive climate dashboard with real-time data
- Push notification system for climate alerts
- User management with role-based access
- Comprehensive analytics and reporting
- Mobile-responsive design with dark mode support

---

## ✨ Features

### 🌡️ Climate Monitoring
- **Real-time Weather Data**: Current temperature, humidity, wind conditions
- **Air Quality Index**: PM2.5, PM10, CO₂, O₃, NO₂, SO₂ monitoring
- **UV Index Tracking**: Solar radiation and UV exposure levels
- **Global Climate Insights**: Arctic ice, wildfire activity, renewable energy stats

### 📊 Analytics Dashboard
- **Interactive Charts**: Temperature trends, air quality visualization
- **Weather Forecasts**: 7-day weather predictions with detailed metrics
- **Climate Alerts**: Real-time notifications for extreme weather events
- **Global Statistics**: Ocean temperature, CO₂ levels, forest coverage

### 🔔 Notification System
- **Push Notifications**: Firebase Cloud Messaging integration
- **Smart Alerts**: AI-powered climate event predictions
- **Custom Targeting**: Send alerts to specific users or broadcast to all
- **Multi-channel Delivery**: Web, mobile, and email notifications

### 👥 User Management
- **Role-based Access**: Admin, user, and guest permissions
- **Account Approval**: Admin-controlled user activation
- **Profile Management**: User settings and preferences
- **Authentication**: Secure login with bcrypt password hashing

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Mode**: Eye-friendly interface with theme switching
- **Animated UI**: Smooth transitions and engaging interactions
- **Accessibility**: WCAG-compliant design patterns

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|----------|
| **React** | 19.1.1 | UI library for building interactive interfaces |
| **Vite** | 7.1.7 | Fast build tool and development server |
| **React Router** | 7.9.1 | Client-side routing and navigation |
| **Tailwind CSS** | 4.1.13 | Utility-first CSS framework |
| **React Compiler** | 19.1.0-rc.3 | React optimization and performance |

### Backend
| Technology | Version | Purpose |
|------------|---------|----------|
| **Express.js** | 4.21.2 | Web server framework |
| **Node.js** | >=16.0.0 | Runtime environment |
| **Appwrite** | 13.0.0 | Backend-as-a-Service for database |
| **Firebase Admin** | 13.5.0 | Push notifications and authentication |
| **bcrypt** | 6.0.0 | Password hashing and security |

### Database & Services
| Service | Purpose |
|---------|---------|
| **Appwrite** | User management, document storage |
| **Firebase** | Push notifications (FCM) |
| **Open-Meteo API** | Weather and air quality data |
| **NASA APIs** | Climate statistics and CO₂ data |

### Development & Deployment
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and quality |
| **PostCSS** | CSS processing and optimization |
| **Vercel** | Frontend deployment platform |
| **Express** | Backend API server |

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    A[Client Browser] --> B[React Frontend]
    B --> C[Express API Server]
    C --> D[Appwrite Database]
    C --> E[Firebase FCM]
    B --> F[External APIs]
    F --> G[Open-Meteo Weather]
    F --> H[NASA Climate Data]
    C --> I[Authentication Layer]
    I --> J[Role-based Access Control]
```

### Frontend Architecture

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components (Button, Input)
│   ├── dashboard/       # Dashboard-specific components
│   └── layout/          # Layout components (Header, Sidebar)
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Route-level page components
├── services/            # API service layers
└── styles/              # CSS and animation files
```

### Backend Architecture

```
server/
├── server.js            # Express server setup
├── routes/              # API route handlers (implicitly organized)
│   ├── auth.js         # Authentication endpoints
│   ├── users.js        # User management
│   ├── messages.js     # Message/notification system
│   └── tokens.js       # FCM token management
├── middleware/         # Custom middleware functions
├── utils/              # Helper functions
└── config/             # Configuration files
```

### Data Flow

1. **Authentication Flow**:
   - User registration with email verification
   - Admin approval required for account activation
   - JWT-like token handling for session management

2. **Climate Data Flow**:
   - External API integration (Open-Meteo, NASA)
   - Real-time data caching with localStorage
   - Automatic refresh intervals for live updates

3. **Notification Flow**:
   - FCM token registration for each user device
   - Server-side notification dispatch
   - Multi-target notification support (broadcast/specific users)

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** or **yarn**
- **Git**
- **Appwrite** account and project
- **Firebase** project with FCM enabled

### 1. Clone Repository

```bash
git clone https://github.com/Dhanunjay7777/ClimateNotify.git
cd ClimateNotify/Climatenotification
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
# Install frontend dependencies
npm install

# Install development dependencies
npm install --dev
```

#### Backend Dependencies
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install
```

### 3. Environment Configuration

Create environment files for both frontend and backend:

#### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# NASA API (optional)
VITE_NASA_API_KEY=your_nasa_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcd1234
VITE_FIREBASE_MEASUREMENT_ID=G-ABCD123456
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

#### Backend (server/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_appwrite_project_id
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_DATABASE_ID=your_database_id
CONSUMERS_COLLECTION_ID=consumers
MESSAGES_COLLECTION_ID=messages
TOKENS_COLLECTION_ID=tokens

# Firebase Admin Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project",...}

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Setup

#### Appwrite Collections

**Consumers Collection** (`consumers`):
```json
{
  "consumerID": "string",
  "fullname": "string",
  "email": "string",
  "password": "string",
  "agreeTerms": "string",
  "accessLevel": "string",
  "approvedStatus": "string",
  "CreatedAt": "string",
  "lastLogin": "string"
}
```

**Messages Collection** (`messages`):
```json
{
  "message": "string",
  "targetType": "string",
  "targetUsers": "string"
}
```

**Tokens Collection** (`tokens`):
```json
{
  "fcmToken": "string",
  "userId": "string",
  "isActive": "boolean"
}
```

### 5. Run Development Servers

#### Start Backend Server
```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

#### Start Frontend Development Server
```bash
# From project root
npm run dev
```

### 6. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## ⚙️ Environment Configuration

### Required Environment Variables

#### Frontend Environment

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_NASA_API_KEY` | NASA API key (optional) | `your_nasa_api_key` |
| `VITE_FIREBASE_*` | Firebase configuration | See Firebase console |

#### Backend Environment

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `APPWRITE_ENDPOINT` | Appwrite server URL | Yes |
| `APPWRITE_PROJECT_ID` | Appwrite project ID | Yes |
| `APPWRITE_API_KEY` | Appwrite API key | Yes |
| `APPWRITE_DATABASE_ID` | Database ID | Yes |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase service account JSON | Yes (for FCM) |

### API Keys Setup

#### 1. Appwrite Setup
1. Create account at [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create new project
3. Generate API key with database permissions
4. Create database and collections

#### 2. Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Cloud Messaging
3. Generate service account key
4. Configure web app with FCM

#### 3. NASA API (Optional)
1. Register at [NASA APIs](https://api.nasa.gov/)
2. Generate API key for climate data

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/signup`
Register new user account

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "agreeTerms": true
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Account created successfully! Please wait for admin approval.",
  "data": {
    "id": "user_id",
    "consumerID": "unique_consumer_id",
    "fullname": "John Doe",
    "email": "john@example.com",
    "accessLevel": "user",
    "approvedStatus": "false"
  }
}
```

#### POST `/api/login`
User authentication

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "id": "user_id",
    "consumerID": "unique_consumer_id",
    "fullname": "John Doe",
    "email": "john@example.com",
    "accessLevel": "user",
    "approvedStatus": "true",
    "lastLogin": "2025-09-26T10:00:00Z"
  }
}
```

### User Management Endpoints

#### GET `/api/consumers`
Get all users (Admin only)

**Headers:**
```
Authorization: Bearer admin_token
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "user_id",
      "consumerID": "unique_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "lastActive": "2025-09-26T10:00:00Z",
      "joinDate": "2025-09-25T08:00:00Z"
    }
  ],
  "total": 1
}
```

#### PUT `/api/consumers/:id`
Update user status/role (Admin only)

**Request Body:**
```json
{
  "approvedStatus": "true",
  "accessLevel": "admin"
}
```

### Message & Notification Endpoints

#### POST `/api/messages`
Create message and send notifications

**Request Body:**
```json
{
  "message": "Climate alert: High temperatures expected",
  "sendNotification": true,
  "sendToAll": true,
  "userIds": ["user1", "user2"]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Message stored and notification sent successfully",
  "data": {
    "id": "message_id",
    "message": "Climate alert: High temperatures expected",
    "createdAt": "2025-09-26T10:00:00Z",
    "targetType": "all_users",
    "notificationSent": true,
    "notification": {
      "sent": 150,
      "failed": 5,
      "errors": []
    }
  }
}
```

#### GET `/api/messages`
Get all messages

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "$id": "message_id",
      "message": "Climate alert message",
      "createdAt": "2025-09-26T10:00:00Z"
    }
  ],
  "total": 1
}
```

### FCM Token Management

#### POST `/api/tokens`
Save FCM token for notifications

**Request Body:**
```json
{
  "fcmToken": "firebase_token_string",
  "userId": "user_id"
}
```

#### POST `/api/notifications/broadcast`
Send broadcast notification

**Request Body:**
```json
{
  "title": "Climate Alert",
  "body": "High temperatures expected in your area",
  "data": {
    "type": "weather_alert",
    "severity": "high"
  }
}
```

### Utility Endpoints

#### GET `/health`
Server health check

**Response:**
```json
{
  "status": "success",
  "message": "Server is running and connected to Appwrite",
  "timestamp": "2025-09-26T10:00:00Z",
  "environment": "development"
}
```

---

## 🎨 Frontend Components

### Layout Components

#### Header (`src/components/layout/Header.jsx`)
- Navigation bar with branding
- User authentication status
- Mobile-responsive menu

#### Sidebar (`src/components/layout/Sidebar.jsx`)
- Dashboard navigation menu
- Role-based menu items
- Collapsible design

#### TopProfile (`src/components/layout/TopProfile.jsx`)
- User profile display
- Dark mode toggle
- Quick actions

### Dashboard Components

#### OverviewDashboard (`src/components/dashboard/OverviewDashboard.jsx`)
- **Real-time Climate Metrics**: Temperature, air quality, UV index, humidity
- **Interactive Charts**: Line charts for temperature trends, bar charts for air quality
- **Weather Forecast**: 5-day forecast with detailed conditions
- **Climate Alerts**: Live alerts with severity indicators
- **Quick Actions**: Send alerts, view analytics, generate reports

Key Features:
- Material Icons integration
- Dark mode support
- Loading skeletons
- Error handling with fallback states
- Real-time data refresh
- Responsive grid layout

#### ClimateAnalytics (`src/components/dashboard/ClimateAnalytics.jsx`)
- Advanced data visualization
- Historical climate trends
- Comparative analysis tools

#### AlertsManagement (`src/components/dashboard/AlertsManagement.jsx`)
- Alert creation and management
- Severity level configuration
- Target audience selection

#### MessagingDashboard (`src/components/dashboard/MessagingDashboard.jsx`)
- Push notification interface
- Message templates
- Delivery statistics

#### UserManagement (`src/components/dashboard/UserManagement.jsx`)
- User approval system
- Role assignment
- Account status management

### Authentication Components

#### AuthContext (`src/context/AuthContext.jsx`)
- User state management
- Login/logout functionality
- Registration handling
- Session persistence

#### ProtectedRoute (`src/components/auth/ProtectedRoute.jsx`)
- Route protection
- Authentication checks
- Loading states

### Common Components

#### Button (`src/components/common/Button.jsx`)
- Reusable button component
- Multiple variants and sizes
- Loading states

#### Input (`src/components/common/Input.jsx`)
- Form input component
- Validation support
- Error state handling

---

## 🗄️ Database Schema

### Appwrite Collections

#### consumers
Stores user account information

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `consumerID` | String | Unique user identifier | Yes |
| `fullname` | String | User's full name | Yes |
| `email` | String | User's email address | Yes |
| `password` | String | Bcrypt hashed password | Yes |
| `agreeTerms` | String | Terms agreement status | Yes |
| `accessLevel` | String | User role (user/admin) | Yes |
| `approvedStatus` | String | Account approval status | Yes |
| `CreatedAt` | String | Account creation timestamp | Yes |
| `lastLogin` | String | Last login timestamp | No |

#### messages
Stores system messages and notifications

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `message` | String | Message content (max 200 chars) | Yes |
| `targetType` | String | Target audience type | No |
| `targetUsers` | String | Specific user targets | No |

#### tokens
Stores FCM tokens for push notifications

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `fcmToken` | String | Firebase Cloud Messaging token | Yes |
| `userId` | String | Associated user ID | Yes |
| `isActive` | Boolean | Token active status | Yes |

### Data Relationships

```mermaid
erDiagram
    CONSUMERS ||--o{ TOKENS : has
    CONSUMERS {
        string consumerID PK
        string fullname
        string email UK
        string password
        string accessLevel
        string approvedStatus
    }
    
    TOKENS {
        string id PK
        string fcmToken UK
        string userId FK
        boolean isActive
    }
    
    MESSAGES {
        string id PK
        string message
        string targetType
        string targetUsers
    }
```

---

## 🌐 External API Integration

### Weather Data Sources

#### Open-Meteo APIs
- **Weather API**: Current conditions, forecasts
- **Air Quality API**: Pollutant measurements, AQI calculations
- **Geocoding API**: Location name resolution
- **Free Tier**: No API key required, rate-limited

**Endpoints Used:**
```javascript
// Current weather
https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,humidity...

// Air quality
https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5...

// Location search
https://geocoding-api.open-meteo.com/v1/search?name=${locationName}
```

#### NASA Climate APIs
- **GISS Temperature Data**: Global temperature anomalies
- **CO₂ Monitoring**: Atmospheric CO₂ measurements
- **Climate Statistics**: Long-term climate trends

### Data Caching Strategy

The application implements intelligent caching:

1. **localStorage Caching**: Client-side data persistence
2. **Refresh Intervals**: Automatic data updates
3. **Fallback Mechanisms**: Cached data when APIs fail
4. **Rate Limit Handling**: Graceful degradation

```javascript
// Example caching implementation
const saveToLocalStorage = (key, data) => {
  const dataWithTimestamp = {
    data: data,
    timestamp: new Date().getTime()
  };
  localStorage.setItem(`climate_${key}`, JSON.stringify(dataWithTimestamp));
};

const isDataFresh = (timestamp, maxAgeMinutes) => {
  const now = new Date().getTime();
  const ageMinutes = (now - timestamp) / (1000 * 60);
  return ageMinutes < maxAgeMinutes;
};
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

#### 1. Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://your-api-domain.com"
  }
}
```

#### 2. Build Configuration

**Vite Configuration** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
```

#### 3. Deploy Steps
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add VITE_API_BASE_URL
vercel env add VITE_FIREBASE_API_KEY
```

### Backend Deployment

#### Platform Options

1. **Railway**
2. **Render**
3. **Heroku**
4. **DigitalOcean App Platform**
5. **AWS Elastic Beanstalk**

#### Example: Railway Deployment

1. **Connect Repository**: Link GitHub repository
2. **Environment Variables**: Set all required env vars
3. **Build Configuration**: Automatic Node.js detection
4. **Deploy**: Automatic deployment on push

#### Docker Deployment (Optional)

**Dockerfile** (server directory):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'
services:
  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    env_file:
      - ./server/.env
```

### Production Environment Variables

#### Frontend Production
```env
VITE_API_BASE_URL=https://api.climatenotify.com
VITE_FIREBASE_API_KEY=production_firebase_key
VITE_FIREBASE_PROJECT_ID=production_project_id
```

#### Backend Production
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://climatenotify.com
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=production_project_id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

---

## 🔧 Development Guidelines

### Code Structure

#### Component Organization
```
components/
├── auth/               # Authentication-related components
├── common/             # Shared/reusable components
├── dashboard/          # Dashboard-specific components
└── layout/             # Layout components (Header, Sidebar)
```

#### Naming Conventions
- **Components**: PascalCase (`UserDashboard.jsx`)
- **Files**: kebab-case (`user-dashboard.css`)
- **Variables**: camelCase (`userData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

#### State Management
- **Context API**: Global state (auth, theme)
- **useState**: Component-level state
- **Custom Hooks**: Shared logic (`useClimateData`)

### Best Practices

#### React Components
```jsx
// Good: Functional component with proper imports
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="dashboard">
      {/* Component content */}
    </div>
  );
};

export default Dashboard;
```

#### API Service Layer
```javascript
// Good: Centralized API functions
export const getCurrentWeather = async (lat, lon) => {
  try {
    const response = await fetch(`${API_ENDPOINT}?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};
```

#### Error Handling
```javascript
// Good: Comprehensive error handling
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await apiCall();
    setData(data);
  } catch (error) {
    setError(error.message);
    // Fallback to cached data if available
    const cachedData = localStorage.getItem('fallbackData');
    if (cachedData) setData(JSON.parse(cachedData));
  } finally {
    setLoading(false);
  }
};
```

### Performance Optimization

#### 1. Code Splitting
```javascript
// Lazy load components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

#### 2. Memoization
```javascript
// Memoize expensive calculations
const processedData = useMemo(() => {
  return expensiveCalculation(rawData);
}, [rawData]);

// Memoize callbacks
const handleClick = useCallback(() => {
  onClick(id);
}, [onClick, id]);
```

#### 3. Image Optimization
```jsx
// Optimized image loading
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  decoding="async"
/>
```

### Testing Guidelines

#### Unit Testing
```javascript
// Example test structure
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  test('renders climate metrics', () => {
    render(<Dashboard />);
    expect(screen.getByText('Temperature')).toBeInTheDocument();
  });
});
```

#### Integration Testing
```javascript
// API testing
import { getCurrentWeather } from '../services/climateApi';

describe('Climate API', () => {
  test('fetches weather data', async () => {
    const data = await getCurrentWeather(40.7128, -74.0060);
    expect(data).toHaveProperty('temperature');
  });
});
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork Repository**: Create personal fork
2. **Create Branch**: Feature-specific branch
3. **Develop**: Implement changes with tests
4. **Test**: Run full test suite
5. **Submit PR**: Pull request with description

### Contribution Guidelines

#### Code Standards
- **ESLint**: Follow configured linting rules
- **Prettier**: Use consistent code formatting
- **TypeScript**: Consider migration for type safety
- **Comments**: Document complex logic

#### Git Workflow
```bash
# Create feature branch
git checkout -b feature/climate-alerts

# Make commits with clear messages
git commit -m "feat: add real-time climate alerts"

# Push to fork
git push origin feature/climate-alerts

# Create pull request
```

#### Commit Message Format
```
type(scope): description

feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code refactoring
test: adding tests
chore: maintenance
```

### Issue Templates

#### Bug Report
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]
```

#### Feature Request
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why this feature is needed

**Proposed Solution**
How it could be implemented

**Alternatives**
Other approaches considered
```

---

## 📄 License

### MIT License

```
MIT License

Copyright (c) 2025 ClimateNotify Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🆘 Support & Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

### API References
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [NASA APIs](https://api.nasa.gov/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A and ideas
- **Wiki**: Extended documentation and guides

### Getting Help

1. **Check Documentation**: Review this README and inline docs
2. **Search Issues**: Look for existing solutions
3. **Create Issue**: Detailed bug report or feature request
4. **Community Discussion**: Ask questions in discussions

---

## 📊 Project Status

### Current Version: 1.0.0

#### ✅ Completed Features
- [x] Real-time climate data dashboard
- [x] User authentication and management
- [x] Push notification system
- [x] Weather and air quality monitoring
- [x] Responsive design with dark mode
- [x] Admin panel for user management
- [x] Climate alerts and notifications

#### 🚧 In Development
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Machine learning predictions
- [ ] Multi-language support
- [ ] API rate limiting improvements

#### 🔮 Future Roadmap
- [ ] Real-time chat for community
- [ ] Climate data visualization tools
- [ ] Integration with IoT sensors
- [ ] Offline functionality
- [ ] Advanced reporting system

### Performance Metrics
- **Load Time**: < 2 seconds (95th percentile)
- **API Response**: < 500ms average
- **Uptime**: 99.9% target
- **Mobile Performance**: 90+ Lighthouse score

---

**Built with ❤️ by the ClimateNotify Team**

*Making climate data accessible and actionable for everyone*