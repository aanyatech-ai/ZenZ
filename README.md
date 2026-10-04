# ZenZ Study Tracker 🌸✨
> A mobile-first, personal-use Study Tracker Progressive Web App (PWA) tailored for **B.Tech CSE (AI) Semester III** students. Crafted with soft pastel aesthetics, glassmorphism cards, and an interactive 3D-styled animated mascot.

---

## 🌟 Visual Design & Aesthetics

- **Soft Pastel Gradients:** Lavender, blush pink, and peach palettes (`from-purple-500 via-pink-500 to-orange-400`).
- **Glassmorphism Cards:** 24px rounded corners (`rounded-3xl`), translucent frosted backdrop blur, soft colorful drop shadows, and subtle borders.
- **Cute 3D-Styled Mascot:** Original vector inline SVG blob mascot with smiley face, blush, breathing/floating animation, and motivational quotes.
- **Pill Action Buttons:** Purple → pink → orange gradient with spring-press motion and circular arrow icon.
- **Theme Modes:** Pastel Light, Cosmic Night Dark Mode, and Follow System.
- **Mobile-First Layout:** Designed for a 390px mobile viewport with responsive scaling for tablets and desktops.
- **Bottom Navigation Dock:** Floating glassmorphic tab bar with active spring pill indicator (Home, Syllabus, Planner, Calendar, Notes, Profile).

---

## 🚀 Tech Stack

- **Framework:** React 19 + Vite + TypeScript
- **Routing:** React Router v7
- **Styling:** Tailwind CSS with CSS custom variables
- **Motion & Micro-interactions:** Framer Motion + Canvas Confetti
- **State Management:** Zustand with `localStorage` persistence
- **Dates & Calendars:** `date-fns`
- **Analytics & Charts:** Recharts (`ResponsiveContainer`, `BarChart`)
- **Authentication & Backend:** Firebase Auth & Firestore with seamless **guest / offline localStorage fallback**
- **PWA:** Web App Manifest (`manifest.json`) and Service Worker (`sw.js`) for mobile installation and notification support

---

## 📚 Semester III B.Tech CSE (AI) Curriculum (Seed Data)

### 1. Theory Subjects (5 Units each, 8 Lectures per unit)
1. **NEC-301 Digital Circuits & Logic Design** (3 Credits)
   - Unit 1: Digital systems & binary numbers
   - Unit 2: Combinational logic
   - Unit 3: Sequential logic
   - Unit 4: Synchronous & asynchronous sequential circuits
   - Unit 5: Memory & programmable logic
2. **NCS-301 Data Structures** (4 Credits)
   - Unit 1: Arrays & linked lists
   - Unit 2: Stacks & queues
   - Unit 3: Trees
   - Unit 4: Searching, hashing & sorting
   - Unit 5: Graphs
3. **NCS-302 Object Oriented Programming (Java)** (4 Credits)
   - Unit 1: Object-oriented analysis & design
   - Unit 2: Java basics & OOP fundamentals
   - Unit 3: Inheritance & polymorphism
   - Unit 4: Arrays, strings & packages
   - Unit 5: Exception handling, multithreading & I/O
4. **NCS-303 Numerical & Statistical Techniques** (3 Credits)
   - Unit 1: Errors & root finding
   - Unit 2: Finite differences & interpolation
   - Unit 3: Numerical differentiation, integration & ODEs
   - Unit 4: Statistics, curve fitting & regression
   - Unit 5: Probability, distributions, sampling & hypothesis tests
5. **NCS-304 Theory of Automata** (4 Credits)
   - Unit 1: Finite automata (DFA, NFA, Moore & Mealy)
   - Unit 2: Regular expressions & regular languages
   - Unit 3: Grammars (CFG, CNF, GNF)
   - Unit 4: Push-down automata & CFLs
   - Unit 5: Turing machines & recursive function theory
6. **NAI-301 Basics of AI** (3 Credits)
   - Unit 1: Scope of AI, problem formulation & search
   - Unit 2: Knowledge representation & first-order logic
   - Unit 3: Structured knowledge representation
   - Unit 4: Handling uncertainty & machine learning
   - Unit 5: Expert systems & AI applications

