// tests/orders/createOrder.test.js
const request = require('supertest');
const app = require('../../src/app');
const { getAuthCookie } = require('../setup/auth');

// >>> CHANGED: mock axios so tests don't call real services
jest.mock('axios');
const axios = require('axios');

// >>> CHANGED: require the order model so we can spy/mock `create`
const orderModel = require('../../src/models/order.model');

describe('POST /api/orders — Create order from current cart', () => {
    const sampleAddress = {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'CA',
        pincode: '90210',
        country: 'USA',
    };  

    beforeEach(() => {
        // >>> CHANGED: reset axios mocks and restore any mocked model functions
        axios.get.mockReset();
        // Restore original implementation if previously spied/mocked
        if (orderModel.create && orderModel.create.mockRestore) {
            orderModel.create.mockRestore();
        }
    });

    it('creates order from current cart, computes totals, sets status=PENDING, reserves inventory', async () => {
        // >>> CHANGED: Provide axios mock implementations for cart & product endpoints
        axios.get.mockImplementation((url) => {
            // Mock call to cart service
            if (url.includes('/api/cart')) {
                return Promise.resolve({
                    data: {
                        cart: {
                            items: [
                                // item ids must match what controller expects
                                { productId: 'prod1', quantity: 2 }
                            ]
                        }
                    }
                });
            }

            // Mock call to product service for prod1
            if (url.includes('/api/products/prod1')) {
                return Promise.resolve({
                    data: {
                        data: {
                            _id: 'prod1',                       // must match item.productId
                            title: 'Sample Product',            // controller may use title/name
                            price: { amount: 100, currency: 'INR' },
                            // numeric stock field used in controller check
                            stock: 10,
                            inStock: 10
                        }
                    }
                });
            }

            // If any other URL is requested, fail fast so you can see unexpected calls
            return Promise.reject(new Error('Unexpected axios.get call in test: ' + url));
        });

        // >>> CHANGED: Mock orderModel.create so tests don't need a real DB.
        // Build a fake "saved" order that matches controller expectations.
        const fakeSavedOrder = {
            _id: 'order1',
            user: 'user1',
            status: 'PENDING',
            items: [
                {
                    product: 'prod1',
                    quantity: 2,
                    price: { amount: 200, currency: 'INR' } // 100 * 2
                }
            ],
            totalPrice: { amount: 200, currency: 'INR' },
            shippingAddress: {
                street: sampleAddress.street,
                city: sampleAddress.city,
                state: sampleAddress.state,
                zip: sampleAddress.pincode,
                country: sampleAddress.country,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Spy/mock create to return the fake saved order
        jest.spyOn(orderModel, 'create').mockResolvedValue(fakeSavedOrder);

        // Now call the API. Because both axios and orderModel.create are mocked,
        // the controller should complete successfully and return 201.
        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', getAuthCookie())
            .send({ shippingAddress: sampleAddress })
            .expect('Content-Type', /json/)
            .expect(201); // assert created

        // Response shape assertions (adjust fields as you implement)
        expect(res.body).toBeDefined();
        expect(res.body.order).toBeDefined();
        const { order } = res.body;
        expect(order._id).toBeDefined();
        expect(order.user).toBeDefined();
        expect(order.status).toBe('PENDING');

        // Items copied from priced cart
        expect(Array.isArray(order.items)).toBe(true);
        expect(order.items.length).toBeGreaterThan(0);
        for (const it of order.items) {
            expect(it.product).toBeDefined();
            expect(it.quantity).toBeGreaterThan(0);
            expect(it.price).toBeDefined();
            expect(typeof it.price.amount).toBe('number');
            expect([ 'USD', 'INR' ]).toContain(it.price.currency);
        }

        // Totals include taxes + shipping
        expect(order.totalPrice).toBeDefined();
        expect(typeof order.totalPrice.amount).toBe('number');
        expect([ 'USD', 'INR' ]).toContain(order.totalPrice.currency);

        // Shipping address persisted
        expect(order.shippingAddress).toMatchObject({
            street: sampleAddress.street,
            city: sampleAddress.city,
            state: sampleAddress.state,
            zip: sampleAddress.pincode,
            country: sampleAddress.country,
        });
    });


    it('returns 422 when shipping address is missing/invalid', async () => {
        // For this test we rely on validation middleware to run BEFORE controller.
        // No axios/model mocks needed because validation should block the controller.
        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', getAuthCookie())
            .send({})
            .expect('Content-Type', /json/)
            .expect(400);

        expect(res.body.errors || res.body.message).toBeDefined();
    });
});



// const request = require('supertest');
// const app = require('../../src/app');
// const { getAuthCookie } = require('../setup/auth');




// describe('POST /api/orders — Create order from current cart', () => {
//     const sampleAddress = {
//         street: '123 Main St',
//         city: 'Metropolis',
//         state: 'CA',
//         pincode: '90210',
//         country: 'USA',
//     };

//     it('creates order from current cart, computes totals, sets status=PENDING, reserves inventory', async () => {
//         // Example: Provide any inputs the API expects (headers/cookies/body). Adjust when auth is wired.
//         const res = await request(app)
//             .post('/api/orders')
//             .set('Cookie', getAuthCookie())
//             .send({ shippingAddress: sampleAddress })
//             .expect('Content-Type', /json/)
//             .expect(201);

//         // Response shape assertions (adjust fields as you implement)
//         expect(res.body).toBeDefined();
//         expect(res.body.order).toBeDefined();
//         const { order } = res.body;
//         expect(order._id).toBeDefined();
//         expect(order.user).toBeDefined();
//         expect(order.status).toBe('PENDING');

//         // Items copied from priced cart
//         expect(Array.isArray(order.items)).toBe(true);
//         expect(order.items.length).toBeGreaterThan(0);
//         for (const it of order.items) {
//             expect(it.product).toBeDefined();
//             expect(it.quantity).toBeGreaterThan(0);
//             expect(it.price).toBeDefined();
//             expect(typeof it.price.amount).toBe('number');
//             expect([ 'USD', 'INR' ]).toContain(it.price.currency);
//         }

//         // Totals include taxes + shipping
//         expect(order.totalPrice).toBeDefined();
//         expect(typeof order.totalPrice.amount).toBe('number');
//         expect([ 'USD', 'INR' ]).toContain(order.totalPrice.currency);


//         // Shipping address persisted
//         expect(order.shippingAddress).toMatchObject({
//             street: sampleAddress.street,
//             city: sampleAddress.city,
//             state: sampleAddress.state,
//             zip: sampleAddress.pincode,
//             country: sampleAddress.country,
//         });

//         // Inventory reservation acknowledgement (shape up to you)
//         // For example, you might include a flag or reservation id
//         // expect(res.body.inventoryReservation).toEqual({ success: true })
//     });


//     it('returns 422 when shipping address is missing/invalid', async () => {
//         const res = await request(app)
//             .post('/api/orders')
//             .set('Cookie', getAuthCookie())
//             .send({})
//             .expect('Content-Type', /json/)
//             .expect(400);

//         expect(res.body.errors || res.body.message).toBeDefined();
//     });
// });