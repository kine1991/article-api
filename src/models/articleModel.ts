import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title can not be empty!']
  },
  description: {
    type: String,
    required: [true, 'Description can not be empty!']
  },
  author: {
    type: String,
    required: [true, 'Article can not be empty!']
  },
  content: {
    type: String,
    required: [true, 'Content can not be empty!']
  },
  priority: {
    type: Number,
    default: 1,
    min: [1, 'Priority should be greater than or equal to 1'],
    max: [10, 'Priority should be less than or equal to 10'],
  },
  private: {
    type: Boolean,
    default: false
  },
  user: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  imageUrl: String,
  imagesUrl: [String]
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v
    },
  },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;