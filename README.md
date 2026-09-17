# ⌨️ Simple Typing Test

A full-stack typing speed test web application inspired by Monkeytype.

Users can register, log in securely, take typing tests, view their WPM and accuracy, save their results, view typing history, and manage their profile.

## 🚀 Live Demo

Frontend: https://simple-typing-test-sand.vercel.app

Backend API: https://simple-typing-test.onrender.com

## ✨ Features

- User Registration
- Automatic Login after Registration
- User Login & Logout
- JWT Authentication
- Protected Routes
- Authentication Guard
- Typing Test
- 15-second Test
- 30-second Test
- 60-second Test
- WPM Calculation
- Accuracy Calculation
- Typing Result Saving
- Typing History
- Result Details
- User Profile
- Google Login
- Responsive UI

## 🛠️ Tech Stack

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Tailwind CSS
- Angular Signals
- Reactive Forms
- Angular Router
- HTTP Client

### Backend

- Java 17
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- REST APIs
- Maven

### Database

- MySQL

### Deployment

- Vercel - Frontend
- Render - Backend
- Aiven - MySQL Database

## 🏗️ System Architecture

```text
User
  │
  ▼
Angular Frontend
  │
  ▼
Vercel
  │
  │ REST API
  ▼
Spring Boot Backend
  │
  ▼
Render
  │
  ▼
MySQL Database
  │
  ▼
Aiven