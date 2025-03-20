# Hackathon P0

## Project ID: HACK-2025-YM-001

### Overview
Hackathon P0 is a full-stack application designed for managing a coding competition with 20 teams of 4 members each (80 participants). It provides features for user registration, team formation, competition setup, challenge creation, submission tracking, and score management.

### Features
- **User Management**: Register participants, judges, and admins with roles.
- **Team Management**: Create teams with leaders and members.
- **Competitions**: Define events with start/end dates and associated teams/challenges.
- **Challenges**: Assign tasks with points and track submissions.
- **Submissions**: Upload files (e.g., via Google Drive URLs) and review status.
- **Scoring**: Judges assign scores and comments to submissions.

### Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Middleware**: CORS, Morgan
- **Password Hashing**: bcrypt
- **Development**: Nodemon

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yassinemili/P0.git
   cd P0
