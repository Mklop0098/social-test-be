const User = require("../models/userModel");
const Friend = require("../models/friendsModel");

module.exports.createData = async (req, res, next) => {
    try {
        const {userId} = req.body
        const user = await Friend.findOne({ userId});
        if (!user) {
            await Friend.create({
                userId,
                friendList: [],
                requestList: [],
            });
        } 
        return res.json({status: true})
    } catch (ex) {
      next(ex);
      return res.json({status: false})
    }
};

module.exports.addFriendList = async (req, res, next) => {
    try {
        const {userId, friendId} = req.body        
        await Friend.findOneAndUpdate(
            {userId},
            { 
                $push: { friendList: {friendId} },
                $pull: { requestList: {friendId} }
            },
        ) 
        await Friend.findOneAndUpdate(
            {userId: friendId},
            { 
                $push: { friendList: {friendId: userId}},
                $pull: { requestList: {friendId: userId} }
            },

        )
        return res.json({status: true})
    } catch (ex) {
      next(ex);
      return res.json({status: false})
    }
}

module.exports.addRequestList = async (req, res, next) => {
    try {
        const {userId, friendId} = req.body
        const user = await Friend.findOne({ userId});
        if (!user) {
            await Friend.create({
                userId,
                friendList: [],
                requestList: [],
            });
            await Friend.findOneAndUpdate(
                {userId},
                { $push: { requestList: {friendId} } }
            ) 
        }
        else {
            if (!user.requestList.find(friend => friend.friendId === friendId)) {
                await Friend.findOneAndUpdate(
                    {userId},
                    { $push: { requestList: {friendId} } }
                ) 
            }
        }
        return res.json({status: true})
    } catch (ex) {
        next(ex);
        return res.json({status: false})
    }
}

module.exports.getFriendData = async (req, res, next) => {
    try {
        const friendData = await Friend.find({ userId: req.params.id }).select([
            "userId",
            "friendList",
            "requestList",
        ])
        if (friendData.length > 0) {
            return res.json({status: true, friendData})
        }
        return res.json({status: false, msg: "Invalid id"})
    } catch (ex) {
        next(ex);
        return res.json({status: false, msg: ex})
    }
}


module.exports.getFriendList = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const friendData = await Friend.find({ userId }).select("friendList");
    if (friendData.length > 0) {
      return res.json({ status: true, data: friendData });
    }

    return res.json({ status: false, msg: "Empty" });
  } catch (ex) {
    next(ex);
    return res.json({ status: false, msg: ex.message });
  }
};

module.exports.getFriendListData = async (req, res, next) => {
    const { userId } = req.body;
  
    const getUserData = async (id) => {
      const userData = await User.find({ _id: id });
      if (userData) {
        return userData[0];
      }
      return null;
    };
  
    try {
      const friendData = await Friend.find({ userId }).select([
        "friendList",
      ]);
  
      if (friendData.length > 0) {
        const friendList = await Promise.all(
          friendData[0].friendList.map(async (friend) => {
            return await getUserData(friend.friendId);
          })
        );
        return res.json({ status: true, data: friendList });
      }
  
      return res.json({ status: false, msg: "Empty" });
    } catch (ex) {
      next(ex);
      return res.json({ status: false, msg: ex.message });
    }
  };
  
  module.exports.getRequestFriendsData = async (req, res, next) => {
    const { userId } = req.body;
  
    const getUserData = async (id) => {
      const userData = await User.find({ _id: id });
      if (userData) {
        return userData[0];
      }
      return null;
    };
  
    try {
      const friendData = await Friend.find({ userId }).select([
        "requestList",
      ]);

      if (friendData.length > 0) {
        const friendList = await Promise.all(
          friendData[0].requestList.map(async (friend) => {
            return await getUserData(friend.friendId);
          })
        );
        return res.json({ status: true, data: friendList });
      }
  
      return res.json({ status: false, msg: "Empty" });
    } catch (ex) {
      next(ex);
      return res.json({ status: false, msg: ex.message });
    }
  };
  