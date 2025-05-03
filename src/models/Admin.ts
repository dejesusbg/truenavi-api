import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface AdminProps extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'], trim: true },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please add a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  createdAt: { type: Date, default: Date.now },
});

// encrypt password using bcrypt
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// sign JWT and return
AdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as any, {
    expiresIn: process.env.JWT_EXPIRE as any,
  });
};

// match user entered password to hashed password in database
AdminSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<AdminProps>('Admin', AdminSchema);
