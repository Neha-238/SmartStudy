# **SmartStudy**

**SmartStudy** is a web-based educational platform that simplifies access to academic resources for students and allows teachers to efficiently manage course materials. Students can **view, download, and organize study materials** such as books, notes, syllabus, and previous year questions (PYQs). The platform also includes an **AI Study Buddy powered by Google Gemini API** to help students understand concepts, summarize content, and practice through quizzes.

---

## **Features**

### **Student Features**
- **Browse and download study materials** by course and semester.
- **AI Study Buddy** powered by Gemini API:
  - Summarizes lecture notes and textbooks.
  - Explains complex concepts in simple terms.
  - Generates quizzes and flashcards.
  - Provides personalized study guidance.

### **Teacher / Admin Features**
- **Secure authentication** with JWT for login.
- **Teacher Dashboard** with CRUD operations:
  - Upload new study materials for their courses.
  - Update material **title** and **Drive link**.
  - Delete outdated or incorrect materials.

---

## **Technology Stack**
- **Frontend:** HTML, CSS, JavaScript 
- **Backend:** Node.js, Express.js, JWT authentication  
- **Database:** MongoDB  
- **AI Chatbot:** Google Gemini API  

## Screenshots

All project screenshots are available in the [screenshots folder](screenshots).

---

## **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SmartStudy.git
cd SmartStudy
```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Set up .env file in backend**
   ```bash
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   API_KEY=your_google_gemini_api_key
   ```
4. **Start backend server**
   ```bash
      cd backend
      npm start
   ```
5. **Open frontend**
   -Open frontend/index.html in your browser using Live Server extension in VS Code, or right-click → "Open with Live Server".
   -The frontend will run at something like http://127.0.0.1:5500.

6. **Access the APP**
   -Students can browse and download materials, and use the AI Study Buddy.
   -Teachers can log in via the Teacher Dashboard to manage materials.




