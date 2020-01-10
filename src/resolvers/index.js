import { extractFragmentReplacements } from 'prisma-binding';
import Query from './Query';
import Mutation from './Mutation';
import User from './user';
// import Subscription from './Subscription';

const resolvers = {
  Query,
  // Subscription,
  Mutation,
  User
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

export { resolvers, fragmentReplacements };
