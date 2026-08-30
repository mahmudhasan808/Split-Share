import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { verifyToken } from './utils/auth';
import SSLCommerzPayment from 'sslcommerz-lts';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for SSLCommerz Webhooks

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

  // SSLCommerz init
  app.post('/api/payments/sslcommerz/init', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const user = token ? verifyToken(token) : null;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { teamId, amount } = req.body;
      const tran_id = `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      // Create Payment as PENDING
      await prisma.payment.create({
        data: {
          userId: user.userId,
          teamId,
          amount: parseFloat(amount),
          method: 'SSLCommerz',
          transactionId: tran_id,
          status: 'PENDING',
          sslcommerzTranId: tran_id,
        }
      });

      const store_id = process.env.STORE_ID || 'testbox';
      const store_passwd = process.env.STORE_PASSWORD || 'qwerty';
      const is_live = false; // true for live, false for sandbox

      const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/success`,
        fail_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/fail`,
        cancel_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/cancel`,
        ipn_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payments/sslcommerz/ipn`,
        shipping_method: 'Courier',
        product_name: 'Team Subscription',
        product_category: 'Subscription',
        product_profile: 'general',
        cus_name: (user as any).name || 'John Doe',
        cus_email: (user as any).email || 'john@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: (user as any).name || 'John Doe',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse: any) => {
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.json({ url: GatewayPageURL });
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to init payment' });
    }
  });

  app.post('/api/payments/sslcommerz/success', async (req, res) => {
    const { tran_id } = req.body;
    const payment = await prisma.payment.findUnique({ where: { sslcommerzTranId: tran_id } });
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'VERIFIED' }
      });
      await prisma.teamMember.update({
        where: { userId_teamId: { userId: payment.userId, teamId: payment.teamId } },
        data: { paymentStatus: 'PAID' }
      });
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/${payment.teamId}?payment=success`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?payment=fail`);
    }
  });

  app.post('/api/payments/sslcommerz/fail', async (req, res) => {
    const { tran_id } = req.body;
    const payment = await prisma.payment.findUnique({ where: { sslcommerzTranId: tran_id } });
    if (payment) {
       await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REJECTED' }
      });
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/${payment.teamId}?payment=fail`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?payment=fail`);
    }
  });
  
  app.post('/api/payments/sslcommerz/cancel', async (req, res) => {
    const { tran_id } = req.body;
    const payment = await prisma.payment.findUnique({ where: { sslcommerzTranId: tran_id } });
    if (payment) {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/${payment.teamId}?payment=cancel`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`);
    }
  });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server", err);
});
