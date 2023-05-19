# task-management-rest-api

## Getting Started:
1. Clone this repo.
2. Run npm install.
3. Run npm run dev to run the app locally.
4. Populate users and tasks in the local MySQL database. Refer to ./init/seed.sql file.
5. Try making api calls to the REST api endpoint for users(authentication and authrization - sign up, sign in and sign out) through POSTMAN for manual testing.
6. Try making api calls to the REST api endpoint for tasks through POSTMAN for manual testing.
7. Run npm run test for automated unit testing.
8. Monitor the outputs on the terminal that is running this Express server app for logging info on the api requests and errors.


## Main Features:
- Letting the technician:
  - [x] performs tasks,
  - [x] see, create or update his/her own performed tasks.

- Letting the manager:
  - [x] see tasks from al technicians,
  - [x] delete them, and
  - [ ] should be notified when some tech performs a task.

- A task has:
  - [x] a summary 
    - [x] (max 2,500 characters) 
    - [ ] can contain PI(personal information), and
  - [x] a date when it was performed.

### Features:
- [x] Create an API endpoint to save a new task.
- [x] Create an API endpoint to list tasks.
- [ ] Notify manager of each task performed by the tech (can be just a print saying “The tech X performed the task Y on date Z”). This notification should not block any http request.

## Tech Requirements:
- [x] Use either Go or Node to develop this HTTP API.
- [ ] Create a local development environment using docker containing this service & a MySQL database.
- [x] Use MySQL database to persist data from the application.
- [x] Features should have unit tests to ensure they are working properly.

## Bonus:
- [ ] Use a message broker to decouple notification logic from the application flow.
- [ ] Create Kubernetes object files needed to deploy this application.




## Authentication & Authorization:
- Currently using JWT in combination with user-created username and password. A good alternative would be using a 3rd party SSO/authenticator such Google, etc. to avoid handling authentication and let the 3rd party service handle that.
- Currently using authorization header and/or cookie-session, and storing session on the client side. The client can send the authorization JWT through session or authorization header. A better way would be using express-session and storing session on a datastore(preferrably key-value store such as Redis or MongoDB) on the server side.

## Logging

## Testing

## Database Seeding