### 2. Practical Labs (1 Credit each, Minimum Experiments Tracked)
- **NEC-351 Digital Circuits Lab:** 13 practical experiments
- **NCS-351 Data Structure Lab:** Min 10 of 20 practicals
- **NCS-352 Java Programming Lab:** Min 10 of 18 practicals
- **NCS-353 Numerical Techniques Lab (MATLAB):** Min 10 of 13 practicals
- **NCS-354 Theory of Automata Lab:** Min 10 of 20 practicals

### 3. General Proficiency & Marks Scheme
- **NGP-301 General Proficiency:** 50 marks, 0 credits
- **Theory Evaluation:** Class Test (CT) 20 + Teacher Assessment (TA) 10 + End Semester Exam (ESE) 70 = 100 marks
- **Lab Evaluation:** Sessional 20 + End Semester Practical Exam (ESE) 30 = 50 marks

---

## 📱 Screens & Features

1. **Splash & Onboarding (`/` or toggle):**
   - Brand logo with gradient glow, tagline, animated mascot, feature highlight pills, and "Get Started" button.
2. **Authentication Modal:**
   - Email & Password register/login, password reset, error banner, and guest/offline bypass.
3. **Home Dashboard (`/`):**
   - Personal greeting (`Good morning, Aanya`).
   - "Today's Focus" glassmorphic hero card with animated circular progress ring.
   - 7-day study streak badge with flame icon.
   - Quick Action buttons: Launch Pomodoro, To-Do list, Quick Notes, Calendar.
   - Semester III subjects grid with individual completion percentages and progress bars.
   - Upcoming 3 important dates with category badges and countdown indicators.
4. **Syllabus Tracker (`/syllabus`):**
   - Subject → Unit → Topic hierarchy.
   - 4-state topic cycling: `Not Started` ⚪ → `In Progress` 🟡 → `Done` 🟢 → `Needs Revision` 🟣.
   - Animated celebration confetti when completing units.
   - Labs & Practicals tracker comparing completed experiments to the minimum required.
   - Marks scheme calculator and assessment breakdown.
5. **Study Planner (`/planner`):**
   - User inputs target exam date and daily available study hours.
   - Algorithmic credit-weighted distribution of remaining topics across study days.
   - Today's study blocks with start/end times and subject tags.
   - Interactive tick-off checkboxes and 1-click "Reschedule Missed Blocks" engine.
6. **Important Dates Calendar (`/calendar`):**
   - Interactive month grid view with colored event dots.
   - Agenda list toggle.
   - Add/edit/delete events with title, date, time, notes, and category (Presentation, Exam, Assignment submission, Lab viva, Birthday, Other).
   - Repeat options (`Every year` for birthdays, `None`).
   - Reminders (`On the day`, `1 day before`, `1 hour before`) with browser notifications and in-app banner.
   - Countdown tags (`in 3 days`, `Today!`).
7. **Notepad (`/notes`):**
   - Sticky-note style responsive card grid with 5 pastel paper colors (lavender, pink, peach, mint, lemon).
   - Formatting tools: bold text, bulleted lists, and interactive checklists.
   - Pin important notes to the top of the grid.
   - Live search and filter by subject tag or pinned status. Autosaved to store.
8. **Skills & Analytics Sanctuary (`/profile`):**
   - Soft skills daily micro-habits (Communication, Presentation, Time Management, Teamwork).
   - Hard skills technical targets (DSA Practice, Java OOP, Python AI, SQL).
   - Custom skill task builder with duration and category.
   - Recharts visual analytics: Subject Completion Bar Chart & Weekly Study Hours.
   - JSON export and import for full offline data backup and migration.
   - One-click "Reload Semester III Seed Data" reset button.
9. **Global Pomodoro Focus Modal:**
   - 25m Focus / 5m Break circular timer with play/pause/reset.
   - Subject link selector and completion sound/confetti.
   - Accessible from the header on any screen.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# 1. Clone the repository
git clone <repo-url>
cd Orbit

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. (Optional) Configure Firebase environment variables
cp .env.example .env

# 4. Start local development server
npm run dev
```

The app will be accessible at `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```

---

## ⚙️ Environment Variables (`.env.example`)
If Firebase keys are not provided, ZenZ will automatically run in **offline/local mode** using `localStorage`:
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 📲 PWA Installation
- On Android / Chrome: Tap "Add to Home Screen" or the install icon in the address bar.
- On iOS / Safari: Tap the Share button → "Add to Home Screen".
#   Z e n Z  
 