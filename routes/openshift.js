var express = require('express');
var router = express.Router();

/* openshift status route */
router.get('/', function(req, res, next) {
  res.send("{status: 'ok'}");
});

module.exports = router;
