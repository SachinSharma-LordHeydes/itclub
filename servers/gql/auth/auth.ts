import { GraphQLContext } from '../context';

export function requireAuth(ctx: GraphQLContext) {
  if (!ctx.user) {
    throw new Error('Authentication required');
  }
  return ctx.user;
}

export function requireAdmin(ctx: GraphQLContext) {
  const user = requireAuth(ctx);
  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
}