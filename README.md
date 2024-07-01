# Overview
Mini Trello is a task management application designed to organize tasks across different workspaces. Admins can create and manage these workspaces, each containing multiple boards where tasks are tracked. The project utilizes GraphQL for API operations, Mongoose for database management, and WebSockets for real-time notifications.

## Features
- **Workspace**: Admins can create and manage multiple workspaces.
- **Task Boards**: Each workspace contains boards where tasks can be organized.
- **Real-time Notifications**: Users receive instant notifications when tasks are updated.
- **GraphQL API**: Efficiently manage data with GraphQL mutations and resolvers.
- **MongoDB**: Mongoose is used to handle data storage and retrieval.

## Technologies
- **GraphQl**: For querying and manipulating data.
- **Mongoose**: An elegant MongoDB object modeling tool.
- **WebSockets**: For real-time updates and notifications.

## Usage
- **Create a Workspace**: As an admin, create a new workspace.
- **Add Boards**: Within the workspace, create boards to organize tasks.
- **Manage Tasks**: Add, update, and delete tasks as needed.
- **Receive Notifications**: Stay updated with real-time notifications when changes occur.

## Use case diagram
![image](https://github.com/Abdelrahmanradwann/Trello-API-using-graphql/assets/133225811/5c774adf-f8fa-46cf-9bf8-a052ad6af44b)

## Database schema
- **Indexed field**  ![image](https://github.com/Abdelrahmanradwann/Trello-API-using-graphql/assets/133225811/abcb2309-4656-4f25-a5ad-c7924f2ef9a3)
- **Unique field**  ![image](https://github.com/Abdelrahmanradwann/Trello-API-using-graphql/assets/133225811/5a947184-4122-4316-9582-b237731fabec)
- **Required field**  ![image](https://github.com/Abdelrahmanradwann/Trello-API-using-graphql/assets/133225811/c036f235-58af-4ff8-94d1-fffc2c54bab4)

![image](https://github.com/Abdelrahmanradwann/Trello-API-using-graphql/assets/133225811/bc269d48-009e-4cf7-a633-55622d8c7a46)


