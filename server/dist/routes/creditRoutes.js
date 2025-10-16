"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const CreditReport_1 = require("../models/CreditReport");
const xmlParser_1 = require("../services/xmlParser");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/xml' || file.originalname.endsWith('.xml')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only XML files are allowed'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
router.post('/upload', upload.single('xmlFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        const xmlContent = req.file.buffer.toString('utf-8');
        const parsedData = await (0, xmlParser_1.parseXMLFile)(xmlContent);
        const creditReport = new CreditReport_1.CreditReport(parsedData);
        await creditReport.save();
        res.status(201).json({
            success: true,
            message: 'XML file processed successfully',
            data: {
                reportId: creditReport._id,
                name: creditReport.name,
                creditScore: creditReport.creditScore
            }
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process XML file'
        });
    }
});
router.get('/reports', async (req, res) => {
    try {
        const reports = await CreditReport_1.CreditReport.find()
            .select('_id name pan creditScore uploadDate')
            .sort({ uploadDate: -1 });
        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    }
    catch (error) {
        console.error('Fetch reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reports'
        });
    }
});
router.get('/reports/:id', async (req, res) => {
    try {
        const report = await CreditReport_1.CreditReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }
        res.status(200).json({
            success: true,
            data: report
        });
    }
    catch (error) {
        console.error('Fetch report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report'
        });
    }
});
router.delete('/reports/:id', async (req, res) => {
    try {
        const report = await CreditReport_1.CreditReport.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Report deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete report'
        });
    }
});
router.get('/stats/overview', async (req, res) => {
    try {
        const totalReports = await CreditReport_1.CreditReport.countDocuments();
        const avgCreditScore = await CreditReport_1.CreditReport.aggregate([
            { $group: { _id: null, avgScore: { $avg: '$creditScore' } } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalReports,
                averageCreditScore: avgCreditScore[0]?.avgScore || 0
            }
        });
    }
    catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});
exports.default = router;
