import bcrypt from 'bcryptjs';
import getuserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);
    // ! leaving the info returns back all the scalar types from prisma, so it'll help to deal with custom schema on the nodejs side
    const user = await prisma.mutation.createUser({
      data: { ...args.data, password }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async loginUser(parent, args, { prisma }, info) {
    const user = await prisma.query.users({
      where: {
        email: args.data.emailID
      }
    });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(args.data.password, user[0].password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return {
      user: user[0],
      token: generateToken(user[0].id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);
    return await prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getuserId(request);
    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }
    return await prisma.mutation.updateUser(
      {
        data: args.data,
        where: {
          id: userId
        }
      },
      info
    );
  }
};

export { Mutation as default };
