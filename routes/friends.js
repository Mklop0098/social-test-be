const { createData, addFriendList, addRequestList, getFriendData, getFriendListData, getRequestFriendsData, getFriendList } = require("../controllers/friendsController");

const router = require("express").Router();

router.post("/createData", createData);
router.post("/addFriendList", addFriendList)
router.post("/addRequestList", addRequestList)
router.get("/getFriendData/:id", getFriendData)
router.post("/getFriendListv2", getFriendListData)
router.post("/getFriend", getFriendList)
router.post("/getRequestListv2", getRequestFriendsData)

module.exports = router;