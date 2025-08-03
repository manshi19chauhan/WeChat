# We Chat

We Chat is a modern web application that helps language learners connect, chat, and practice together. It features real-time messaging, friend requests, onboarding, and video calls—all in a clean, responsive interface.

## Features

- **User Authentication:** Sign up, log in, and log out securely.
- **Onboarding:** Set up your profile with bio, languages, location, and avatar.
- **Find Partners:** Discover and connect with language learners worldwide.
- **Friend Requests:** Send, accept, and manage friend requests.
- **Real-Time Chat:** Chat instantly with friends (powered by Stream).
- **Video Calls:** Start video calls with your language partners.
- **Notifications:** Get notified about friend requests and new connections.
- **Themes:** Choose from multiple UI themes for a personalized experience.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, DaisyUI, React Query
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Real-Time:** Stream Chat API
- **Other:** JWT Auth, REST API, React Router

## Project Structure

```
Wechat/
  backend/    # Express API, MongoDB models, controllers, routes
  frontend/   # React app, components, pages, styles
```

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` and fill in required values.
4. **Run the app**
   - Start backend: `npm run start --prefix backend`
   - Start frontend: `npm run dev --prefix frontend`

## Usage

- Sign up and complete onboarding.
- Find and connect with language partners.
- Chat and start video calls with friends.

---

**Made for language learners, by language
