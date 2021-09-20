const { response } = require("express");
const request = require("supertest");
const {
    app,
    router: { repositories }
} = require("../src/app");
const { 
    userSeeds,
    taskSeeds,
    seedUserData,
    seedTaskData,
    clearUserData,
    clearTaskData
} = require("./fixtures/seedDatabase");


beforeAll(async () => {
    await clearUserData();
    await clearTaskData();
});

afterAll(async () => {
    await clearUserData();
    await clearTaskData();
});

describe('Testing Task\'s API Endpoints', () => {
    beforeAll(async () => {
        await seedUserData();
    });

    beforeEach(async () => {
        await clearTaskData();
        await seedTaskData();
    });

    test('POST /api/tasks --> Should create tasks for authenticated user', async () => {
        const newTask = {
            name: "New Task",
            description: "New Task"
        }

        const response = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${userSeeds[0].tokens[0].token}`)
            .send(newTask)
            .expect(201);

        const createdTask = await repositories.tasks.getById(response.body._id);

        expect(createdTask).not.toBeNull();
        expect(createdTask.completed).toBe(false);
    });

    test('GET /api/tasks --> Should return all tasks created by user1', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${userSeeds[0].tokens[0].token}`)
            .send()
            .expect(200);

        expect(response.body.length).toBe(2);
    });

    test('DELETE /api/tasks/:id --> Should not delete task from another user', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${taskSeeds[0]._id}`)
            .set('Authorization', `Bearer ${userSeeds[1].tokens[0].token}`)
            .expect(200);

        expect(response.body).toBeNull();

        const task = await repositories.tasks.getById(taskSeeds[0]._id);
        
        expect(task).not.toBeNull();
    })
});