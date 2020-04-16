const express = require("express");
const postControllers = require("../controllers/postController");
const getControllers = require("../controllers/getController");
const router = express.Router();

router.get("/covidUpdate/api/v1", getControllers.getPosts);
router.post("/covidInsertion", postControllers.createPost);

module.exports = router;
