# Zoho Like

## Overview

This project is a web app designed for both admins and users to manage tasks, employees, and reports. It features a sign-up and login system, password management, and various admin functionalities like managing employee data, viewing reports, and handling tasks.

## Features

### User Authentication
- **Sign In/Sign Up**: Users and admins can sign in and sign up. Admins are authenticated using JWT (JSON Web Tokens). The passwords are saved in the database after hashing.
- **Welcome Email**: Users receive a welcome email after signing up.
- **Password Management**: Users can change their password via the settings menu once logged in.

### Admin Features
1. **Customer Relationship Module**: 
   - Admins can onboard employees by uploading a CSV file.
   - After uploading, a table displays employee data, and emails with a welcome message and login credentials are sent to each employee.
   - Admins can edit, delete, search, and filter employee data in the table (using contains, equals, greater than, and less than conditions).
   
2. **Reports and Analytics**: 
   - This section includes pie and bar charts that display data based on departments.
   - Admins can view both charts, while regular users can't access this section of the sidebar.

3. **Tasks Management**: 
   - Both admins and users can create, edit, delete, and view tasks.
   - Tasks are displayed in a table, where users can change the status (Not Started, Pending, In Progress, Completed).
   - The status update is reflected in the database.
   - Admins and users can assign tasks to other users.

### User Features
- **Task Management**: Users can also create, edit, and delete tasks. Tasks can be marked with a status, and the status will update in the database as well.
- **Sidebar**: Regular users only see the "Task Management" tab, while admins can access all sections in the sidebar.

### General Features
- **Error Handling**: Proper error handling is implemented for a good user experience.
- **Performance Optimization**: Techniques like lazy loading are used to improve app performance.
- **Scalability**: The code is structured to be easily scalable for future features.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Material UI, Redux, and Context API
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)

### Installation

1. Clone the repository:
   ```bash
   `git clone https://github.com/pragya-celestial-systems/Zoho-Clone.git`

2. Go inside server and client repositories and run:
   ```bash
   npm i

3. Run the start command:
- If current directory is the root directory - 
   ```bash
   npm run server:start npm run client:start

- If current directory is server or client - 
  - Run this command for server:
  ```bash
   npm run server:start

 - Run this command for client:
  ```bash
   npm run client:start

   
