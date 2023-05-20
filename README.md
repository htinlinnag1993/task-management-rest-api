# task-management-rest-api
REST API endpoint service for task-management app prototype.

## Getting Started:
1. Clone this repo.
2. Run ```npm install```.
3. Create a ```.env``` file at the root of the project with these environment variables in it: 
  - ```NODE_APP_PORT```, and 
  - 2 sets of MySQL config values (one for dev and another for test). Replace ```${env type}``` with ```DEV```and ```TEST```
    - ```MYSQL_${env type}_USER```
    - ```MYSQL_${env type}_PASSWORD```
    - ```MYSQL_${env type}_DB_NAME```
    - ```MYSQL_${env type}_HOST```
    - ```MYSQL_${env type}_PORT```
3. Populate users and tasks in the local MySQL database manually. Refer to ```./init/seed.sql``` file for manual local testing through Postman in later step 6 & 7.
4. Go to https://travistidwell.com/jsencrypt/demo/ and generate a pair of RSA private key and public key using **2048 bit** key size. Save each of them into its own file(private.key and public.key) under ```./config/keys/```.
5. Run ```npm run dev``` to run the app locally.
6. Try making api calls to the user endpoint(authentication/authorization: sign up, sign in and sign out) through Postman for manual local testing. Refer to the Postman collection attached: ```Task_Management_API.postman_collection.json```.
7. Try making api calls to the task endpoint through Postman for manual local testing. Refer to the Postman collection attached: ```Task_Management_API.postman_collection.json```.
8. Run ```npm run test``` to run automated unit testing suite. 
9. Monitor the outputs on the terminal that is running this Express server app for logging info on the api requests and errors.

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


## Task Management REST API Endpoint Reference


## Authentication & Authorization:
- Currently using JWT in combination with user-created username and password. A good alternative would be using a 3rd party SSO/authenticator such Google, etc. to avoid handling authentication and let the 3rd party service handle that.
- Currently using authorization header with JWT and not storing JWT in any kind of session. The client can send the authorization JWT through authorization header. A better way would be using express-session and storing session on a datastore(preferrably key-value store such as Redis or MongoDB) on the server side.

## Logging
An unfinished logger is used for logging request in the terminal. The plan is to replace is it with NodeJS logging library such as **Winston**.

## Test Coverage
Currently, this rest api has a unit-test coverage on both success & fail cases for the following:
- [*] **See a task** as these roles: *a manager, a non-owner technician & the task owner technician*.
- [*] **Create a new task** as these roles: *a manager, a non-owner technician & the task owner technician*.
- [*] **Update an existing task** as these roles: *a manager, a non-owner technician & the task owner technician*.
- [*] **Perform a task** as these roles: *a manager, a non-owner technician & the task owner technician*.
- [*] **See all tasks** as these roles: *a manager & the task owner technician*.
- [*] **Delete a task** as these roles: *a manager, a non-owner technician & the task owner technician*.

## Next Steps:
### Part of the Problem Requirements:
- **Notification Feature**: 
  -  For notifying a manager in a non-blocking async manner when the task is performed by the technician.
  - This can be done in several different ways such as through web-sockets or using message-queue system such as RabbitMQ with pub/sub design.
- **Dockerizing**: 
  - Containerize the whole app with a couple of different services(MySQL, NodeJS server & MongoDB or Redis service) within the container.

### Extra for Scability, Readability, Maintability & Reusability of the Codebase & the System:
- **JWT Authentication, Session Persistance & Invalidation**: 
  - Adding a session key-value pair datastore such as MongoDB or Redis for this.
- **Database Seeding**: 
  - Seed the database using factory design pattern programmatically to seed the database for testing.
- **Set up Linting, typescript & Pre-Commit/Pre-Submit Hooks on PullRequests for CI/CD**: 
  - Set up eslinting for code-styling, set up typescript support for type-checking and pre-Commit/pre-Submit hooks on pull requests for CI/CD. This static analysis will help us achieve less bugs, less runtime errors and less system runtime. We will have a better smoother CI/CD workflow and achieve higher availability in our system.
- **Set Up Branch Protection Rules on Master Branch**: To protect master branch (and possibly future branches such as dev, pre-prod, etc.), set up rules & policies in place on GitHub for future collaboration.
- **Document our REST API using Swagger**: Document all of our endpoints and API using Swagger.

