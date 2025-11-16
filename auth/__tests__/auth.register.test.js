const request = require('supertest');
const app = require('../src/app');
const connectDB = require('../src/db/db');

describe('POST /auth/register', () => {
    beforeAll(async () => {
        await connectDB();
    })

    it('creates a user and return 201 with user (no password)', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: "Deepanshu_Choudhary",
                email: "test@test.com",
                password: "Test1234",
                fullName: {
                    firstName: "Deepanshu",
                    lastName: "Choudhary"
                },
            })
        
        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.username).toBe('Deepanshu_Choudhary');
        expect(res.body.user.email).toBe('test@test.com');
        expect(res.body.user.password).toBeUndefined();
    });

    it('rejects duplicate username/email with 409', async() => {
        const payload = {
            username: 'Deepanshu',
            email: 'deepanshu@test.com',
            password: "deepanshu1234",
            fullName: {
                firstName: "Deepanshu",
                lastName: "Nagar"
            }
        };

        await request(app).post('/api/auth/register').send(payload).expect(201);
        const res = (await request(app).post('/api/auth/register')).send(payload)

        expect(res.status).toBe(409)
    });

    it('validates missing fields with 400', async () => {
        const res = await request(app).post('/api/auth/register').send({});
        expect(res.status).toBe(400);
    });
});