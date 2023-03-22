import mongoose from 'mongoose';

export const AvatarSchema = new mongoose.Schema({
  base64: String,
  userId: String,
  src: String,
});
