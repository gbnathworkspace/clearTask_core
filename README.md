# 📝 ClearTask - An Enhanced To-Do List Application

### 📖 Table of Contents
- Introduction
- Features
- Technologies Used
- Setup and Installation
- API Endpoints
- Usage
- Screenshots
- Future Enhancements
- Project Status
- Contributing
- License
- Contact

## 📌 Introduction
The Enhanced To-Do List Application is a full-stack project designed to help users manage their tasks efficiently. It offers a user-friendly interface, real-time updates, calendar integration, and various collaboration features. This project showcases modern web development practices and demonstrates a variety of technologies, including React, ASP.NET Core, and PostgreSQL.

## 🌟 Features
- **User Authentication**: Secure login with JWT-based authentication.
- **Task Management**: Add, update, and delete tasks with ease.
- **Due Date and Timeline view**: Assign due dates to tasks and display them on a timeline for better visualization.
- **Priority Management**: Set task priorities (High, Medium, Low) for better focus and task sorting.
- **Real-Time Updates**: Share your to-do list with others and receive real-time updates using WebSockets.
- **Push Notifications**: Receive notifications before the due date of tasks.
- **Responsive Design**: Optimized for desktop.


## 🛠️ Technologies Used
- **Frontend**: React, TypeScript, Vite  
- **Backend**: ASP.NET Core, C#  
- **Database**: PostgreSQL (AWS RDS)  
- **Authentication**: JWT (JSON Web Token)  
- **Sentiment Analysis**: NLP.js (Client-side JavaScript NLP library)
- **Styling**: CSS, Flexbox  
- **API Testing**: Swagger  
- **Deployment**: AWS EC2, AWS RDS  

## 🚀 Setup and Installation
Prerequisites
Node.js
.NET SDK
PostgreSQL Database
AWS Account (for deployment)
Frontend Setup
bash
Copy code
# Clone the repository
git clone https://github.com/yourusername/enhanced-todo-app.git

# Navigate to the client folder
cd enhanced-todo-app/cleartask.client

# Install dependencies
npm install

# Start the development server
npm run dev
Backend Setup
bash
Copy code
# Navigate to the server folder
cd enhanced-todo-app/clearTask.Server

# Restore .NET dependencies
dotnet restore

# Update the database
dotnet ef database update

# Run the server
dotnet run
Environment Variables
Create a .env file in both client and server directories with the following keys:

bash
Copy code
# Frontend .env
VITE_API_URL=http://localhost:5076

# Backend .env
ConnectionStrings__DefaultConnection=Your_PostgreSQL_Connection_String
Jwt__Key=Your_JWT_Secret_Key
🔗 API Endpoints
Authentication
POST /api/auth/register: Register a new user
POST /api/auth/login: Authenticate user and receive JWT
Task Management
GET /api/task/getalltasks?userId={userId}: Fetch all tasks for a user
POST /api/task/createtask: Create a new task
PATCH /api/task/updatetaskstatus: Update task completion status
POST /api/task/deletetask: Delete a task
Real-Time Updates
ws://localhost:5076/realtime: WebSocket endpoint for task updates

### 📸 Screenshots
Feature	Screenshot
Calendar View	
Task Management	
Dark Mode	

### 📅 Future Enhancements
Task Categories: Organize tasks by categories (e.g., Work, Personal).
Subtasks: Add support for subtasks under each main task.
Offline Support: Enable offline access using Service Workers.
Enhanced Notifications: Integrate email notifications for task reminders.

### 🚧 Project Status
The project is currently in the development phase. All core features are implemented, and additional enhancements are planned. Contributions are welcome!

### 🤝 Contributing
If you want to contribute to this project, please follow these steps:

Fork the repository.
Create a new feature branch (git checkout -b feature-name).
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature-name).
Create a Pull Request.

### 📄 License
This project is licensed under the MIT License -> see the LICENSE file for details.

### 📬 Contact
GitHub: yourusername
Email: your.email@example.com
LinkedIn: Your LinkedIn Profile
