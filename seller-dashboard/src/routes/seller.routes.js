const express = require('express');
const createAuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();


router.get('/metrics', createAuthMiddleware([ "seller" ]))



module.exports = router;