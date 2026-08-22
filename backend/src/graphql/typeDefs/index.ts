export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
    role: String!
    createdAt: String!
  }

  type Team {
    id: ID!
    name: String!
    subscriptionName: String!
    description: String
    rules: String
    billingCycle: String!
    totalCost: Float!
    maxMembers: Int!
    visibility: String!
    paymentMethod: String!
    paymentNumber: String!
    renewalDate: String!
    status: String!
    ownerId: String!
    owner: User
    members: [TeamMember!]
    joinRequests: [JoinRequest!]
    payments: [Payment!]
    createdAt: String!
  }

  type TeamMember {
    user: User!
    team: Team!
    role: String!
    joinedAt: String!
    paymentStatus: String!
  }

  type JoinRequest {
    id: ID!
    user: User!
    team: Team!
    message: String
    status: String!
    createdAt: String!
  }

  type Payment {
    id: ID!
    user: User!
    team: Team!
    amount: Float!
    method: String!
    transactionId: String
    proofUrl: String
    status: String!
    createdAt: String!
  }

  type Credential {
    id: ID!
    teamId: String!
    emailOrUsername: String!
    passwordEncrypted: String!
    notes: String
  }

  type Notification {
    id: ID!
    title: String!
    message: String!
    type: String!
    link: String
    read: Boolean!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
    
    teams: [Team!]!
    team(id: ID!): Team
    myTeams: [Team!]!
    
    myNotifications: [Notification!]!
    teamCredentials(teamId: ID!): Credential
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    createTeam(
      name: String!, subscriptionName: String!, description: String, 
      rules: String, billingCycle: String!, totalCost: Float!, 
      maxMembers: Int!, visibility: String, paymentMethod: String!, 
      paymentNumber: String!, renewalDate: String!
    ): Team!
    
    deleteTeam(id: ID!): Boolean!
    
    requestToJoinTeam(teamId: ID!, message: String): JoinRequest!
    approveJoinRequest(requestId: ID!): Boolean!
    rejectJoinRequest(requestId: ID!): Boolean!
    removeMember(teamId: ID!, userId: ID!): Boolean!
    
    submitPaymentProof(teamId: ID!, amount: Float!, method: String!, transactionId: String, proofUrl: String): Payment!
    verifyPayment(paymentId: ID!): Boolean!
    rejectPayment(paymentId: ID!): Boolean!
    
    updateCredentials(teamId: ID!, emailOrUsername: String!, passwordEncrypted: String!, notes: String): Credential!
    
    markNotificationAsRead(id: ID!): Boolean!
  }
`;
