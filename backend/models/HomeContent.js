// backend/models/HomeContent.js
const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['hero', 'about', 'expertise', 'sectors', 'values']
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(v) {
        return v && typeof v === 'object' && Object.keys(v).length > 0;
      },
      message: 'Content cannot be empty'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'admin'
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Pre-save middleware to increment version
homeContentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.version += 1;
    this.updatedAt = new Date();
  }
  next();
});

// Pre-findOneAndUpdate middleware to increment version
homeContentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.content || update.$set?.content) {
    this.set({ 
      updatedAt: new Date(),
      $inc: { version: 1 }
    });
  }
  next();
});

module.exports = mongoose.model('HomeContent', homeContentSchema);