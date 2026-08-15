# 🏛️ Civic Issue

### AI-Powered Civic Issue Reporting and Management Platform

> A full-stack platform that connects citizens, municipal authorities, workers, and government administrators to make civic issue reporting, prioritization, assignment, and resolution more efficient and transparent.

---

## 📸 Screenshots

<!-- Add your project screenshots/GIFs here -->

| Citizen Dashboard | Issue Reporting | Issue Tracking |
| ----------------- | --------------- | -------------- |
| Add screenshot    | Add screenshot  | Add screenshot |

| Municipal Dashboard | Worker Dashboard | Government Dashboard |
| ------------------- | ---------------- | -------------------- |
| Add screenshot      | Add screenshot   | Add screenshot       |

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Our Solution](#-our-solution)
* [Key Features](#-key-features)
* [How It Works](#-how-it-works)
* [User Roles](#-user-roles)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Future Improvements](#-future-improvements)
---

## 🚀 Overview

Civic Issue is a full-stack civic management platform designed to improve the way public issues are reported, processed, assigned, and resolved.

Citizens can report problems by providing details such as the issue description, images, and location. The system then uses AI and location-based processing to identify duplicate reports, determine the appropriate department, calculate issue priority, and help authorities manage the issue efficiently.

The platform provides separate interfaces for citizens, municipal authorities, workers, and government administrators, allowing each role to perform the tasks relevant to them.

---

## ❗ Problem Statement

Traditional civic issue reporting systems face several challenges:

* Citizens may not know which department should receive an issue.
* The same problem can be reported multiple times.
* Important issues may not receive sufficient priority.
* Authorities may have difficulty managing a large number of reports.
* Assigning issues to workers manually can be inefficient.
* Citizens often have limited visibility into the progress of their complaints.
* Communication between citizens and authorities can be slow.
* Language barriers can make civic platforms difficult to use.

Civic Issue aims to address these problems through automation, AI, location intelligence, and real-time communication.

---

## 💡 Our Solution

Civic Issue provides an intelligent workflow:

```text
Citizen
   ↓
establish connection with corresponding muncipal counsil
   ↓
Reports Civic Issue
   ↓
check validity and department identification
   ↓
Duplicate Detection
   ↓
Priority Calculation
   ↓
Municipal Authority
   ↓
Worker Assignment
   ↓
Issue Resolution
   ↓
Real-Time Status Update
   ↓
Citizen
```

This reduces unnecessary duplicate reports, improves issue routing, helps authorities prioritize important problems, and gives citizens better visibility into the resolution process.

---

# ✨ Key Features

### 👤 Citizen Features

* Submit civic issues with descriptions and images.
* Automatically attach the issue location.
* Track the status of submitted reports.
* Upvote existing issues.
* Receive email notifications when the issue status changes.
* View history of reports
* Access the platform in multiple languages.

### 🤖 AI-Powered Features

* AI-assisted issue processing.
* Duplicate issue detection.
* Multilingual dynamic content processing.
* Intelligent classification and processing of reports.

### 📍 Location Intelligence

* Identify the appropriate municipal council based on issue location.
* Route issues to the appropriate department.
* Use geographical information while detecting duplicate reports.
* Support location-based issue prioritization.

### 🚨 Intelligent Prioritization

Issues can be prioritized using multiple factors, such as:

* Issue location.
* Number of duplicate reports.
* Community upvotes.
* Importance of nearby locations.
* Other issue-specific factors.

For example, an issue near a hospital may receive higher priority than a similar issue near a less critical location.

### 👷 Worker Management

* Automatically assign issues to suitable workers.
* Consider worker availability/status.
* Assign nearby issues efficiently.

### 🔄 Real-Time Updates

Using real-time communication, changes to an issue can be reflected without requiring users to manually refresh the page.

Examples include:

* Issue status changes.
* Worker assignment.
* New updates.
* Administrative actions.

### 📧 Notifications

Citizens can receive email notifications when important changes occur to their reported issues.

### 🌐 Multilingual Support

The application supports multilingual interaction through:

* Static UI translation.
* Dynamic content translation.
* AI-assisted language processing.

---

# 🔄 How It Works

## 1. Citizen Reports an Issue

The citizen provides:

```text
Issue Description
       +
Image
       +
Location
       ↓
Civic Issue Platform
```

---

## 2. Issue Processing

The system processes the report and checks:

* Issue details.
* Validity of report
* Location.
* Image.
* Existing reports.
* Relevant department.

---

## 3. Duplicate Detection

The system searches for existing reports that may represent the same real-world problem.

The comparison can consider:

```text
Location
   +
Description
   ↓
Duplicate Detection
```

If a similar issue already exists, the system can associate the new report with the existing problem rather than treating it as a completely independent issue.

---

## 4. Department Assignment

Based on the issue type and geographical location, the report is routed toward the appropriate municipal authority/department.

---

## 5. Priority Calculation

The system evaluates different factors to determine the importance of an issue.

```text
Location Importance
        +
Duplicate Reports
        +
Community Upvotes
        +
Issue Characteristics
        ↓
   Priority Score
```

Higher-priority issues can then be handled before less critical issues.

---

## 6. Worker Assignment

After an issue reaches the appropriate authority, it can be assigned to a suitable worker.

The assignment process can consider:

```text
Worker Availability
        +
Worker Location
        +
Issue Location
        +
Existing Assignments
        ↓
Suitable Worker
```

---

## 7. Resolution and Tracking

The worker aproves the report .

Example:

```text
Reported
   ↓
Under Review
   ↓
Assigned
   ↓
approved 
   ↓
now work on the issue
```

The citizen can track these updates through the platform.

---

# 👥 User Roles

The platform consists of multiple interfaces.

## 👤 Citizen

Citizens can:

* Report issues.
* Upload images.
* Provide location information.
* Track reports.
* Upvote issues.
* Receive notifications.

## 🏢 Municipal Authority

Municipal authorities can:

* View incoming reports.
* Manage issues.
* Review priorities.
* Update issue status.

## 👷 Worker

Workers can:

* View assigned issues.
* See issue locations.
* Update work status.
* Mark issues as approved.

## 🏛️ Government Administrator

Government administrators 

* Adds the munciple council
* Makes the head of each munciple council

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Leaflet / React Leaflet
* i18n

## Backend

* Node.js
* Express.js
* Socket.IO

## Database & Storage

* MongoDB
* Redis
* Cloudinary

## AI

* Generative AI / LLM APIs
* AI-based duplicate detection
* AI-assisted multilingual processing

## Authentication & Services

* Firebase
* JWT
* SMTP / Email Services

---

# 🏗️ System Architecture

```text
                    ┌──────────────────┐
                    │     Citizens     │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │  Express / Node  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ↓              ↓              ↓
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ MongoDB  │   │  Redis   │   │Cloudinary│
        └──────────┘   └──────────┘   └──────────┘
              │
              ↓
        ┌──────────────────┐
        │   AI Services    │
        └──────────────────┘
              │
              ↓
        ┌──────────────────┐
        │ Municipal System │
        └──────────────────┘
              │
              ↓
        ┌──────────────────┐
        │     Workers      │
        └──────────────────┘
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone <https://github.com/with-end/CivicProject.git>
cd CivicProject
```

## 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## 4. Configure Environment Variables

Create `.env` files according to the environment variables required by the project.

## 5. Start the Backend

```bash
cd ../backend
npm run dev
```

## 6. Start the Frontend

```bash
cd ../frontend
npm run dev
```

The application should now be available through the local development server.

---

# Environment Variables

Example:

```env
PORT = 
DB_URL =

CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

JWT_SECRET = 

OPENROUTER_API_KEY = 
GEMINI_API_KEY =
SERVAM_API_KEY =

EMAIL_HOST =  
EMAIL_PORT =  
EMAIL_USER = 
EMAIL_PASS = 

FIREBASE_TYPE = 
FIREBASE_PROJECT_ID =
FIREBASE_PRIVATE_KEY_ID = 
FIREBASE_PRIVATE_KEY =
FIREBASE_CLIENT_EMAIL =
FIREBASE_CLIENT_ID = 
FIREBASE_AUTH_URI = 
FIREBASE_TOKEN_URI =  
FIREBASE_AUTH_PROVIDER_X509_CERT_URL = 
FIREBASE_CLIENT_X509_CERT_URL = 
FIREBASE_UNIVERSE_DOMAIN = 

FRONTEND_URL =

UPSTASH_TCP_URL =
```

---

# Future Improvements

Possible future improvements include:

* Mobile application.
* Advanced civic analytics.
* More sophisticated AI-based issue classification.
* Advanced worker route optimization.
* Citizen reputation/reward mechanisms.
* More advanced notification channels.

---

