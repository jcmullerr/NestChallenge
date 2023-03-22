import { Document } from 'mongoose';

export class User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}
