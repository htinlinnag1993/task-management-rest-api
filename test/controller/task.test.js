const chai = require("chai");
const { describe, it } = require("mocha");
const request = require("supertest");

const {
    HTTP_SUCCESSES,
    ERROR_TYPES,
    HTTP_ERRORS,
} = require("../../utils/http_utils");
const { RESOURCE_TYPES } = require("../../utils/resource_utils");
const mockTasks = require("../../mockData/task_mock_data");
const mockUsers = require("../../mockData/user_mock_data");
const { server } = require("../../server");
const { getTasksListAsThisUser, getATaskAsThisUser } = require("./utils");

const { expect } = chai;
const { UPDATE_SUCCESS, PERFORM_SUCCESS, DELETE_SUCCESS } = HTTP_SUCCESSES;
const {
    NOT_AN_OWNER_OR_A_MANAGER,
    NOT_A_MANAGER,
    NOT_AN_OWNER,
    NOT_A_TECHNICIAN,
} = ERROR_TYPES;
const { UNAUTHORIZED } = HTTP_ERRORS;
const { TASK } = RESOURCE_TYPES;

/** Users */
const manager_loginInfo = {
    username: "persondoe",
    password: "password",
};
const technician_1_loginInfo = {
    username: "johndoe",
    password: "password",
};
const technician_2_loginInfo = {
    username: "janedoe",
    password: "password",
};

/** Tasks */
const expected_tasksList_asManager = getTasksListAsThisUser(mockTasks);
const expected_tasksList_asTechnician1 = getTasksListAsThisUser(
    mockTasks,
    mockUsers[0].user_id
);
const expected_task_asManagerOrTechnician = getATaskAsThisUser(mockTasks[0]);

const newTask = {
    name: "Test task",
    summary: "Test task",
};

const loginNGetJWTToken = async (loginInfo) => {
    const { body } = await request(server)
        .post("/api/auth/signin")
        .send({
            username: loginInfo.username,
            password: loginInfo.password,
        });
    expect(body).to.have.property("token");
    const token = body.token;
    return token;
};

