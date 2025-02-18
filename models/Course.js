const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    trainer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    imageUrl: {
      // image data (Base64 encoded)
      type: String,
      default: '', // You can set a default image URL here if needed
    },
    isDeleted: {
      type: Boolean,
      default: false, // for soft delete
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
