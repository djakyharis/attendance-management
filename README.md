# AttendSecure

AttendSecure is a modern, cyberpunk-themed Attendance Management System built with React, Vite, and Tailwind CSS v4. It features a role-based dashboard for Employees, Managers, and Super Admins, along with a live camera scanner for biometric attendance logging.

## Features

- **Role-Based Access**: Specialized views for `employee`, `manager`, and `super-admin`.
- **Live Camera Scanner**: Hardware-level webcam access for secure check-ins.
- **Dynamic Themes**: Built entirely with Tailwind CSS v4 using CSS variables for a deep, terminal-like cyberpunk aesthetic.
- **Mock Auth State**: Currently uses local storage for prototyping role-based navigation until AWS Cognito is integrated.

## Tech Stack

- React 18
- Vite
- Tailwind CSS v4
- React Router DOM
- AWS Amplify (Prepared for backend integration)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Development Status
The application is currently in the frontend scaffolding and UI finalization phase. Backend integration with AWS (Cognito, API Gateway, DynamoDB) will commence once the required environment values are provided.
