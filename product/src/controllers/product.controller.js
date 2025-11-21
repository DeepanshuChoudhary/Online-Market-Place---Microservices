const productModel = require('../models/product.model');
const { uploadImage } = require('../services/imagekit.service.js');
const mongoose = require('mongoose');


// const createProduct = async (req, res) => {

//     try {
//         const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;

//         if(!title || !priceAmount || !seller) {
//             return res.status(400).json({ message: 'title, priceAmount and seller are required' });
//         }

//         const seller = req.user.id;

//         const price = {
//             amount: Number(priceAmount),
//             currency: priceCurrency
//         };

//         const images = [];
//         const files = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })))

//         const product = await Product.create({ title, description, price, seller, images });
//         return res.status(201).json({
//             message: 'Product created',
//             data: product
//         })
        
//     }
//     catch (err) {
//         console.error('Create product error', err);
//         return res.status(500).json({ message: 'Internal server error' });
//     }

// }

async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
        const seller = req.user.id; // Extract seller from authenticated user

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency,
        };

        const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })));


        const product = await productModel.create({ title, description, price, seller, images });

        await publishToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED", product);
        await publishToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", {
            email: req.user.email,
            productId: product._id,
            sellerId: seller
        });

        return res.status(201).json({
            message: 'Product created',
            data: product,
        });
    } catch (err) {
        console.error('Create product error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createProduct
};