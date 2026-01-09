# Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection configuration
│   │   ├── env.js               # Environment variables validation
│   │   └── constants.js         # App constants
│   │
│   ├── models/
│   │   ├── User.js              # User schema/model
│   │   ├── Habit.js             # Habit schema/model
│   │   ├── HabitEntry.js        # Daily habit completion entries
│   │   ├── Journal.js           # Journal entry schema/model
│   │   └── index.js             # Export all models
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, signup, logout
│   │   ├── userController.js    # User profile operations
│   │   ├── habitController.js   # CRUD operations for habits
│   │   ├── journalController.js # Journal CRUD operations
│   │   ├── analyticsController.js # Analytics and stats
│   │   └── settingsController.js  # Settings operations
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── userRoutes.js        # User routes
│   │   ├── habitRoutes.js       # Habit routes
│   │   ├── journalRoutes.js     # Journal routes
│   │   ├── analyticsRoutes.js   # Analytics routes
│   │   ├── settingsRoutes.js    # Settings routes
│   │   └── index.js             # Combine all routes
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── validator.js         # Request validation middleware
│   │   └── logger.js            # Request logging middleware
│   │
│   ├── services/
│   │   ├── authService.js       # Authentication business logic
│   │   ├── habitService.js      # Habit business logic
│   │   ├── journalService.js    # Journal business logic
│   │   ├── analyticsService.js  # Analytics calculations
│   │   └── emailService.js      # Email notifications (optional)
│   │
│   ├── utils/
│   │   ├── jwt.js               # JWT token utilities
│   │   ├── bcrypt.js            # Password hashing utilities
│   │   ├── validators.js        # Validation helper functions
│   │   ├── dateHelpers.js       # Date manipulation utilities
│   │   └── response.js          # Standardized API responses
│   │
│   ├── validators/
│   │   ├── authValidators.js    # Auth request validators
│   │   ├── habitValidators.js   # Habit request validators
│   │   └── journalValidators.js # Journal request validators
│   │
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
│
├── tests/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── habits.test.js
│   │   └── journal.test.js
│   └── fixtures/
│       └── sampleData.js
│
├── .env.example                 # Example environment variables
├── .gitignore
├── package.json
├── README.md
└── nodemon.json                 # Nodemon configuration (if using)

```

## Key Files Description

### Core Files
- **server.js** - Entry point, starts the server
- **app.js** - Express app configuration, middleware setup
- **package.json** - Dependencies and scripts

### Config
- **database.js** - MongoDB connection using Mongoose
- **env.js** - Environment variable validation

### Models (MongoDB Schemas)
- **User.js** - User authentication and profile
- **Habit.js** - Habit definitions (name, icon, type, frequency, etc.)
- **HabitEntry.js** - Daily habit completion records
- **Journal.js** - Journal entries with mood, gratitude, etc.

### Controllers
- Handle HTTP requests/responses
- Call services for business logic
- Return standardized responses

### Routes
- Define API endpoints
- Connect routes to controllers
- Apply middleware (auth, validation)

### Middleware
- **auth.js** - Verify JWT tokens
- **errorHandler.js** - Catch and format errors
- **validator.js** - Validate request data

### Services
- Business logic layer
- Database operations
- Complex calculations (analytics)

### Utils
- Reusable helper functions
- JWT token generation/verification
- Password hashing
- Date utilities



