const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let offset = req.query.offset || 0;
    let limit = req.query.limit || 20;

    
})