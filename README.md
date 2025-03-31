# Learning Languages - From Words to Conversions...

![Learning Languages Logo](client\src\assets\logo.png)

## 🎯 Overview

Learning Languages is an interactive platform designed to help users learn new languages through a combination of text-based lessons, audio exercises, and interactive quizzes. The platform features a modern, user-friendly interface and real-time progress tracking.

## ✨ Features

- 📚 Interactive language lessons
- 🎤 Audio pronunciation exercises
- 📝 Progress tracking
- 🔄 Real-time feedback
- 📱 Responsive design
- 🔐 User authentication
- 📊 Performance analytics

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Bootstrap
- TailwindCSS
- Firebase
- EmailJS

### Backend
- Python
- Flask
- SQLite

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/learning-languages.git
cd learning-languages
```

2. Set up the Frontend
```bash
cd client
npm install
```

3. Set up the Backend
```bash
cd ../server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

4. Environment Setup
Create a `.env` file in the client directory with the following variables:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Running the Application

1. Start the Backend Server
```bash
cd server
python app.py
```

2. Start the Frontend Development Server
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
learning-languages/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main application component
│   └── package.json       # Frontend dependencies
├── server/                 # Backend Flask application
│   ├── app.py            # Main server file
│   └── requirements.txt   # Python dependencies
└── README.md             # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Sujal Vadgama (mrvadgamas@gmail.com)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries
