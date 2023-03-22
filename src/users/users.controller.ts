import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../common/base.controller';
import { ApiResponse } from 'src/common/request.wrappper';
import { Avatar } from './shared/models/avatar';
import { User } from './shared/models/user';
import { UserService } from './shared/services/user.service';

@ApiTags('users')
@Controller('api/users')
export class UsersController extends BaseController {
  constructor(private readonly userService: UserService, http: HttpService) {
    super(http);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    const response = await this.getUserFromApi<ApiResponse<User>>(`${id}`);

    //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return response!.data.data;
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string): Promise<Avatar> {
    const avatar = await this.userService.getUserAvatar(id);
    if (avatar.base64) return avatar;

    const user = await this.getById(id);
    const response = (
      await this.get(user.avatar, { responseType: 'arraybuffer' })
    )?.data as string;
    const buffer64 = Buffer.from(response, 'binary').toString('base64');

    const avatarObject = {
      base64: buffer64,
      userId: id,
      src: `${id}.${user.avatar.split('.').splice(-1)[0]}`,
    };

    const createdAvatar = await this.userService.saveAvatar(
      avatarObject as Avatar,
      response,
    );

    return createdAvatar;
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.userService.create(user);
  }

  @Delete(':id/avatar')
  async delete(@Param('id') id: string) {
    await this.userService.deleteAvatar(id);
  }
}
