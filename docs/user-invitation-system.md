# User Invitation System Documentation

## Overview

The User Invitation System allows administrators to invite students, teachers, and other admins to join the platform. The system generates temporary passwords for invited users, which they can use to log in for the first time before setting up their permanent passwords.

## User Flow

1. **Admin Invites User**:

   - Admin sends an invitation with user details (email, name, roles)
   - For students, additional information is required (department, semester, course)
   - System generates a temporary password

2. **User Receives Invitation**:

   - User receives invitation with temporary password (via admin or email)

3. **User First Login**:

   - User logs in with their email and temporary password
   - System recognizes user as having INVITED status
   - Frontend should detect this status and redirect to account setup

4. **Account Setup**:
   - User sets a permanent password
   - User status changes from INVITED to USER
   - User can now access the system with full privileges based on their role

## API Endpoints

### Admin Endpoints

#### Invite User

- **URL**: `/api/v1/users/invite`
- **Method**: POST
- **Auth Required**: Yes (ADMIN or SUPER_ADMIN)
- **Request Body**:
  ```json
  {
    "data": {
      "email": "user@example.com",
      "name": "User Name",
      "roles": ["STUDENT", "TEACHER", "ADMIN"],
      "departmentId": "uuid", // Required for STUDENT
      "semesterId": "uuid", // Required for STUDENT
      "courseId": "uuid" // Required for STUDENT
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User invitation sent successfully! Temporary password generated.",
    "data": {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "User Name",
      "roles": ["STUDENT"],
      "status": "INVITED",
      "tempPassword": "a1b2c3d4" // Temporary password to share with user
    }
  }
  ```

#### List Invited Users

- **URL**: `/api/v1/users/invite/all`
- **Method**: GET
- **Auth Required**: Yes (ADMIN or SUPER_ADMIN)
- **Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Invited users retrieved successfully!",
    "data": [
      {
        "id": "user-uuid",
        "email": "user@example.com",
        "name": "User Name",
        "roles": ["STUDENT"],
        "status": "INVITED",
        "studentInfo": {
          "departmentId": "dept-uuid",
          "department": { "name": "Computer Science" },
          "semesterId": "sem-uuid",
          "semester": { "name": "Fall 2023" },
          "courseId": "course-uuid",
          "course": { "name": "Database Systems" }
        }
      }
    ]
  }
  ```

### User Endpoints

#### Login

- **URL**: `/api/v1/auth/login`
- **Method**: POST
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "temporary-or-permanent-password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "User logged in successfully!",
    "data": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token",
      "user": {
        "id": "user-uuid",
        "name": "User Name",
        "email": "user@example.com",
        "roles": ["STUDENT"],
        "status": "INVITED", // Frontend should check this to redirect to setup
        "isActive": true
      }
    }
  }
  ```

#### Setup Invited User Account

- **URL**: `/api/v1/auth/invited/setup`
- **Method**: POST
- **Auth Required**: Yes (JWT from temporary password login)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "new-permanent-password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Account setup completed successfully! You may now log in."
  }
  ```

## Implementation Notes

### User Status

- **INVITED**: Initial status after admin creates invitation
- **USER**: Status after user completes account setup

### Security Considerations

- Temporary passwords are generated securely using crypto.randomBytes
- Passwords are always hashed before storage
- Only admins can view the temporary password in the invitation response
- The system validates that only invited users can use the setup endpoint

### Frontend Requirements

1. Admin dashboard to send invitations
2. Special handling for invited users' first login
3. Password setup form for invited users
4. Redirect flows based on user status
