import { Document } from 'mongoose';

export class Avatar extends Document {
  base64: string;
  userId: string;
  src: string;
}
