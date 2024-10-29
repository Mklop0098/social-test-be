const { createStory, getAllUserStory } = require("../controllers/storyController ");

const router = require("express").Router();

router.route("/create").post(createStory);
router.post("/getuserstory", getAllUserStory)


module.exports = router;