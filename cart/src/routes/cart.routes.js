const express = require('express');
const createAuthMiddleware = require('../middleware/auth.middleware');
const cartController = require('../controllers/cart.controller'); 
const router = express.Router();
const validation = require('../middleware/validation.middleware');

router.post("/items", 
    validation.validateAddItemToCart, 
    createAuthMiddleware(["user"]), cartController.addItemToCart
)

router.get('/',
    createAuthMiddleware([ 'user' ]),
    cartController.getCart
);

router.patch('/items/:productId',
    validation.validateUpdateCartItem,
    createAuthMiddleware([ "user" ]),
    cartController.updateItemQuantity
)


module.exports = router