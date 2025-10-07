# ClimateNotify - Climate Alert System

A comprehensive climate monitoring and alert system built with React + Vite, featuring real-time notifications, SMS alerts, and climate analytics.

## 🚀 Features

- **Real-time Climate Monitoring** - Track climate data and trends
- **Push Notifications** - Send instant alerts to users via Firebase Cloud Messaging
- **SMS Notifications** - Send SMS alerts with CSV upload and database integration
- **Climate Analytics** - Detailed data visualization and insights
- **User Management** - Admin dashboard for managing users and permissions
- **Services Management** - Render.com integration for service control
- **Dark Mode Support** - Full dark/light theme support
- **Responsive Design** - Mobile-first, works on all devices

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Firebase account (for push notifications)
- Appwrite account (for backend)
- SMS provider account (Twilio, AWS SNS, etc.)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dhanunjay7777/ClimateNotify.git
   cd Climatenotification
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```properties
   VITE_NASA_API_KEY=your_nasa_api_key
   VITE_VISUAL_CROSSING_API_KEY=your_weather_api_key
   VITE_API_BASE_URL=http://localhost:5000
   VITE_SMS_SINGLE_LIMIT=160
   VITE_SMS_MULTI_LIMIT=153
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start backend server** (in separate terminal)
   ```bash
   cd server
   npm install
   npm start
   ```

## 📱 SMS Configuration

The SMS Notification system uses environment variables for easy customization:

- `VITE_SMS_SINGLE_LIMIT` - Maximum characters for single SMS (default: 160)
- `VITE_SMS_MULTI_LIMIT` - Characters per part in multi-part SMS (default: 153)

For detailed SMS configuration, see [SMS_CONFIGURATION.md](./SMS_CONFIGURATION.md)

### SMS Features:
- ✅ Manual phone number entry
- ✅ Fetch users from database
- ✅ CSV file upload with validation
- ✅ Real-time character counter
- ✅ SMS parts calculator
- ✅ Download CSV template
- ✅ Admin-only access

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material Icons** - Icon library
- **Firebase** - Push notifications (FCM)

### Backend
- **Express.js** - Node.js server framework
- **Appwrite** - Backend as a Service
- **Node.js** - Runtime environment

## 📂 Project Structure

```
Climatenotification/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard components
│   │   │   ├── MessagingDashboard.jsx
│   │   │   ├── SMSNotificationDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── ...
│   │   └── layout/         # Layout components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── styles/            # Global styles
├── server/                # Backend server
│   ├── api/              # API routes
│   ├── middleware/       # Express middleware
│   └── server.js         # Main server file
├── public/               # Static assets
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
└── SMS_CONFIGURATION.md  # SMS setup guide
```

## 🔑 Key Features

### Admin Dashboard
- User management with role-based access
- Service monitoring and control
- Real-time analytics and reporting

### Notification System
- **Push Notifications**: Firebase Cloud Messaging integration
- **SMS Notifications**: Multi-provider support with CSV import
- **Alert Management**: Climate-based alert triggers

### Climate Data
- NASA API integration
- Visual Crossing Weather API
- Historical data analysis
- Predictive analytics

## 🔒 Security

- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting on API endpoints
- ✅ Input sanitization and validation
- ✅ SQL/NoSQL injection prevention
- ✅ XSS protection with Helmet.js
- ✅ CORS configuration

## 📊 Environment Variables

All configurable values are stored in `.env`:

```properties
# API Keys
VITE_NASA_API_KEY=your_key
VITE_VISUAL_CROSSING_API_KEY=your_key

# Backend
VITE_API_BASE_URL=http://localhost:5000

# SMS Configuration
VITE_SMS_SINGLE_LIMIT=160
VITE_SMS_MULTI_LIMIT=153
```

See `.env.example` for complete list.

## 🧪 Development

### Run in development mode
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint code
```bash
npm run lint
```

## 📝 Documentation

- [SMS Configuration Guide](./SMS_CONFIGURATION.md) - Detailed SMS setup
- [API Documentation](./server/README.md) - Backend API reference
- [Component Library](./src/components/README.md) - Component usage

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Dhanunjay** - [GitHub](https://github.com/Dhanunjay7777)

## 🙏 Acknowledgments

- NASA Open APIs for climate data
- Visual Crossing for weather data
- Firebase for push notifications
- Appwrite for backend services
- Material Design Icons

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@climatenotify.com
- Documentation: [Wiki](https://github.com/Dhanunjay7777/ClimateNotify/wiki)

## 🚀 Deployment

### Vercel (Frontend)
```bash
npm run build
vercel deploy
```

### Render (Backend)
- Connect your GitHub repository
- Set environment variables in Render dashboard
- Deploy automatically on push

---

**Built with ❤️ for climate awareness and action**
