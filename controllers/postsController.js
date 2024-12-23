const Post = require("../models/postsModel");
const { ObjectId } = require('mongodb');

module.exports.createPost = async (req, res, next) => {
  try {
      var datetime = new Date();
      const {owner, post, images} = req.body
      if (post !== '') {
          const data = await Post.create({
              owner: owner,
              posts: post,
              imgaes: images,
              shared: [],
              likes: [],
              comments: [],
              createAt: datetime
          });
          return res.json({status: true, msg: "Đăng bài thành công", data})
      }
      else return res.json({status: false, msg: "không thể đăng bài"})
  } catch (ex) {
    next(ex);
    return res.json({status: false, msg: "Không thể gửi yêu cầu, vui lòng thử lại"})
  }
};

module.exports.getAllPosts = async (req, res, next) => {
  try {
    const post = await Post.find().sort({createAta: -1})
    if (post.length > 0) {
      return res.json({status: true, post})
    }
    else return res.json({status: false})
  } catch (ex) {
    next(ex);
  }
};

module.exports.getPostById = async (req, res, next) => {
  const {id} = req.body
  try {
    const post = await Post.find({_id: id})
    if (post) {
      return res.json({status: true, post})
    }
    else return res.json({status: false})
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUserPosts = async (req, res, next) => {
  try {
    const {userId} = req.body
    const post = await Post.find({
      $or: [
        { "shared.userId": userId },
        { "owner": userId }
      ]
    }).sort({ createAt: -1 })
    if (post.length > 0) {
      return res.json({status: true, post})
    }
    else return res.json({status: false})
  } catch (ex) {
    next(ex);
  }
};


module.exports.likePost = async (req, res, next) => {

  try {
    const {userId, postId} = req.body
    const post = await Post.find({_id: postId})

    if (post) {
      await Post.findOneAndUpdate(
        {_id: postId},
        { $push: { likes: {userId} } }
      ) 
      return res.json({status: true, post})
    }
    else return res.json({status: false})
  } catch (ex) {
    next(ex);
  }
};

module.exports.removeLikePost = async (req, res, next) => {

  try {
    const {userId, postId} = req.body
    const post = await Post.find({_id: postId})

    if (post) {
      await Post.findOneAndUpdate(
        {_id: postId},
        { $pull: { likes: {userId} } }
      ) 
      return res.json({status: true, post})
    }
    else return res.json({status: false})
  } catch (ex) {
    next(ex);
  }
};

module.exports.commentPost = async (req, res, next) => {

  const commentId = new ObjectId()

  try {
    const {userId, postId, comment, parents} = req.body
    const post = await Post.find({_id: postId})
    const time = new Date()

    if (!parents) {
      if (post) {
        await Post.findOneAndUpdate(
          {_id: postId},
          { $push: { comments: {_id: commentId, userId, comment, createAt: time, child: [], parents: [commentId.toString()]} } },
          {
            new: true,
          }
        ) 
      }
    }
    else {
      if (post) {
        await Post.findOneAndUpdate(
          { _id: postId},
          { $push: { comments: {_id: commentId, userId, comment, createAt: time, child: [], parents: [...parents, commentId.toString()]} }},
          {
            new: true,
          }
        ) 
      }
    }

    const result = await Post.find({_id: postId})

    if (result) {
      return res.json({status: true, result})
    }
    else return res.json({status: false})
    
  } catch (ex) {
    next(ex);
  }
};

module.exports.sharePost = async (req, res, next) => {

  try {
    const {userId, postId, comment} = req.body
    const post = await Post.find({_id: postId})
    const time = new Date()

    if (post) {
      await Post.findOneAndUpdate(
        {_id: postId},
        { $push: { shared: {userId, comment, createAt: time} } }
      ) 
      return res.json({status: true, post})
    }
    else return res.json({status: false})
  } catch (ex) {
    next(ex);
  }
};
