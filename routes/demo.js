var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('demo', {
        title: 'DEMO'
    });
});

router.use("/optimize", require("./optimize"));

module.exports = router;