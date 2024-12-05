const Task = require("../model/TaskMode");

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const userId = req.params.userId;
    const taskData = req.body;

    console.log("jo data aara haa haii");
    console.log(taskData);

    console.log(new Date(taskData.date));

    const task = new Task({
      ...taskData,
      user: userId, // Set the userId from the request parameter
    });

    const tx = await task.save();
    console.log("jo data ja raha hai");
    console.log(tx);

    res.status(201).json({
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding task",
      error: error.message,
    });
  }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.find({ user: userId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Get a specific task by ID for a user
exports.getTaskById = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// Update a task for a user
exports.updateTask = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
};

// Delete a task for a user
exports.deleteTask = async (req, res) => {
  try {
    const { userId, id } = req.params;
    console.log(userId, id);
    console.log("delete");
    const task = await Task.findOneAndDelete({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// Mark a task as completed for a user
exports.markTaskCompleted = async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { isCompleted: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task marked as completed successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error marking task as completed",
      error: error.message,
    });
  }
};
