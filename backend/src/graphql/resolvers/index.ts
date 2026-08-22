import { hashPassword, comparePassword, generateToken } from '../../utils/auth';

const requireAuth = (context: any) => {
  if (!context.user) throw new Error('Unauthorized');
  return context.user;
};

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      return await context.prisma.user.findUnique({
        where: { id: context.user.userId },
      });
    },
    users: async (_: any, __: any, context: any) => {
      const user = requireAuth(context);
      if (user.role !== 'ADMIN') throw new Error('Forbidden');
      return await context.prisma.user.findMany();
    },
    teams: async (_: any, __: any, context: any) => {
      return await context.prisma.team.findMany({
        where: { visibility: 'PUBLIC' },
        include: { owner: true, members: { include: { user: true } } }
      });
    },
    team: async (_: any, { id }: any, context: any) => {
      return await context.prisma.team.findUnique({
        where: { id },
        include: { owner: true, members: { include: { user: true } } }
      });
    },
    myTeams: async (_: any, __: any, context: any) => {
      const user = requireAuth(context);
      return await context.prisma.team.findMany({
        where: {
          OR: [
            { ownerId: user.userId },
            { members: { some: { userId: user.userId } } }
          ]
        },
        include: { owner: true, members: { include: { user: true } } }
      });
    },
    myNotifications: async (_: any, __: any, context: any) => {
      const user = requireAuth(context);
      return await context.prisma.notification.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' }
      });
    },
    teamCredentials: async (_: any, { teamId }: any, context: any) => {
      const user = requireAuth(context);
      const membership = await context.prisma.teamMember.findUnique({
        where: { userId_teamId: { userId: user.userId, teamId } }
      });
      const team = await context.prisma.team.findUnique({ where: { id: teamId } });

      if (team?.ownerId !== user.userId && (!membership || membership.paymentStatus !== 'PAID')) {
        return null;
      }

      return await context.prisma.credential.findUnique({ where: { teamId } });
    }
  },
  Team: {
    joinRequests: async (parent: any, _: any, context: any) => {
      return await context.prisma.joinRequest.findMany({ 
        where: { teamId: parent.id },
        include: { user: true }
      });
    },
    payments: async (parent: any, _: any, context: any) => {
      return await context.prisma.payment.findMany({ 
        where: { teamId: parent.id },
        include: { user: true }
      });
    }
  },
  Mutation: {
    register: async (_: any, { name, email, password }: any, context: any) => {
      const existingUser = await context.prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error('User already exists');
      const passwordHash = await hashPassword(password);
      const user = await context.prisma.user.create({
        data: {
          name, email, passwordHash,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        },
      });
      return { token: generateToken(user.id, user.role), user };
    },
    login: async (_: any, { email, password }: any, context: any) => {
      const user = await context.prisma.user.findUnique({ where: { email } });
      if (!user || !(await comparePassword(password, user.passwordHash))) {
        throw new Error('Invalid email or password');
      }
      return { token: generateToken(user.id, user.role), user };
    },

    createTeam: async (_: any, args: any, context: any) => {
      const user = requireAuth(context);
      return await context.prisma.team.create({
        data: {
          ...args,
          visibility: args.visibility || 'PUBLIC',
          ownerId: user.userId,
          members: {
            create: { userId: user.userId, role: 'OWNER', paymentStatus: 'PAID' }
          }
        },
        include: { owner: true }
      });
    },
    
    deleteTeam: async (_: any, { id }: any, context: any) => {
      const user = requireAuth(context);
      const team = await context.prisma.team.findUnique({ where: { id } });
      if (team?.ownerId !== user.userId) throw new Error('Forbidden');
      await context.prisma.team.delete({ where: { id } });
      return true;
    },

    requestToJoinTeam: async (_: any, { teamId, message }: any, context: any) => {
      const user = requireAuth(context);
      
      const team = await context.prisma.team.findUnique({ where: { id: teamId } });
      if (!team) throw new Error('Team not found');

      const request = await context.prisma.joinRequest.create({
        data: { userId: user.userId, teamId, message },
        include: { user: true, team: true }
      });

      await context.prisma.notification.create({
        data: {
          userId: team.ownerId,
          title: 'New Join Request',
          message: `${request.user.name} wants to join ${team.name}`,
          type: 'JOIN_REQUEST',
          link: `/manage/${team.id}`
        }
      });
      return request;
    },

    approveJoinRequest: async (_: any, { requestId }: any, context: any) => {
      const user = requireAuth(context);
      const request = await context.prisma.joinRequest.findUnique({ where: { id: requestId }, include: { team: true } });
      if (!request || request.team.ownerId !== user.userId) throw new Error('Forbidden');

      await context.prisma.$transaction([
        context.prisma.joinRequest.update({ where: { id: requestId }, data: { status: 'APPROVED' } }),
        context.prisma.teamMember.create({ data: { userId: request.userId, teamId: request.teamId } }),
        context.prisma.notification.create({
          data: {
            userId: request.userId,
            title: 'Request Approved',
            message: `Your request to join ${request.team.name} was approved!`,
            type: 'APPROVED'
          }
        })
      ]);
      return true;
    },

    rejectJoinRequest: async (_: any, { requestId }: any, context: any) => {
      const user = requireAuth(context);
      const request = await context.prisma.joinRequest.findUnique({ where: { id: requestId }, include: { team: true } });
      if (!request || request.team.ownerId !== user.userId) throw new Error('Forbidden');

      await context.prisma.joinRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } });
      return true;
    },

    removeMember: async (_: any, { teamId, userId }: any, context: any) => {
      const user = requireAuth(context);
      const team = await context.prisma.team.findUnique({ where: { id: teamId } });
      if (team?.ownerId !== user.userId) throw new Error('Forbidden');
      
      await context.prisma.teamMember.delete({ where: { userId_teamId: { userId, teamId } } });
      return true;
    },

    submitPaymentProof: async (_: any, { teamId, amount, method, transactionId, proofUrl }: any, context: any) => {
      const user = requireAuth(context);
      const team = await context.prisma.team.findUnique({ where: { id: teamId } });
      if (!team) throw new Error('Team not found');

      const payment = await context.prisma.payment.create({
        data: { userId: user.userId, teamId, amount, method, transactionId, proofUrl }
      });

      await context.prisma.notification.create({
        data: {
          userId: team.ownerId,
          title: 'Payment Submitted',
          message: `A payment of ${amount} was submitted for ${team.name}`,
          type: 'PAYMENT',
          link: `/manage/${team.id}`
        }
      });
      return payment;
    },

    verifyPayment: async (_: any, { paymentId }: any, context: any) => {
      const user = requireAuth(context);
      const payment = await context.prisma.payment.findUnique({ where: { id: paymentId }, include: { team: true } });
      if (!payment || payment.team.ownerId !== user.userId) throw new Error('Forbidden');

      await context.prisma.$transaction([
        context.prisma.payment.update({ where: { id: paymentId }, data: { status: 'VERIFIED' } }),
        context.prisma.teamMember.update({ 
          where: { userId_teamId: { userId: payment.userId, teamId: payment.teamId } },
          data: { paymentStatus: 'PAID' }
        }),
        context.prisma.notification.create({
          data: {
            userId: payment.userId,
            title: 'Payment Verified',
            message: `Your payment for ${payment.team.name} was verified! You now have access.`,
            type: 'PAYMENT_VERIFIED'
          }
        })
      ]);
      return true;
    },

    rejectPayment: async (_: any, { paymentId }: any, context: any) => {
      const user = requireAuth(context);
      const payment = await context.prisma.payment.findUnique({ where: { id: paymentId }, include: { team: true } });
      if (!payment || payment.team.ownerId !== user.userId) throw new Error('Forbidden');
      
      await context.prisma.payment.update({ where: { id: paymentId }, data: { status: 'REJECTED' } });
      return true;
    },

    updateCredentials: async (_: any, { teamId, emailOrUsername, passwordEncrypted, notes }: any, context: any) => {
      const user = requireAuth(context);
      const team = await context.prisma.team.findUnique({ where: { id: teamId } });
      if (team?.ownerId !== user.userId) throw new Error('Forbidden');

      return await context.prisma.credential.upsert({
        where: { teamId },
        update: { emailOrUsername, passwordEncrypted, notes },
        create: { teamId, emailOrUsername, passwordEncrypted, notes }
      });
    },

    markNotificationAsRead: async (_: any, { id }: any, context: any) => {
      const user = requireAuth(context);
      await context.prisma.notification.updateMany({
        where: { id, userId: user.userId },
        data: { read: true }
      });
      return true;
    }
  }
};
