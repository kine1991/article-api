// import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
// const bcrypt = require('bcryptjs');

export interface UserDoc extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role?: string;
  password?: string;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: Date | number;
  passwordResetToken?: string,
  passwordResetExpires?: Date,
  active?: boolean
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(): UserDoc;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'Please confirm your password'],
    // validate: {
    //   // This only works on CREATE and SAVE!!!
    //   validator: function<UserDoc>(el: string): boolean {
    //     // @ts-ignore
    //     return el === this.password;
    //   },
    //   message: 'Passwords are not the same!'
    // }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v
    },
  },
});

// Duplicate the ID field.
userSchema.virtual('id').get(function(){
  //@ts-ignore
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
  virtuals: true
});

userSchema.pre<UserDoc>('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password!, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;