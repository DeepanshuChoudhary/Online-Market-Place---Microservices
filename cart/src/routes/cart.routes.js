const express = require('express');
const createAuthMiddleware = require('../middleware/auth.middleware');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.post("/items", createAuthMiddleware(["user"]), cartController.addItemToCart)


module.exports = router