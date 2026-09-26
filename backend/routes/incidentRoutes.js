const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Incident route working - coming soon');
});

module.exports= router;