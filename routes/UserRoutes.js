const express = require("express");
const {
  SignUp,
  login,
  updateProfilePic,
  upload,
  getProfilePic,
} = require("../controllers/UserController");
const {
  addTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  markTaskCompleted,
} = require("../controllers/TaskController");
const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(SignUp);

router.post("/:userId/tasks", addTask);
router.get("/:userId/tasks", getTasks);
router.get("/:userId/tasks/:id", getTaskById);
router.put("/:userId/tasks/:id", updateTask);
router.delete("/:userId/tasks/:id", deleteTask);
router.patch("/:userId/tasks/:taskId/complete", markTaskCompleted);

router.get("/getProfile/:id", getProfilePic);

router.patch(
  "/updateProfilePic/:id",
  upload.single("profilePic"),
  updateProfilePic
);

module.exports = router;
