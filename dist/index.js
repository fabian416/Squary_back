"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
const morgan_1 = __importDefault(require("morgan"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const debt_routes_1 = __importDefault(require("./routes/debt.routes"));
const userController = __importStar(require("./controllers/user.controller"));
const groupController = __importStar(require("./controllers/group.controller"));
const transactionController = __importStar(require("./controllers/transaction.controller"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
//Configuration of CORS for Express
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
//Configuration CORS for Socket.io
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
});
userController.setIo(io);
groupController.setIo(io);
transactionController.setIo(io);
// Middleware to process JSON
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((req, res, next) => {
    console.log('Body:', req.body);
    next();
});
// Routes
console.log("Configuring routes...");
// Middleware to see all the request incoming
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});
app.use('/api/users', user_routes_1.default);
app.use('/api/groups', group_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/debts', debt_routes_1.default);
console.log("Routes configured!");
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("¡Algo salió mal!");
});
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
