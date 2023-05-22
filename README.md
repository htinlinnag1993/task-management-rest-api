# task-management-rest-api

REST API endpoint service for task-management app prototype.

## Getting Started:

1. Clone this repo.
2. Run `npm install`.
3. Create a `.env` file at the root of the project with these environment variables in it:

-   `NODE_APP_PORT`, and
-   2 sets of MySQL config values (one for dev and another for test). Replace `${env type}` with `DEV`and `TEST`
    -   `MYSQL_${env type}_USER`
    -   `MYSQL_${env type}_PASSWORD`
    -   `MYSQL_${env type}_DB_NAME`
    -   `MYSQL_${env type}_HOST`
    -   `MYSQL_${env type}_PORT`

3. Populate users and tasks in the local MySQL database manually. Refer to `./init/seed.sql` file for manual local testing through Postman in later step 6 & 7.
4. Go to https://travistidwell.com/jsencrypt/demo/ and generate a pair of RSA private key and public key using **2048 bit** key size. Save each of them into its own file(private.key and public.key) under `./config/keys/`.
5. Run either `npm run dev` run the app locally.
6. Try making api calls to the user endpoint(authentication/authorization: sign up, sign in and sign out) through Postman for manual local testing. Refer to the Postman collection attached: `Task_Management_API.postman_collection.json`.
7. Try making api calls to the task endpoint through Postman for manual local testing. Refer to the Postman collection attached: `Task_Management_API.postman_collection.json`.
8. Run `npm run test` to run automated unit testing suite.
9. Monitor the logs & outputs in either `app.log` or `main.log` & `error.log` in the project directory while our express app is running for info on the api requests, records, errors and responses.

## Main Features:

-   Letting the technician:

    -   [x] performs tasks,
    -   [x] see, create or update his/her own performed tasks.

-   Letting the manager:

    -   [x] see tasks from al technicians,
    -   [x] delete them, and
    -   [ ] should be notified when some tech performs a task.

-   A task has:
    -   [x] a summary
        -   [x] (max 2,500 characters)
        -   [ ] can contain PI(personal information), and
    -   [x] a date when it was performed.

### Features:

-   [x] Create an API endpoint to save a new task.
-   [x] Create an API endpoint to list tasks.
-   [ ] Notify manager of each task performed by the tech (can be just a print saying “The tech X performed the task Y on date Z”). This notification should not block any http request.

## Tech Requirements:

-   [x] Use either Go or Node to develop this HTTP API.
-   [ ] Create a local development environment using docker containing this service & a MySQL database.
-   [x] Use MySQL database to persist data from the application.
-   [x] Features should have unit tests to ensure they are working properly.

## Bonus:

-   [ ] Use a message broker to decouple notification logic from the application flow.
-   [ ] Create Kubernetes object files needed to deploy this application.

## Task Management REST API Endpoint Reference

## Authentication & Authorization:

-   Currently using JWT in combination with user-created username and password. A good alternative would be using a 3rd party SSO/authenticator such Google, etc. to avoid maintaining authentication service and let the 3rd party service handle that.
-   We are currently storing user sessions (JWT as a key & user id as the value) in our non-persistent in-memory key-value datastore (an object in `./dataStores/userSessionsWithJwt.js`). The client can send the authorization JWT through authorization header in the subsequent requests (after the initial login request), and we are validating/verifying the user session through a lookup in that in-memory datastore. A better way would be using express-session and storing session on a persistent datastore(preferrably key-value store such as Redis or MongoDB).

## Logging

**Winston** logging library is used to log info on all http requests, responses and errors. Currently, all the logs are written to a local `./logs/combined.log` file. It can also be reconfigured to save the logs into a remote store later on. Logging strategically enables us debug easier, monitor our system/api/app and create alerts for the team when needed. Setting up tools such as Logtail to manage our logs and aggregate insights to draw insights out would be the next step.

## Test Coverage

Currently, this rest api has a unit-test coverage on both success & fail cases for the following:

-   [x] **See a task** as these roles: _a manager, a non-owner technician & the task owner technician_.
-   [x] **Create a new task** as these roles: _a manager, a non-owner technician & the task owner technician_.
-   [x] **Update an existing task** as these roles: _a manager, a non-owner technician & the task owner technician_.
-   [x] **Perform a task** as these roles: _a manager, a non-owner technician & the task owner technician_.
-   [x] **See all tasks** as these roles: _a manager & the task owner technician_.
-   [x] **Delete a task** as these roles: _a manager, a non-owner technician & the task owner technician_.

## Next Steps:

### Part of the Problem Requirements:

-   **Notification Feature**:
    -   For notifying a manager in a non-blocking async manner when the task is performed by the technician.
    -   This can be done in several different ways such as through web-sockets or using message-queue system such as RabbitMQ with pub/sub design.
-   **Dockerizing**:
    -   Containerize the whole app with a couple of different services(MySQL, NodeJS server & MongoDB or Redis service) within the container.

### Extra for Scability, Readability, Maintability & Reusability of the Codebase & the System:

-   **Add Global Error Handler & Catcher**: Refactor controllers logic a bit to extract several business logics (for task) out to their own middlewares, and then add a global error handler/catcher for any unexpected uncaught errors in our http server during runtime.
-   **Add Validation on the Request**: Add data validation on the incoming requests before processing the request using validator library such as **Joi**.
-   **JWT Authentication, Session Persistance & Invalidation**:
    -   Adding a session key-value pair datastore such as **MongoDB** or **Redis** for this.
-   **Database Seeding**:
    -   Seed the database using **factory design pattern programmatically** to seed the database for testing.
-   **Set up typescript & Pre-Commit/Pre-Submit Hooks on PullRequests for CI/CD**:
    -   Set up set up typescript support for type-checking and pre-Commit/pre-Submit hooks on pull requests for CI/CD. This static analysis will help us achieve less bugs, less runtime errors and less system runtime. We will have a better smoother CI/CD workflow and achieve higher availability in our system.
-   **Set Up Branch Protection Rules on Master Branch**: To protect master branch (and possibly future branches such as dev, pre-prod, etc.), set up rules & policies in place on GitHub for future collaboration.
-   **Document our REST API using Swagger**: Document all of our endpoints and API using **Swagger**.
-   **Log Aggregation Setup**: Logs are being saved to a local file now. It is better to centralize all logs to one remote place such as in the cloud. Setting up tools such as Logtail to manage our stored logs and aggregate insights to draw insights out would be the next step.
