const { subscribeToQueue } = require('./broker');

module.exports = async function() {

    subscribeToQueue('AUTH_SELLER_DASHBOARD.USER_CREATED', async (user) => {
        await userModel.create(user);
    })

}