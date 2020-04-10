const express = require('express');
const postControllers = require('../controllers/post');


const router = express.Router();

router.get("/covidUpdate", postControllers.getPosts);
router.post("/covidInsertion", postControllers.createPost);

module.exports = router;