describe("Get & Fetch task(s) endpoint test", async function() {
    this.timeout(20000);

    /** Fetch all tasks as a manager or a list of tasks as the task owner technician */
    it("Fetch tasks as a manager", async function() {
        const token = await loginNGetJWTToken(manager_loginInfo);
        const { body, status } = await request(server)
            .get("/api/tasks")
            .set("Authorization", "Bearer " + token);
        const { data } = body;
        expect(status).to.equal(200);
        expect(data.length).to.equal(expected_tasksList_asManager.length);
        expect(data).to.deep.include(expected_tasksList_asManager[0]);
        expect(data).to.deep.include(expected_tasksList_asManager[1]);
        expect(data).to.deep.include(expected_tasksList_asManager[2]);
    });

    it("Fetch tasks as a technician", async function() {
        const token = await loginNGetJWTToken(technician_1_loginInfo);
        const { body, status } = await request(server)
            .get("/api/tasks")
            .set("Authorization", "Bearer " + token);
        const { data } = body;
        expect(status).to.equal(200);
        expect(data.length).to.equal(expected_tasksList_asTechnician1.length);
        expect(data).to.deep.include(expected_tasksList_asTechnician1[0]);
        expect(data).to.deep.include(expected_tasksList_asTechnician1[1]);
    });

    /** See a task as a manager or the task owner technician or a non-owner technician */
    it("See a task as a manager", async function() {
        const token = await loginNGetJWTToken(manager_loginInfo);
        const { body, status } = await request(server)
            .get(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token);
        const { data } = body;
        expect(status).to.equal(200);
        expect(data).to.deep.equal(expected_task_asManagerOrTechnician);
    });

    it("See a task as the task owner technician", async function() {
        const token = await loginNGetJWTToken(technician_1_loginInfo);
        const { body, status } = await request(server)
            .get(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token);
        const { data } = body;
        expect(status).to.equal(200);
        expect(data).to.deep.equal(expected_task_asManagerOrTechnician);
    });

    it("See a task as a non-owner technician", async function() {
        const token = await loginNGetJWTToken(technician_2_loginInfo);
        const { body, status } = await request(server)
            .get(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token);
        expect(status).to.equal(UNAUTHORIZED.statusCode);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(
            UNAUTHORIZED.getMessage(
                TASK,
                expected_task_asManagerOrTechnician.taskId,
                NOT_AN_OWNER_OR_A_MANAGER
            ).message
        );
    });

    /** Update a task as a manager or the task owner technician or a non-owner technician */
    it("Update a task as a manager", async function() {
        const token = await loginNGetJWTToken(manager_loginInfo);
        const { body, status } = await request(server)
            .put(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token)
            .set("body", { status: "new" });
        expect(status).to.equal(UNAUTHORIZED.statusCode);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(
            UNAUTHORIZED.getMessage(
                TASK,
                expected_task_asManagerOrTechnician.taskId,
                NOT_A_TECHNICIAN
            ).message
        );
    });

    it("Update a task as the task owner technician", async function() {
        const token = await loginNGetJWTToken(technician_1_loginInfo);
        const { body, status } = await request(server)
            .put(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token)
            .set("body", { status: "new" });
        expect(status).to.equal(200);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(UPDATE_SUCCESS.getMessage(TASK).message);
    });

    it("Update a task as a non-owner technician", async function() {
        const token = await loginNGetJWTToken(technician_2_loginInfo);
        const { body, status } = await request(server)
            .put(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token)
            .set("body", { status: "new" });
        expect(status).to.equal(UNAUTHORIZED.statusCode);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(
            UNAUTHORIZED.getMessage(
                TASK,
                expected_task_asManagerOrTechnician.taskId,
                NOT_AN_OWNER
            ).message
        );
    });

    /** Perform a task as a manager or the task owner technician or a non-owner technician */
    it("Perform a task as a manager", async function() {
        const token = await loginNGetJWTToken(manager_loginInfo);
        const { body, status } = await request(server)
            .put(
                `/api/tasks/perform/${expected_task_asManagerOrTechnician.taskId}`
            )
            .set("Authorization", "Bearer " + token);
        expect(status).to.equal(UNAUTHORIZED.statusCode);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(
            UNAUTHORIZED.getMessage(
                TASK,
                expected_task_asManagerOrTechnician.taskId,
                NOT_A_TECHNICIAN
            ).message
        );
    });

    it("Perform a task as the task owner technician", async function() {
        const token = await loginNGetJWTToken(technician_1_loginInfo);
        const { body, status } = await request(server)
            .put(
                `/api/tasks/perform/${expected_task_asManagerOrTechnician.taskId}`
            )
            .set("Authorization", "Bearer " + token);
        expect(status).to.equal(200);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(PERFORM_SUCCESS.getMessage(TASK).message);
    });

    it("Perform a task as a non-owner technician", async function() {
        const token = await loginNGetJWTToken(technician_2_loginInfo);
        const { body, status } = await request(server)
            .put(
                `/api/tasks/perform/${expected_task_asManagerOrTechnician.taskId}`
            )
            .set("Authorization", "Bearer " + token);
        expect(status).to.equal(UNAUTHORIZED.statusCode);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(
            UNAUTHORIZED.getMessage(
                TASK,
                expected_task_asManagerOrTechnician.taskId,
                NOT_AN_OWNER
            ).message
        );
    });

    /** Create a task as a manager or a technician */
    it("Create a new task as a manager", async function() {
        const token = await loginNGetJWTToken(manager_loginInfo);
        const { body, status } = await request(server)
            .post("/api/tasks")
            .set("Authorization", "Bearer " + token)
            .send(newTask);
        expect(status).to.equal(UNAUTHORIZED.statusCode);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(
            UNAUTHORIZED.getMessage(
                TASK,
                expected_task_asManagerOrTechnician.taskId,
                NOT_A_TECHNICIAN
            ).message
        );
    });

    it("Create a new task as a technician", async function() {
        const token = await loginNGetJWTToken(technician_1_loginInfo);
        const { body, status } = await request(server)
            .post("/api/tasks")
            .set("Authorization", "Bearer " + token)
            .send(newTask);
        const { data } = body;
        expect(status).to.equal(200);
        expect(data.name).to.equal(newTask.name);
        expect(data.summary).to.equal(newTask.summary);
    });

    /** Delete a task as a manager or the task owner technician or a non-owner technician */
    it("Delete a task as a manager", async function() {
        const token = await loginNGetJWTToken(manager_loginInfo);
        const { body, status } = await request(server)
            .delete(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token);
        expect(status).to.equal(200);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(DELETE_SUCCESS.getMessage(TASK).message);
    });

    it("Delete a task as a techinician", async function() {
        const token = await loginNGetJWTToken(technician_1_loginInfo);
        const { body, status } = await request(server)
            .delete(`/api/tasks/${expected_task_asManagerOrTechnician.taskId}`)
            .set("Authorization", "Bearer " + token);
        expect(status).to.equal(UNAUTHORIZED.statusCode);
        expect(body).to.have.property("message");
        expect(body.message).to.equal(
            UNAUTHORIZED.getMessage(
                TASK,
                expected_task_asManagerOrTechnician.taskId,
                NOT_A_MANAGER
            ).message
        );
    });
});
