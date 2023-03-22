import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createFile, deleteFile } from '../../../common/file.helper';
import { Avatar } from '../models/avatar';
import { User } from '../models/user';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
    @InjectModel('Avatars') private readonly avatarModel: Model<Avatar>,
    @Inject('EVENT_SERVICE') private client: ClientProxy,
  ) {}

  async getAll() {
    return await this.userModel.find().exec();
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) return new User();

    return user;
  }

  async create(user: User) {
    const createdUser = new this.userModel(user);
    const pattern = { cmd: 'createdUser' };
    await this.client.send<User>(pattern, createdUser).toPromise();

    return await createdUser.save();
  }

  async update(id: string, user: User) {
    await this.userModel.findOneAndUpdate({ _id: id }, user).exec();
    return await this.getById(id);
  }

  async delete(id: string) {
    await this.userModel.findOneAndDelete({ _id: id }).exec();
  }

  async saveAvatar(avatar: Avatar, file: string): Promise<Avatar> {
    const createdAvatar = new this.avatarModel(avatar);
    await createFile('uploads', avatar.src, file);
    return await createdAvatar.save();
  }

  async getUserAvatar(userId: string): Promise<Avatar> {
    const avatar = await this.avatarModel.findOne({ userId: userId }).exec();
    if (avatar === null) return {} as Avatar;

    return avatar ?? null;
  }

  async deleteAvatar(userId: string) {
    const document = await this.avatarModel
      .findOneAndDelete({ userId: userId })
      .exec();
    deleteFile(`uploads/${document?.src}`);
  }
}
