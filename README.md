# LocalLink

A full-stack location-based local services marketplace that connects users with nearby service professionals.

## 🚀 Features

- 📍 Location-based service discovery
- 🔎 Search for local services
- 🏷️ Dynamic service categories
- 👨‍🔧 Provider profiles
- 📅 Service booking
- ⭐ Reviews and ratings
- ❤️ Favorites
- 🔔 Notifications
- 👤 Customer dashboard
- 👨‍💼 Provider dashboard
- 🛠️ Admin dashboard
- 📊 Admin management for categories, services and providers
- 📏 Radius-based nearby provider search
- 💳 Booking/payment flow

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other
- Browser Geolocation API
- REST APIs

## 📁 Project Structure

```text
LocalLink/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   │       ├── admin/
│   │       └── provider/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── package.json
│
├── .gitignore
└── README.md

```
▶️ Running the Application
Start Backend

From the server directory:

npm run dev

If the project uses another start command, check:

npm run
Start Frontend

Open another terminal:
npm run dev

🗄️ Database

LocalLink uses MongoDB 

MongoDB
   ↓
Express API
   ↓
React
🧩 Dynamic Services

One of the main goals of LocalLink is to make services dynamically manageable.

For example, an administrator can add:

Category: Electronics

Service: Laptop Repair

from the Admin Dashboard.

The data is saved in MongoDB and can then be retrieved by the user application.

This means developers do not need to modify React code every time a new service is added.

Example
Admin Dashboard
      ↓
Add Service
      ↓
MongoDB
      ↓
Service API
      ↓
User Application
      ↓
New Service Appears
👨‍💼 Admin Dashboard

The Admin Dashboard provides centralized management for the marketplace.

Categories

Administrators can:

Add categories
Edit categories
Activate/deactivate categories
Delete categories where appropriate
Services

Administrators can:

Add services
Assign services to categories
Edit services
Activate/deactivate services
Delete services where appropriate
Providers

Administrators can:

Add providers
Edit provider information
Manage provider status
Manage provider services
Manage provider location
Users

Administrators can view and manage user accounts according to their permissions.

Bookings

Administrators can monitor bookings and their current status.

Reviews

Administrators can review and manage submitted reviews.

🔎 Service Search

Users can search for services such as:

AC Repair
Plumber
Electrician
Laptop Repair
Home Cleaning
Car Repair
Bike Repair
Painter
Carpenter

Search results are retrieved from the backend/database rather than being permanently hardcoded into the frontend.

👨‍🔧 Provider Discovery

Providers are associated with services and geographical locations.

A provider can have information such as:

Name
Business Name
Service
Experience
Rating
Price
Address
City
Latitude
Longitude
Service Radius
Availability
Status

This information allows the platform to display relevant nearby professionals.

📏 Distance Calculation

LocalLink uses geographical coordinates to calculate the approximate distance between:

User Location
        ↓
Provider Location

The Haversine formula is used by the backend utility to calculate geographical distance.

This enables radius-based provider discovery.


🔒 Security

The application uses backend authentication and authorization mechanisms.

Important security principles include:

Protected API routes
Authentication middleware
Role-based access where required
Environment variables for secrets
Backend request validation
Protected admin functionality

Frontend route protection alone should not be considered sufficient security.

🧪 Testing

The backend contains a development end-to-end testing utility:

server/utils/test_e2e.js

The application should be tested across:

Customer Flow
Register
   ↓
Login
   ↓
Detect Location
   ↓
Search Service
   ↓
Find Provider
   ↓
View Provider
   ↓
Book Service
Provider Flow
Register as Provider
   ↓
Provider Dashboard
   ↓
Manage Services
   ↓
Receive Booking
   ↓
Manage Booking
Admin Flow
Admin Login
   ↓
Admin Dashboard
   ↓
Add Category
   ↓
Add Service
   ↓
Add Provider
   ↓
Manage Marketplace
🛣️ Future Improvements

Potential future improvements include:

Advanced service filtering
Better provider recommendations
Real-time notifications

📌 Project Status

LocalLink is currently under active development.

The core platform includes:

Customer experience
Provider experience
Admin dashboard
Dynamic services
MongoDB data management
Location-based provider discovery
Booking functionality
👩‍💻 Author

Anshika Parmar

GitHub:

https://github.com/Anshikais
