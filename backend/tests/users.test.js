const request = require("supertest");
const { 
    app, 
    router: { repositories } 
} = require("../src/app");
const { 
    userSeeds,
    seedUserData,
    clearUserData
} = require("./fixtures/seedDatabase");


beforeAll(async () => {
    await clearUserData();
});

afterAll(async () => {
    await clearUserData();
});

describe('Testing User\'s API Endpoints', () => {
    beforeEach(async () => {
        await clearUserData();
        await seedUserData();
    });

    test("POST /api/users --> Should sign up a new user", async () => {
        const newUser = {
            name: "Mercury",
            email: "mercury@spacefintech.com",
            password: "123456789",
            age: 24
        };
    
        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect('Content-Type', /json/)
            .expect(201);
        
        // Assert that the database was changed correctly
        const createdUser = await repositories.users.getById(response.body.createdUser._id);
        expect(createdUser).not.toBeNull();
    
        // Assert response was returned as expected
        const { password, ...rest } = newUser;
        expect(response.body).toMatchObject({
            createdUser: rest,
            token: createdUser.tokens[0].token
        });
    
        // Assert password was hash
        expect(createdUser.password).not.toBe(newUser.password);
    });
    
    test("POST /api/users/login --> Should login exising user", async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: userSeeds[0].email,
                password: userSeeds[0].password
            })
            .expect('Content-Type', /json/)
            .expect(200);
    
        const user = await repositories.users.getById(userSeeds[0]._id);

        expect(response.body.token).toBe(user.tokens[1].token);
    });
    
    test("GET /api/users/me --> Should get profile for user", async () => {
        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${userSeeds[0].tokens[0].token}`)
            .send()
            .expect(200);
        
        expect(response.body).not.toBeNull();
    
        expect(response.body.email).toBe(userSeeds[0].email);
    });
    
    test("DELETE /api/users/me --> Should delete account for user", async () => {
        await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${userSeeds[0].tokens[0].token}`)
            .send()
            .expect(200);
    
        const deletedUser = await repositories.users.getById(userSeeds[0]._id);

        expect(deletedUser).toBeNull();
    });

    test('POST /api/users/me/avatar --> Should upload avatar image', async () => {
        await request(app)
            .post('/api/users/me/avatar')
            .set('Authorization', `Bearer ${userSeeds[0].tokens[0].token}`)
            .attach('file', 'tests/fixtures/pikachu.jpeg')
            .expect(200);

        const user = await repositories.users.getById(userSeeds[0]._id);

        expect(user.avatar).toEqual(expect.any(Buffer));
    });

    test('PATCH /api/users/me --> Should update valid user field', async () => {
        const updateField = {
            name: "Jupiter"
        };

        await request(app)
            .patch('/api/users/me')
            .set('Authorization', `Bearer ${userSeeds[0].tokens[0].token}`)
            .send(updateField)
            .expect(200);
        
        const updatedUser = await repositories.users.getById(userSeeds[0]._id);

        expect(updatedUser.name).toBe(updateField.name);
    });

    test('PATCH /api/users/me --> Should ignore invalid user field', async () => {
        const updateField = {
            firstname: "Jupiter"
        };

        await request(app)
            .patch('/api/users/me')
            .set('Authorization', `Bearer ${userSeeds[0].tokens[0].token}`)
            .send(updateField)
            .expect(200);
        
        const updatedUser = await repositories.users.getById(userSeeds[0]._id);

        expect(updatedUser.firstname).toBe(undefined);
    });
});