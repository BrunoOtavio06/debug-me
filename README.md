# DebugMe - Educational Coding Game App

**DebugMe** is an interactive, gamified web application designed to teach programming through adventure and exploration. The app combines structured learning paths, hands-on coding challenges, career guidance, and an AI-powered tutoring chatbot to create a comprehensive learning experience.

The original design is available at [Figma](https://www.figma.com/design/V787j6as39BywMlgrzuaEr/Educational-Coding-Game-App).

## 🎯 Overview

DebugMe transforms learning to code into an engaging game-like experience. Users progress through levels by completing lessons and challenges, earning XP, unlocking achievements, and receiving personalized career guidance based on their skills and interests.

## ✨ Features

### 📊 Progress Dashboard
- **Level System**: Progress through levels by earning XP from completed activities
- **XP Tracking**: Visual progress bars showing XP earned and required for next level
- **Streak Counter**: Track daily learning streaks to maintain motivation
- **Character Cards**: Visual representation of your learning journey
- **Quick Stats**: Overview of lessons completed, challenges solved, badges earned, and current rank

### 📚 Interactive Lessons
- **Structured Learning Path**: Progressive lessons covering fundamental programming concepts
- **Topics Covered**: Variables, Functions, Conditionals, Loops, Arrays, and more
- **Difficulty Levels**: Beginner, Intermediate, and Advanced lessons
- **Content Includes**:
  - Clear explanations of programming concepts
  - Code examples with syntax highlighting
  - Interactive quizzes to test understanding
  - XP rewards for completion
- **Level Gating**: Lessons unlock as you progress, maintaining appropriate difficulty curve

### 🏆 Coding Challenges
- **Hands-On Practice**: Real coding challenges with starter code and test cases
- **Multiple Difficulties**: Easy, Medium, and Hard challenges
- **Features**:
  - Problem descriptions and requirements
  - Starter code templates
  - Test cases to validate solutions
  - Hints for guidance
  - Solution explanations
- **Topics**: Functions, Conditionals, Arrays & Loops, Strings, Logic problems (including classic FizzBuzz)

### 💼 Career Guidance
- **Profile Creation**: Create personalized profiles by rating your skills (1-5 scale) across 10 competencies:
  - Technical: Programming Logic, Analytical Thinking, Artificial Intelligence
  - Behavioral: Creativity, Collaboration, Adaptability, Communication, Problem Solving, Curiosity, Leadership
- **Career Matching**: Get compatibility scores for 6 tech careers:
  - Data Scientist
  - Software Engineer
  - UX Designer
  - Cybersecurity Specialist
  - Machine Learning Engineer
  - Tech Entrepreneur
- **Learning Path Recommendations**: Personalized suggestions for skill improvement
- **Automation Risk Analysis**: Understand automation risks for different careers with:
  - Risk level assessment (low/medium/high)
  - Task-by-task breakdown
  - Adaptation strategies
  - Complementary skills to develop

### 🤖 AI-Powered Chatbot (BuggyChat)
- **Dual-Purpose Assistant**: 
  - **Programming Tutor**: Answers questions about completed lessons, teaches new concepts, provides code examples
  - **Career Advisor**: Provides guidance on career paths, upskilling, reskilling, job interviews, and automation risk
- **Context-Aware**: Uses your completed lessons and career profile to provide personalized responses
- **Features**:
  - Markdown support with syntax highlighting
  - Conversation history
  - Clear chat functionality
  - Responsive design with smooth scrolling

### 👤 Profile & Achievements
- **Comprehensive Stats**: Track total XP, current level, lessons/challenges completed, streaks, and badges
- **Badge System**: Earn badges for milestones:
  - First Steps: Complete your first lesson
  - Learning Streak: Complete 5 lessons
  - Challenge Master: Complete 3 challenges
  - Rising Star: Reach Level 5
  - Perfectionist: Get 100% on any quiz
  - Dedicated Learner: Maintain a 7-day streak
- **Progress Visualization**: Visual progress bars and achievement displays

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 6.3
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (comprehensive component library)
- **AI Integration**: LangChain with OpenAI (GPT-4o-mini)
- **Code Highlighting**: react-syntax-highlighter
- **Markdown Rendering**: react-markdown
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js)
- **OpenAI API Key** (for chatbot functionality)

## 🚀 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd debug-me
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including React, Vite, Tailwind CSS, Radix UI components, LangChain, and other packages.

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your OpenAI API key to the `.env` file:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The chatbot feature requires a valid OpenAI API key. Without it, the chatbot will not function. You can get an API key from [OpenAI's website](https://platform.openai.com/api-keys).

### 4. Start the Development Server

```bash
npm run dev
```

The development server will start on `http://localhost:3000` (as configured in `vite.config.ts`). The browser should automatically open to the application.

### 5. Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build/` directory.

## 📁 Project Structure

```
debug-me/
├── public/              # Static assets (images, etc.)
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components (Radix UI based)
│   │   ├── career-view.tsx
│   │   ├── challenges-view.tsx
│   │   ├── chatbot-widget.tsx
│   │   ├── lessons-view.tsx
│   │   ├── profile-view.tsx
│   │   └── progress-dashboard.tsx
│   ├── services/        # Business logic and API services
│   │   ├── career-data.ts
│   │   └── chatbot.ts
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 🎮 How to Use

1. **Start Learning**: Navigate to the "Lessons" tab and begin with beginner-level lessons
2. **Complete Challenges**: Test your skills in the "Challenges" tab
3. **Track Progress**: Monitor your XP, level, and achievements in the "Dashboard"
4. **Get Career Guidance**: Create a profile in the "Career" tab to receive personalized recommendations
5. **Ask Questions**: Use the BuggyChat widget (bottom-right) to get help with programming or career questions
6. **View Profile**: Check your achievements and stats in the "Profile" tab

## 🔧 Configuration

### Development Server Port

The default port is 3000. To change it, modify `vite.config.ts`:

```typescript
server: {
  port: 3000,  // Change to your preferred port
  open: true,
}
```

### OpenAI Model

The chatbot uses GPT-4o-mini by default. To change the model, edit `src/services/chatbot.ts`:

```typescript
return new ChatOpenAI({
  modelName: 'gpt-4o-mini',  // Change to your preferred model
  temperature: 0.7,
  openAIApiKey: apiKey,
});
```

## 🐛 Troubleshooting

### Chatbot Not Working
- Ensure `VITE_OPENAI_API_KEY` is set in your `.env` file
- Verify your OpenAI API key is valid and has sufficient credits
- Check the browser console for error messages

### Port Already in Use
- Change the port in `vite.config.ts` or stop the process using port 3000

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js 18 or higher

## 📝 Notes

- All user progress is stored in browser state (localStorage not implemented in current version)
- The chatbot requires an active internet connection and valid OpenAI API key
- Career recommendations are based on the compatibility scoring algorithm defined in the codebase

## 🤝 Contributing

This is an educational project based on a Figma design. Contributions and improvements are welcome!

## 📄 License

This project is for educational purposes. Please refer to the original Figma design for attribution.

---

**Happy Coding! 🚀**