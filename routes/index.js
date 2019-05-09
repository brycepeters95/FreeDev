var express = require("express");
var router = express.Router();

// Welcome Page
router.get("/", function(req, res) {
  res.render("index");
});

router.get("/get-data", function(req, res) {});

router.post("/insert", function(req, res) {});

module.exports = router;
