# 🛡️ RAAH-SETU - Complete Safety Application

**YOUR SAFETY, OUR PATH** — A comprehensive personal safety platform designed to keep you connected, informed, and protected 24/7.

## 🌟 Key Features

### Core Safety Features
- **🚨 Instant SOS Alerts** - One-click emergency activation with instant notifications to guardians
- **📍 Live Location Sharing** - Real-time location tracking and sharing with trusted contacts
- **👥 Guardian System** - Add trusted guardians who receive alerts during emergencies
- **🗺️ Interactive Map** - Live map view showing your location and nearby users

### Emergency & Contacts
- **📞 Emergency Contacts Management** - Quick access emergency contact list with priority levels
- **🎯 Contact Quick Call** - One-click calling to high-priority emergency contacts
- **📋 Incident Reports** - Document and track safety incidents with detailed information
- **🔴 Severity Levels** - Categorize incidents by severity (High, Medium, Low)

### Health & Wellness
- **❤️ Health Check-ins** - Daily wellness tracking with mood logging and heart rate monitoring
- **📊 Wellness Statistics** - Track average heart rate, mood patterns, and check-in frequency
- **🧠 Mood Tracking** - Monitor emotional well-being with emoji-based mood indicators
- **📈 Health Analytics** - Visual insights into your wellness trends

### Activity & Analytics
- **📋 Activity History** - Complete log of all safety-related activities
- **📊 Advanced Analytics Dashboard** - Statistics, charts, and safety insights
- **📈 Weekly Activity Charts** - Visualize your safety activity patterns
- **🎯 Safety Score** - Real-time safety assessment and recommendations

### Education & Safety
- **💡 Safety Tips & Resources** - Comprehensive safety guides and best practices
- **🛡️ Prevention Tips** - Learn how to prevent unsafe situations
- **🚨 Emergency Response** - Guidelines for responding to emergencies
- **👀 Awareness Tips** - Stay informed about common safety threats

### Communication & Notifications
- **🔔 Smart Notifications Center** - Organized notification management
- **📱 Real-time Alerts** - Get instant alerts for important events
- **✅ Notification Preferences** - Customize which alerts you receive
- **🔄 Read/Unread Status** - Track notification status and manage bulk actions

## 🎨 UI/UX Enhancements

### Modern Design System
- **Gradient Backgrounds** - Beautiful gradient color schemes throughout
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Full dark theme for comfortable viewing
- **Smooth Animations** - Hover effects and transitions for better UX
- **Accessible Components** - Proper contrast ratios and semantic HTML

### Navigation
- **Intuitive Navigation Bar** - Main navigation with dropdown menu for more options
- **Mobile Menu** - Collapsible menu for mobile devices
- **Quick Access Buttons** - Direct links to frequently used pages
- **Breadcrumb Navigation** - Easy navigation through the app

## 📱 Pages & Routes

| Route | Page | Features |
|-------|------|----------|
| `/` | Home/Index | Landing page with features showcase |
| `/dashboard` | Dashboard | Main hub with stats and quick access |
| `/profile` | Profile | User profile with emergency contacts |
| `/settings` | Settings | Safety preferences and trusted zones |
| `/emergency-contacts` | Emergency Contacts | Manage emergency contact list |
| `/activity` | Activity History | Log of all safety activities |
| `/health` | Health Check | Wellness tracking and monitoring |
| `/incidents` | Incident Reports | Document and track incidents |
| `/analytics` | Analytics | Advanced statistics and insights |
| `/safety-tips` | Safety Tips | Safety guides and resources |
| `/notifications` | Notifications | Notification center |
| `/alerts` | Alerts | Current active alerts |
| `/guardians` | Guardians | Manage trusted guardians |
| `/map` | Map | Live location map |
| `/sos` | SOS | Emergency SOS page |

## 🚀 Getting Started

### Prerequisites
- Node.js v22.12.0+
- npm 10.2.4+
- Python 3.12+ (for backend)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Hackthone-main
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd Backend
pip install -r requirements.txt
```

### Running the Application

1. **Start the backend server** (from Backend directory)
```bash
python app.py
# or
flask run
```

2. **Start the frontend development server**
```bash
npm run dev
```

3. **Access the application**
```
http://localhost:8080
```

## 🔧 Technology Stack

### Frontend
- **React** with TypeScript
- **Vite** for build and dev server
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Radix UI** for components
- **Clerk** for authentication
- **Geolocation API** for location services

### Backend
- **Flask** for REST API
- **Python** for backend logic
- **MySQL** for database
- **EmailJS** for email notifications
- **Nodemailer** for node-based emails

### Design System
- **HSL Color Variables** for theming
- **Gradient Backgrounds** for visual appeal
- **Responsive Grid System** for layout
- **Dark Mode Support** for accessibility

## 💾 Data Storage

The application uses **localStorage** for demo data storage:
- `emergencyContacts` - Emergency contact list
- `incidents` - Incident reports
- `activities` - Activity log
- `healthChecks` - Health check-ins
- `notifications` - User notifications
- `reports:v1` - General reports

## 🎯 Key Functionalities

### SOS Alert System
1. Click SOS button to activate emergency
2. Automatic location capture
3. Instant notification to all guardians
4. Option to share location with nearby users
5. Real-time timer and status display

### Health Monitoring
1. Daily mood check-ins
2. Heart rate tracking
3. Location capture with check-ins
4. Wellness statistics dashboard
5. Visual mood trend analysis

### Emergency Contact Management
1. Add/Edit/Delete emergency contacts
2. Set priority levels for each contact
3. Quick call buttons for priority contacts
4. Email and phone information storage
5. Relationship tracking

### Incident Reporting
1. Report various incident types (theft, harassment, accident, lost item, other)
2. Set severity levels
3. Add detailed descriptions and locations
4. Track incident status (reported, investigating, resolved)
5. View incident history with timeline

## 🔐 Security Features

- **Clerk Authentication** - Secure user authentication
- **Location Privacy** - User controls location sharing
- **Data Encryption** - Sensitive data protection
- **Emergency Override** - Priority access to emergency features
- **Contact Verification** - Verify trusted contacts

## 📊 Analytics & Insights

- **Safety Score** - Real-time safety assessment
- **Activity Metrics** - Track all safety-related activities
- **Health Trends** - Monitor wellness patterns
- **Weekly Charts** - Visual activity representation
- **Recommendations** - Personalized safety suggestions

## 🌍 Use Cases

1. **Women's Safety** - Personal safety during travel
2. **Night Workers** - Protection during odd hours
3. **Solo Travelers** - Safety while traveling alone
4. **Emergency Response** - Quick access to help
5. **Health Monitoring** - Wellness and medical tracking
6. **Family Coordination** - Keep family informed
7. **Student Safety** - Campus safety monitoring
8. **Workplace Safety** - Employee safety tracking

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 📝 License

This project is open source and available for educational and personal use.

## 👥 Team

Built with ❤️ for personal safety and security.

## 📞 Support

For support or questions:
- Email: support@raah-setu.com
- Phone: Emergency: 911 (US), 999 (UK), 112 (EU)
- Website: [Your Website]

## 🙏 Acknowledgments

- Tailwind CSS for styling utilities
- React for the amazing framework
- Clerk for authentication
- The entire open-source community

---

**Remember: Your Safety is Our Priority. Stay Safe, Stay Connected! 🛡️**
