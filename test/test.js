const supertest = require("supertest");
const {server} = require("../src/server");

const requestWithSupertest = supertest(server);

describe('Task Endpoints', () => {
  it('GET /tasks show all tasks', async () => {
    const res = await requestWithSupertest.get('/api/tasks');
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
  });
});
