export declare const resolvers: {
    Query: {
        me: (_: any, __: any, context: any) => Promise<any>;
        users: (_: any, __: any, context: any) => Promise<any>;
        teams: (_: any, __: any, context: any) => Promise<any>;
        team: (_: any, { id }: any, context: any) => Promise<any>;
        myTeams: (_: any, __: any, context: any) => Promise<any>;
        myNotifications: (_: any, __: any, context: any) => Promise<any>;
        teamCredentials: (_: any, { teamId }: any, context: any) => Promise<any>;
    };
    Team: {
        joinRequests: (parent: any, _: any, context: any) => Promise<any>;
        payments: (parent: any, _: any, context: any) => Promise<any>;
    };
    Mutation: {
        register: (_: any, { name, email, password }: any, context: any) => Promise<{
            token: string;
            user: any;
        }>;
        login: (_: any, { email, password }: any, context: any) => Promise<{
            token: string;
            user: any;
        }>;
        createTeam: (_: any, args: any, context: any) => Promise<any>;
        deleteTeam: (_: any, { id }: any, context: any) => Promise<boolean>;
        requestToJoinTeam: (_: any, { teamId, message }: any, context: any) => Promise<any>;
        approveJoinRequest: (_: any, { requestId }: any, context: any) => Promise<boolean>;
        rejectJoinRequest: (_: any, { requestId }: any, context: any) => Promise<boolean>;
        removeMember: (_: any, { teamId, userId }: any, context: any) => Promise<boolean>;
        submitPaymentProof: (_: any, { teamId, amount, method, transactionId, proofUrl }: any, context: any) => Promise<any>;
        verifyPayment: (_: any, { paymentId }: any, context: any) => Promise<boolean>;
        rejectPayment: (_: any, { paymentId }: any, context: any) => Promise<boolean>;
        updateCredentials: (_: any, { teamId, emailOrUsername, passwordEncrypted, notes }: any, context: any) => Promise<any>;
        markNotificationAsRead: (_: any, { id }: any, context: any) => Promise<boolean>;
    };
};
//# sourceMappingURL=index.d.ts.map