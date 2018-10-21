const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send("Admin Page");
});

router.get('/clients');
router.get('/cards');
router.get('/chops');
router.get('/tablets');

module.exports = router;