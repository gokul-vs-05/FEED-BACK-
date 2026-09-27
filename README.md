# Student Feedback Management System

Simple MERN-style app (no React) built with HTML/CSS + Node.js/Express + MongoDB.

## Setup

1. Install dependencies:
   npm install

2. Make sure MongoDB is running locally on port 27017
   (or change the connection string in server.js).

3. Start the server:
   npm start

4. Open in browser:
   - Student form: http://localhost:3000/index.html
   - Admin page:   http://localhost:3000/admin.html

## Files
- server.js        -> Express server, MongoDB schema, API routes
- public/index.html -> Student feedback submission form
- public/admin.html -> Admin table: view, search by register no,
                        filter by course, average rating by faculty, delete
- public/style.css  -> Shared styling
