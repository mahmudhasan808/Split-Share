"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
const client_1 = require("@prisma/client");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
const auth_1 = require("./utils/auth");
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
dotenv_1.default.config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Required for SSLCommerz Webhooks
async function startServer() {
    const server = new server_1.ApolloServer({
        typeDefs: typeDefs_1.typeDefs,
        resolvers: resolvers_1.resolvers,
    });
    await server.start();
    app.use('/graphql', (0, express5_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.replace('Bearer ', '');
            const user = token ? (0, auth_1.verifyToken)(token) : null;
            return { prisma, req, user };
        },
    }));
    // SSLCommerz init
    app.post('/api/payments/sslcommerz/init', async (req, res) => {
        try {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.replace('Bearer ', '');
            const user = token ? (0, auth_1.verifyToken)(token) : null;
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
                cus_name: user.name || 'John Doe',
                cus_email: user.email || 'john@example.com',
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: '01711111111',
                ship_name: user.name || 'John Doe',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: '1000',
                ship_country: 'Bangladesh',
            };
            const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
            sslcz.init(data).then((apiResponse) => {
                let GatewayPageURL = apiResponse.GatewayPageURL;
                res.json({ url: GatewayPageURL });
            });
        }
        catch (error) {
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
        }
        else {
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
        }
        else {
            res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard?payment=fail`);
        }
    });
    app.post('/api/payments/sslcommerz/cancel', async (req, res) => {
        const { tran_id } = req.body;
        const payment = await prisma.payment.findUnique({ where: { sslcommerzTranId: tran_id } });
        if (payment) {
            res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/workspace/${payment.teamId}?payment=cancel`);
        }
        else {
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
//# sourceMappingURL=index.js.map