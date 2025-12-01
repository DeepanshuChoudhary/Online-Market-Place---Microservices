const paymentModel = require("../model/payment.model");
const axios = require('axios');

const createPayment = async (req, res) => {

    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[ 1 ];

    try{
        const orderId = req.params.orderId;

        const orderResponse = await axios.get("http://localhost:3003/api/orders/" + orderId, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        // console.log(orderResponse.data.order.totalPrice);

        const price = orderResponse.data.order.totalPrice;

        const payment = await paymentModel.create({
            order: orderId,
            
        })

    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error in payment.controller.js"
        })
    }

}

module.exports = {
    createPayment
}