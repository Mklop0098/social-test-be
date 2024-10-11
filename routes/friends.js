const { createData, addFriendList, addRequestList, getFriendData, getFriendListData } = require("../controllers/friendsController");

const router = require("express").Router();

router.post("/createData", createData);
router.post("/addFriendList", addFriendList)
router.post("/addRequestList", addRequestList)
router.get("/getFriendData/:id", getFriendData)
router.post("/getFriendListv2", getFriendListData)

module.exports = router;