import mongoose from 'mongoose';


export interface ArticleDoc extends mongoose.Document {
  _id: string;
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  category: string;
  likes: [any];
  createdAt: Date;
  updatedAt: Date;
  imagesUrl?: [string];
  imageUrl?: string;
  publisher: Publisher | string;
  count: number;
}

interface Publisher {
  role: string;
  id: string;
  _id: string;
  name: string;
  email: string;
  photo: string;
}

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
    required: [true, 'Author can not be empty!']
  },
  content: {
    type: String,
    required: [true, 'Content can not be empty!']
  },
  category: {
    type: String,
    default: 'Other'
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
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  count: {
    type: Number,
    default: 0
  },
  imageUrl: String,
  imagesUrl: [String]
});

// Duplicate the ID field.
articleSchema.virtual('id').get(function(){
  //@ts-ignore
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
articleSchema.set('toJSON', {
  virtuals: true
});

const Article = mongoose.model<ArticleDoc>('Article', articleSchema);

export default Article;