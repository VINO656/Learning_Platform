import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the module'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  track: {
    type: String,
    required: [true, 'Please specify the career track'],
    enum: ['Frontend Fundamentals', 'Backend Engineering', 'Advanced System Design', 'DevOps & CI/CD Pipelines'],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assets: [{
    assetUrl: {
      type: String,
      required: true,
    },
    assetType: {
      type: String, // 'pdf', 'image', 'video'
      required: true,
    },
    title: {
      type: String,
      required: true,
    }
  }],
}, {
  timestamps: true,
});

const Module = mongoose.model('Module', moduleSchema);
export default Module;
