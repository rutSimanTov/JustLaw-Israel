# JustLaw Israel - JusticeTech Ecosystem Platform ⚖️
## Project Overview 📖

JustLaw Israel facilitates community building in the justicetech space by providing professional networking, structured accelerator programs, and a curated knowledge repository. The platform connects users through customizable profiles, manages cohort-based accelerator applications, and serves as a central hub for justicetech resources and events.

## Key Components 🛠️

- **Backend API:** Node TypeScript service deployed on Render
- **Frontend Application:** React TypeScript application deployed on Netlify  
- **Database:** Supabase PostgreSQL
- **Integrations:** Google Meet, Google Calendar, PayPal

## Team Structure 🚀

The project is developed collaboratively by two companies, each handling specialized feature sets:

### Company A: User-Facing Platform
_Focus: External user experience and public-facing features_

1. **Profile Management Team:** User registration, profiles, search, and LinkedIn integration
2. **Knowledge Hub Team:** Content management, categorization, search, and publishing workflow.

### Company B: Program Management & Infrastructure
_Focus:  Administrative systems and core infrastructure_

3. **Accelerator Program Team:** Application workflow, Google Calendar, events, and Zoom integration
4. **Infrastructure Team:** Main website, admin dashboard, donation system, and shared components

## Documentation 📑

### Project Documentation
- [Main Project Document](https://docs.google.com/document/d/1bV6V7-efPyCAex9npd1aAYTCMa3IzPlI0L45b3wE644) - System architecture, user roles, technical overview, and wireframes
- [Company Structure Document](https://docs.google.com/document/d/1seSjbt-BaCaLOpVburyOmsHdWuOB7xtLOrqcLA_H9dY/edit) - Detailed breakdown of company responsibilities

### Team-Specific PRDs
- [Profile Management PRD](https://docs.google.com/document/d/1NfXSIZE3NO8D20S_LycUBcWG8o0wnLgWnTAKHdaqvrc/edit) - Detailed requirements for profile system
- [Knowledge Hub PRD](https://docs.google.com/document/d/1X4j_xsHTuImdViu1pWx9oUGv_OAKBB27Hv6AQqC2obM/edit) - Content management system requirements
- [Accelerator Program PRD](https://docs.google.com/document/d/1_m01D7azWbCjkrzhanu1s9l50FF8LvaCdbBMkExso9M/edit) - Accelerator workflow and integration requirements  
- [Infrastructure PRD](https://docs.google.com/document/d/1nrCc-a6uBmXMuB-UQcfE7N8ndC-lidHc86ilJ2_VJUg/edit) - Website and infrastructure requirements

### Wireframes from customer
- [The homepage](https://gemini.google.com/share/f53615bbeab5)
- [The Profile signup flow](https://gemini.google.com/share/000556b71ac0)
- [The Accelerator page](https://gemini.google.com/share/42991b7640ba)


### API Documentation
The API documentation is generated from the TypeScript definitions. Core endpoints include authentication, profiles, accelerator applications, content management, and admin functions.

## Project Structure 🗂️

```
justlaw-israel/
├── packages/
│   ├── backend/           # Node.js TypeScript API
│   ├── frontend/          # React TypeScript application
│   ├── shared/            # Shared TypeScript types
└── README.md
```

## Development Setup ⚙️

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Google Cloud Console account
- Supabase account

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/justlaw-israel/platform.git
cd justlaw-israel
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```
Update the variables with your local configuration.

4. Start the development servers:
```bash
# In one terminal:
npm run dev:backend

# In another terminal:
npm run dev:frontend
```

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api

## Deployment ☁️

### Backend (Render)
1. Connect your Render account to the GitHub repository
2. Configure build command: `npm run build:backend`
3. Configure start command: `npm run start:backend`
4. Set required environment variables in Render dashboard

### Frontend (Netlify)
1. Connect your Netlify account to the GitHub repository
2. Configure build command: `npm run build:frontend`
3. Configure publish directory: `packages/frontend/build`
4. Set required environment variables in Netlify dashboard

### Database (Supabase)
1. Create a new project in Supabase
2. Run migration scripts: `npm run db:migrate`
3. Update environment variables with Supabase connection details

## Contributing 🎁

### Development Workflow
- **API-First Approach:** Week 1 focuses on API contracts and mock implementations
- **Cross-Company Collaboration:** Both companies work on the same unified system
- **Branch Naming:** `feature/team-X-feature-name`, `bugfix/team-X-issue-description`
- **Commit Format:** `[TEAM-X] Type: Brief description`

### Git Workflow
1. Create a new branch: `git checkout -b feature/team-1-profile-creation`
2. Commit changes: `git commit -m "[TEAM-1] Feature: Add profile creation form"`
3. Push to branch: `git push origin feature/team-1-profile-creation`
4. Submit a pull request to `develop` branch

## Timeline ⌛

**8 weeks total:**
- Week 1: API contracts and setup
- Weeks 2-6: Feature development
- Weeks 7-8: Testing, deployment, and documentation

## License 📋

This project is private and proprietary. Unauthorized copying, distribution, or use is strictly prohibited.
