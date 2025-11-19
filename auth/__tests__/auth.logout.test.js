const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const connectDB = require('../src/db/db');
const userModel = require('../src/models/user.model');

describe('GET /api/auth/logout', () => {
    beforeAll(async () => {
        await connectDB();
    })

    it('clear the auth cookies and return 200 when logged in', async () => {

        // Send and login to get cookie
        const password = 'Secret123!';
        const hash = await bcrypt.hash(password, 10);
        await userModel.create({
            username: 'logout_user',
            email: 'logout@test.com',
            password: hash,
            fullName: {
                firstName: 'Log',
                lastName: 'Out'
            }
        })

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'logout@test.com',
                password
            });

        expect(loginRes.status).toBe(200);
        const cookies = loginRes.headers[ 'set-cookie' ];
        expect(cookies).toBeDefined();

        const res = await request(app)
            .get('/api/auth/logout')
            .set('Cookie', cookies)

        expect(res.status).toBe(200);
        const setCookie = res.headers[ 'set-cookie' ] || [];
        const cookieStr = setCookie.join(';');

        expect(cookieStr).toMatch(/token=;/);
        expect(cookieStr.toLowerCase()).toMatch(/expires=/);
    });

    it('is idempotent: return 200 even without auth cookie', async () => {
        const res = await request(app).get('/api/auth/logout');
        
        expect(res.status).toBe(200);
    })
})