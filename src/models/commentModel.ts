import mongoose from 'mongoose';

export interface CommentDoc extends mongoose.Document {
  _id: string;
  id?: string;
  comment: string;
  user: any;
  article: string;
}

interface User {
  id: string;
  _id: string;
  role: string;
  name: string;
  email: string;
  photo: string;
}

// interface CommentModel extends mongoose.Model<CommentDoc> {
//   build(): CommentDoc;
// }


const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment is require!']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must belong to a user']
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Comment must belong to a article']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// commentSchema.index({ article });
// commentSchema.pre(/^find/, function(next) {
//   // @ts-ignore
//   this.populate({
//     path: 'user',
//     select: 'name email photo'
//   });
//   next();
// });

const Comment = mongoose.model<CommentDoc>('Comment', commentSchema);

export default Comment;