const User = require("../models/userModel");
const Story = require("../models/storyModel");

module.exports.createStory = async (req, res, next) => {
  try {
    var datetime = new Date();
    const { owner, story, background, link } = req.body;
    if (story !== "") {
      const data = await Story.create({
        owner: owner,
        story: story,
        background: background,
        link: link,
        likes: [],
        createAt: datetime,
      });

      const stories = await Story.find(
        { "owner": owner }
      ).sort({ createAt: -1 })
      if (stories.length > 0) {
        return res.json({ status: true,  msg: "Đăng bài thành công", stories })
      }
    }
    else return res.json({ status: false, msg: "không thể đăng bài" });
  } catch (ex) {
    next(ex);
    return res.json({
      status: false,
      msg: "Không thể gửi yêu cầu, vui lòng thử lại",
    });
  }
};

module.exports.getAllUserStory = async (req, res, next) => {
  try {
    const { userId } = req.body
    console.log(userId)
    const story = await Story.find(
      { "owner": userId }
    ).sort({ createAt: -1 })
    if (story.length > 0) {
      return res.json({ status: true, story })
    }
    else return res.json({ status: false })
  } catch (ex) {
    next(ex);
  }
};