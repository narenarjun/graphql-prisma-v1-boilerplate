import getUserId from '../utils/getUserId';

const Query = {
  users(parent, args, { db, prisma }, info) {
    // !the first argument is 1) operational arguments<-- -->  2) queryable data
    // ? queryable data --> takes 3 types of argument ==> null or  string or object

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return await prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    );
  }
};

export { Query as default };
