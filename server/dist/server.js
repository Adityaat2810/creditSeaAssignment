"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const creditRoutes_1 = __importDefault(require("./routes/creditRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/creditsea";
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
app.get('/', (req, res) => {
    res.json({
        message: 'CreditSea API Server',
        version: '1.0.0',
        endpoints: {
            upload: 'POST /api/credit/upload',
            reports: 'GET /api/credit/reports',
            report: 'GET /api/credit/reports/:id',
            delete: 'DELETE /api/credit/reports/:id',
            stats: 'GET /api/credit/stats/overview'
        }
    });
});
app.use('/api/credit', creditRoutes_1.default);
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = app;
