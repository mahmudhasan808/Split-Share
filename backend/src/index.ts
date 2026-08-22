import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { verifyToken } from './utils/auth';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const user = token ? verifyToken(token) : null;
      
      return { prisma, req, user };
    },
  }));

  // Standard REST endpoints for SSLCommerz Webhooks
  app.post('/api/payments/sslcommerz/success', (req, res) => {
    // Handle success
    res.redirect('http://localhost:5173/payments?status=success');
  });

  app.post('/api/payments/sslcommerz/fail', (req, res) => {
    // Handle fail
    res.redirect('http://localhost:5173/payments?status=fail');
  });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server", err);
});
