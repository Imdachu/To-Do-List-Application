const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Shopping', 'Other'],
    default: 'Other'
  }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Indexes for performance optimization
TaskSchema.index({ status: 1 });
TaskSchema.index({ category: 1 });
TaskSchema.index({ dueDate: 1 });

// You can also add more indexes if needed, for example, on userId
TaskSchema.index({ userId: 1 });

module.exports = mongoose.model('Task', TaskSchema);
