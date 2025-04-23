const Task = require('../models/Task');
const { validateTask, validateTaskUpdate, validateTaskQuery } = require('../validators/taskValidator');



// Create Task
exports.createTask = async (req, res) => {
  try {
    const { error } = validateTask(req.body); // Validate the task data
    if (error) return res.status(400).json({ error: error.details[0].message }); // Return error if validation fails

    const task = new Task({
      userId: req.userId,
      ...req.body
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get task
exports.getTasks = async (req, res) => {
    try {
      // Use the new validator
      const { error, value } = validateTaskQuery(req.query);
      if (error) return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
  
      const {
        status,
        category,
        fromDate,
        toDate,
        sortBy,
        page = 1,
        limit = 10
      } = value;
  
      const filter = { userId: req.userId };
  
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (fromDate || toDate) {
        filter.dueDate = {};
        if (fromDate) filter.dueDate.$gte = new Date(fromDate);
        if (toDate) filter.dueDate.$lte = new Date(toDate);
      }
  
      const sortOptions = {};
      if (sortBy === 'dueDate') sortOptions.dueDate = 1;
      if (sortBy === '-dueDate') sortOptions.dueDate = -1;
      if (sortBy === 'createdAt') sortOptions.createdAt = 1;
      if (sortBy === '-createdAt') sortOptions.createdAt = -1;
      if (!sortBy) sortOptions.createdAt = -1;
  
      const skip = (page - 1) * limit;
  
      const tasks = await Task.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
  
      const totalTasks = await Task.countDocuments(filter);
  
      res.json({
        tasks,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalTasks / limit),
          totalTasks,
          itemsPerPage: limit
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { error } = validateTaskUpdate(req.body); // Validate the task update data
    if (error) return res.status(400).json({ error: error.details[0].message }); // Return error if validation fails

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark task as completed
// Mark task as completed (atomic operation)
exports.markCompleted = async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, status: 'pending' }, // Only mark pending tasks as completed
        { status: 'completed' },
        { new: true } // Return the updated task
      );
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found or already completed' });
      }
      
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  

// Mark task as pending
// Mark task as pending (atomic operation)
exports.markPending = async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, status: 'completed' }, // Only mark completed tasks as pending
        { status: 'pending' },
        { new: true } // Return the updated task
      );
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found or already pending' });
      }
      
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  

// Search tasks
// Search tasks
exports.searchTasks = async (req, res) => {
    try {
      const { q } = req.query;  // Search query string
      const tasks = await Task.find({
        userId: req.userId, // Ensure only tasks of the authenticated user are returned
        $or: [
          { title: { $regex: q, $options: 'i' } },  // Case-insensitive search for title
          { description: { $regex: q, $options: 'i' } }  // Case-insensitive search for description
        ]
      });
      res.json(tasks);  // Return found tasks as JSON
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
