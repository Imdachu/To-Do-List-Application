const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markCompleted,
  markPending,
  searchTasks
} = require('../controllers/taskController');
const auth = require('../middlewares/auth');

router.use(auth); // Protect all routes

// Existing routes
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// New routes
router.post('/:id/complete', markCompleted);
router.post('/:id/pending', markPending);
router.get('/search', searchTasks);

module.exports = router;
