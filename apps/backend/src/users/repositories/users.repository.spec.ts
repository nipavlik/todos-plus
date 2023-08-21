import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

import { UsersRepository } from './users.repository';
import { PrismaService } from '../../prisma/prisma.service';

async function createRandomUser(): Promise<User> {
  const date = new Date(faker.date.past());
  return {
    id: faker.number.int(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    nickname: faker.internet.userName(),
    password: await argon2.hash(faker.internet.password()),
    createdAt: date,
    updatedAt: date,
  };
}

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let prismaService: PrismaService;
  let users: User[] = [];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeAll(async () => {
    users = await Promise.all(
      faker.helpers.multiple(createRandomUser, {
        count: 10,
      }),
    );
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(usersRepository).toBeDefined();
      expect(prismaService).toBeDefined();
    });

    it('find by id', async () => {
      const user: User = users[faker.number.int({ min: 0, max: 9 })];

      const findFirstSpy = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(user);

      const options = { where: { id: user.id } };
      const result = await usersRepository.findOne(options);

      expect(findFirstSpy).toHaveBeenCalledWith(options);
      expect(result).toEqual(user);
    });

    it('find by nickname', async () => {
      const user: User = users[faker.number.int({ min: 0, max: 9 })];

      const findFirstSpy = jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(user);

      const options = { where: { nickname: user.nickname } };
      const result = await usersRepository.findOne(options);

      expect(findFirstSpy).toHaveBeenCalledWith(options);
      expect(result).toEqual(user);
    });
  });

  // describe('create', () => {
  //   it('should call prisma.user.create with the correct parameters', async () => {
  //     const user: User = users[faker.number.int({ min: 0, max: 9 })];

  //     const createSpy = jest
  //       .spyOn(prismaService.user, 'create')
  //       .mockResolvedValue(user);

  //     const options = {
  //       data: {
  //         firstName: 's',
  //         lastName: 'nik',
  //         nickname: 'paulox2',
  //         password: 'awd',
  //       },
  //     };
  //     const result = await usersRepository.create(options);
  //     expect(createSpy).toHaveBeenCalledWith({ data: options.data });
  //     expect(result).toEqual(user);
  //   });
  // });
});
