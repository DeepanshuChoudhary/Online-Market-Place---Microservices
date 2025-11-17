const request = require('supertest');
const app = require('../src/app');
const connectDB = require('../src/db/db');

describe('POST /api/auth/register', () => {
    beforeAll(async () => {
        // await connectDB();
    })

    it('creates a user and return 201 with user (no password)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: "Deepanshu_Choudhary",
                email: "jestTest@test.com",
                password: "Test1234",
                fullName: {
                    firstName: "Deepanshu",
                    lastName: "Choudhary"
                },
            })
        
        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.username).toBe('Deepanshu_Choudhary');
        expect(res.body.user.email).toBe('jestTest@test.com');
        expect(res.body.user.password).toBeUndefined();
    });

    it('rejects duplicate username/email with 409', async() => {
        const payload = {
            username: 'Deepanshu',
            email: 'jestAgainTest@test.com',
            password: "deepanshu1234",
            fullName: {
                firstName: "Deepanshu",
                lastName: "Nagar"
            }
        };

        await request(app).post('/api/auth/register').send(payload).expect(201);
        const res = await request(app).post('/api/auth/register').send(payload)

        expect(res.status).toBe(409)
    });

    it('validates missing fields with 400', async () => {
        const res = await request(app).post('/api/auth/register').send({});
        expect(res.status).toBe(400);
    });
});

describe('POST /api/auth/login', () => {
    beforeAll(async () => {
        await connectDB()
    })

    it('Logs in with correct credentials and return 200 with user and sets cookie', async () => {
        const password = 'Secret123!';
        const hash = await bcrypt.hash(password, 10);
        await userModel.create({
            username: "Deepanshu_Choudhary",
            email: "jestTest@test.com",
            password: hash,
            fullName: { firstName: "Deepanshu", lastName: 'Choudhary' },
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: "jestTest@test.com", password });
        
        expect(res.status).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe('jestTest@test.com');

        const setCookie = res.headers[ 'set-cookie' ];
        expect(setCookie).toBeDefined();
        expect(setCookie.join(';')).toMatch(/token=/);
    });

    it('Reject wrong password with 401', async() => {
        const password = 'Secret123!';
        const hash = await bcrypt.hash(password, 10);
        await userModel.create({
            username:'Deepanshu_Nagar',
            email: 'jestAgainTest@test.com',
            password: hash,
            fullName: { firstName: 'Deepanshu', lastName: 'Nagar' },
        });

        it('Validates missing field with 400', async() => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        })
    })

})