📚 Academic Exchange: Full-Stack Marketplace
Academic Exchange is a high-performance, full-stack web application designed for students to facilitate the peer-to-peer exchange of academic resources. Built with a focus on modern Glassmorphism design and real-time interactivity, the platform ensures a seamless experience for buying, selling, and communicating within a campus ecosystem.

🌟 Enhanced Feature Set
Premium Visual Experience: Utilizes Tailwind CSS to implement glassmorphism (frosted glass) effects, backdrop blurs, and animated floating orbs in the background for a high-end, dynamic feel.

Real-Time Bidirectional Communication: Integrated Socket.io engine allows users to chat instantly. Features include:

Live Notifications: Toast pop-ups for incoming messages when the chat window is closed.

Persistent History: Chat logs are stored in SQLite and reloaded upon entering a room.

Inbox Management: A centralized view of all active conversations with "Last Message" previews.

Smart Product Discovery: * Instant Search: Client-side filtering logic that updates the product grid in real-time as users type.

Staggered Animations: Product cards enter the view with a timed CSS fade-down delay for a polished entry.

Security & Authentication: * BCRYPT Hashing: All user passwords are encrypted before being stored in the database.

JWT Authorization: Secure JSON Web Tokens are used to protect private routes like "Sell a Product" and "Admin Dashboard."

Comprehensive Admin Suite: A dedicated management portal for platform moderators to track user growth, monitor inventory, and perform administrative deletions.

🛠️ Technical Deep Dive
Backend Architecture
The server is built on Node.js and Express, following a modular structure:

REST API: Handles standard operations like user registration, login, and product CRUD (Create, Read, Update, Delete).

Relational Database: SQLite was chosen for its lightweight, serverless nature, enabling fast development without sacrificing the power of SQL queries.

Image Handling: Implemented using Multer for processing multipart/form-data, ensuring product images are safely stored and served statically.

Frontend Logic
State Management: Vanilla JavaScript manages the UI state (swapping between Login, Dashboard, and Admin views) without the overhead of heavy frameworks.

Responsive Engine: Uses a mobile-first approach with Tailwind’s utility classes to ensure 100% compatibility with smartphone browsers.

📂 Advanced Project Structure
Plaintext

academic-exchange/
├── backend/
│   ├── config/         # SQLite database initialization logic
│   ├── controllers/    # Controller logic for auth and listings
│   ├── middleware/     # JWT verification and route protection
│   ├── routes/         # Express router for clean API mapping
│   ├── uploads/        # Physical storage for product images
│   ├── server.js       # Entry point: Express app + Socket.io server
│   ├── setupAdmin.js   # Script for manual Admin account seeding
│   └── database.sqlite # The relational data store
└── frontend/
    ├── js/             
    │   └── main.js     # Core frontend engine (API calls, Socket events, UI logic)
    └── index.html      # Single Page Application (SPA) structure with Glassmorphism CSS
🚀 Deployment & Local Orchestration
Setting Up the Environment
Dependency Installation:

Bash

cd backend && npm install
Database Seeding: Initialize your tables and admin user to prevent "Table not found" errors:

Bash

node setupAdmin.js
Launch:

Bash

node server.js
Network Configuration for Mobile Testing
To bridge the connection between your laptop and mobile device:

Locate your internal IPv4 address via ipconfig.

Update the API_URL in main.js to point to http://YOUR_IP:5000.

The backend is configured to listen on 0.0.0.0 to allow cross-device handshakes on the same local network.

📜 Development Philosophy
This project was developed with performance and aesthetics in mind. By avoiding heavy frontend frameworks, the application maintains a near-instant load time while the custom CSS animations provide a degree of polish usually reserved for high-budget commercial applications.

Next Step for You:
Would you like me to add a "Future Roadmap" section to the README? This would outline cool features you could add later, like Google Login, Push Notifications, or User Ratings.
