const cartModel = require('../models/cart.models');

const addItemToCart = async (req, res) => {

}

const getCart = async (req, res) => {

    const user = req.user;

    let cart = await cartModel.findOne({ user: user.id });

    if(!cart) {
        cart = new cartModel({ user: user.id, items: [] });
        await cart.save();
    }

    res.status(200).json({
        cart,
        totals: {
            itemCount: cart.items.length,
            totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0)
        }
    })

}

module.exports = {
    addItemToCart,
    getCart
}