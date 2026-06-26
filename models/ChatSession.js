import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const ChatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'New Consultation',
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);
