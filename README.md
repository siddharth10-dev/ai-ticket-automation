# AI Ticket Automation Platform

## Problem Statement

Customer support teams often receive hundreds or thousands of tickets every day. Manually reading, categorizing, prioritizing, and responding to every ticket is time-consuming and can delay customer support.

This project aims to automate the initial ticket triage process using AI. When a user creates a support ticket, the system automatically analyzes the issue, determines its category and priority, generates a draft response, and stores the analysis for support teams to review.

The goal is to reduce manual effort, improve response times, and help support teams focus on critical issues faster.

---

## Features

- User Management
- Ticket Creation & Tracking
- AI-Powered Ticket Analysis
- Automatic Category Detection
- Automatic Priority Assignment
- AI Generated Draft Responses
- Confidence Score Generation
- PostgreSQL Database Integration
- Docker Containerization
- Cloud Deployment Ready

---

## Tech Stack

### Backend
- Python
- FastAPI

### Database
- PostgreSQL
- SQLAlchemy

### AI
- Google Gemini API

### DevOps
- Docker
- Git
- GitHub

### Deployment
- Render

---

## How It Works

1. User creates a support ticket.
2. Ticket is stored in PostgreSQL.
3. Gemini AI analyzes the ticket description.
4. AI generates:
   - Category
   - Priority
   - Draft Response
   - Confidence Score
5. AI analysis is stored in a separate table.
6. Support agents can view ticket details along with AI recommendations.

---

## System Architecture

```text
User
  │
  ▼
FastAPI Backend
  │
  ├── PostgreSQL
  │
  ▼
Gemini AI
  │
  ▼
Category Detection
Priority Assignment
Draft Response Generation
Confidence Scoring
```

## API Endpoints

```http
POST /create_user
GET  /users

POST /create_ticket
GET  /view_tickets
GET  /ticket/{id}
GET  /ticket_details/{id}
```

## Docker

Build image:

```bash
docker build -t ai-ticket-automation .
```

Run container:

```bash
docker run --env-file .env -p 8000:8000 ai-ticket-automation
```

## Deployment

The application is containerized using Docker and deployed on Render, allowing the API to be accessed through a public URL.

## Key Concepts Implemented

- REST API Development
- Database Design
- Primary Keys & Foreign Keys
- SQL JOINs
- Environment Variables
- AI Integration
- Docker Containerization
- Backend Architecture Design

## Future Improvements

- React Dashboard
- Authentication & Authorization
- Role-Based Access Control
- Email Notifications
- Analytics Dashboard
- Multi-Agent AI Workflow

## Author

Siddharth Adep

Built as a practical AI + Backend Engineering project to explore how modern customer support workflows can be automated using FastAPI, PostgreSQL, Docker, and Large Language Models.
