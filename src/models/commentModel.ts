import mongoose from 'mongoose';

export interface CommentDoc extends mongoose.Document {
  _id: string;
  id?: string;
  comment: string;
  user: string;
  article: string;
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
  }
});

// commentSchema.index({ article });

const Comment = mongoose.model<CommentDoc>('Comment', commentSchema);

export default Comment;