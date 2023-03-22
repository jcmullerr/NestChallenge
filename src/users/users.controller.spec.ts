import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './shared/models/user';
import { UserService } from './shared/services/user.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  const user = {
    firstName: 'test user',
    lastName: 'last name',
    email: 'test@test.com',
    avatar: 'pic.jpg',
  };

  const getUserApiResponse = {
    toPromise: () => {
      return {
        data: {
          data: user,
        },
      };
    },
  };

  const getAvatarApiResponse = {
    toPromise: () => {
      return {
        data: 'jahwdkalsjdnbglkjSBD5SA4a2s4f7245sd247gsSDFG247SAFD57GAs354SAB354asb645aSFB3BAFS357ASFB35AFB',
      };
    },
  };

  const avatar = {
    base64:
      'jahwdkalsjdnbglkjSBD5SA4a2s4f7245sd247gsSDFG247SAFD57GAs354SAB354asb645aSFB3BAFS357ASFB35AFB',
    userId: 'testUserId',
    src: 'pic.jpg',
  };

  const mockUserService = {
    getUserAvatar: jest.fn(),
    saveAvatar: jest.fn(),
    create: jest.fn(() => user),
    deleteAvatar: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const createdUser = await controller.create(user as User);
    expect(createdUser.firstName).toEqual(user.firstName);
    expect(createdUser.lastName).toEqual(user.lastName);
    expect(createdUser.email).toEqual(user.email);
    expect(createdUser.avatar).toEqual(user.avatar);
    expect(mockUserService.create).toHaveBeenCalled();
  });

  it('should get user', async () => {
    mockHttpService.get = jest.fn(() => getUserApiResponse);
    const createdUser = await controller.getById('testId');
    expect(createdUser.firstName).toEqual(user.firstName);
    expect(createdUser.lastName).toEqual(user.lastName);
    expect(createdUser.email).toEqual(user.email);
    expect(createdUser.avatar).toEqual(user.avatar);
    expect(mockHttpService.get).toHaveBeenCalled();
  });

  it('should get user avatar', async () => {
    mockUserService.getUserAvatar = jest.fn(() => avatar);
    mockHttpService.get = jest.fn(() => getAvatarApiResponse);
    const userAvatar = await controller.getAvatar('testUserId');
    expect(userAvatar.src).toEqual(avatar.src);
    expect(userAvatar.userId).toEqual(avatar.userId);
    expect(userAvatar.base64).toEqual(avatar.base64);
    expect(mockUserService.getUserAvatar).toHaveBeenCalled();
    expect(mockHttpService.get).not.toHaveBeenCalled();
  });

  it('should delete avatar succesfully', async () => {
    await controller.delete('testId');
    expect(mockUserService.deleteAvatar).toHaveBeenCalled();
  });
});
