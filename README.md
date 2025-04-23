# To-Do List API

A minimal backend for a To-Do List application built using Node.js and MongoDB. This API supports user authentication, task creation, updates, deletion, and categorization. Users can also filter and search tasks based on status, category, or due date.

## Features

- **User Registration and Login**: Users can register, log in, and receive JWT tokens for authentication.
- **Task Management**: Create, update, delete, and view tasks.
- **Task Categorization**: Assign tasks to categories like "Work", "Personal", "Shopping", etc.
- **Task Status Management**: Mark tasks as completed or pending.
- **Search & Filtering**: Search tasks by title or description, filter by status, category, or due date.
- **Authentication**: All protected routes require a valid JWT token.

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user.
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```

- **POST /api/auth/login**: Log in and receive a JWT token.
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```

### Task Management

- **POST /api/tasks**: Create a new task.
  - Body:
    ```json
    {
      "title": "Task title",
      "description": "Task description",
      "dueDate": "2025-05-01",
      "category": "Shopping"
    }
    ```

- **GET /api/tasks**: Get all tasks. Can be filtered by `status`, `category`, or `dueDate`.
  - Example:
    `GET /api/tasks?status=pending&category=Shopping`

- **GET /api/tasks/:taskId**: View task details by `taskId`.

- **PUT /api/tasks/:taskId**: Update a task by `taskId`.
  - Body:
    ```json
    {
      "description": "Updated task description"
    }
    ```

- **DELETE /api/tasks/:taskId**: Delete a task by `taskId`.

- **POST /api/tasks/:taskId/markCompleted**: Mark a task as completed.

- **POST /api/tasks/:taskId/markPending**: Mark a task as pending.

- **GET /api/tasks/category/:category**: View tasks filtered by category.

- **GET /api/tasks/search**: Search tasks by title or description.
  - Example:
    `GET /api/tasks/search?q=shopping`

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB running locally or using a cloud provider like MongoDB Atlas.

Here’s the section formatted for direct use in your README file:

```markdown
### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-backend-api.git
   cd todo-backend-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root of the project.
   - Add the following:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/todoApp
     JWT_SECRET=your_jwt_secret_key
     ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.
```
