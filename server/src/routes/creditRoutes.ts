import express, { Request, Response } from 'express';
import multer from 'multer';
import { CreditReport } from '../models/CreditReport';
import { parseXMLFile } from '../services/xmlParser';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/xml' || file.originalname.endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', upload.single('xmlFile'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const xmlContent = req.file.buffer.toString('utf-8');
    const parsedData = await parseXMLFile(xmlContent);

    const creditReport = new CreditReport(parsedData);
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
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process XML file'
    });
  }
});

router.get('/reports', async (req: Request, res: Response) => {
  try {
    const reports = await CreditReport.find()
      .select('_id name pan creditScore uploadDate')
      .sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error: any) {
    console.error('Fetch reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
});

router.get('/reports/:id', async (req: Request, res: Response) => {
  try {
    const report = await CreditReport.findById(req.params.id);

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
  } catch (error: any) {
    console.error('Fetch report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report'
    });
  }
});

router.delete('/reports/:id', async (req: Request, res: Response) => {
  try {
    const report = await CreditReport.findByIdAndDelete(req.params.id);

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
  } catch (error: any) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report'
    });
  }
});

router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const totalReports = await CreditReport.countDocuments();
    const avgCreditScore = await CreditReport.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$creditScore' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        averageCreditScore: avgCreditScore[0]?.avgScore || 0
      }
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

export default router;
