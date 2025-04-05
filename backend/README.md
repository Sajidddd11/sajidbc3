# Todo App Backend

This is the backend for a Todo application, built with Node.js, Express, and Supabase.

## Setup

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Supabase account

### Installation
1. Clone this repository
2. Install dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_api_key
JWT_SECRET=your_jwt_secret
```

### Database Setup
You need to create the following tables in your Supabase project:

#### users
- id (uuid, primary key)
- username (text, unique)
- name (text)
- email (text, unique)
- phone (text)
- password (text)
- profile_picture (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

#### todos
- id (uuid, primary key)
- title (text)
- description (text)
- is_completed (boolean)
- priority (integer)
- deadline (timestamp with time zone)
- user_id (uuid, foreign key to users.id)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

### Running the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ name, email, phone, username, password, profile_picture }`
- **Response**: `{ message: 'User registered successfully' }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ username, password }`
- **Response**: `{ access_token, user: { id, username, name, email } }`

### Todo Operations

#### Get All Todos
- **GET** `/api/todos`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of todo objects

#### Get Single Todo
- **GET** `/api/todos/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Todo object

#### Create Todo
- **POST** `/api/todos`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ title, description, deadline, priority }`
- **Response**: `{ message: 'Todo created successfully', todo: {...} }`

#### Update Todo
- **PUT** `/api/todos/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ title, description, is_completed, priority, deadline }`
- **Response**: `{ message: 'Todo updated successfully' }`

#### Delete Todo
- **DELETE** `/api/todos/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ message: 'Todo deleted successfully' }`

### User Operations

#### Get User Profile
- **GET** `/api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ user: {...}, statistics: { totalTodos, completedTodos, efficiency } }`

#### Update User Profile
- **PUT** `/api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ name, email, phone, profile_picture }`
- **Response**: `{ message: 'Profile updated successfully' }`

#### Change Password
- **PUT** `/api/users/change-password`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ currentPassword, newPassword }`
- **Response**: `{ message: 'Password changed successfully' }` 