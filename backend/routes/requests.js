import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';
import { nanoid } from 'nanoid';
import Request from '../models/Request.js';
import Service from '../models/Service.js';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'osp-requests',
    resource_type: 'auto',
    public_id: `${Date.now()}_${file.originalname.replace(/\s+/g,'_')}`
  })
});

const allowed = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter: (_req, file, cb) => {
    if (allowed.has(file.mimetype)) cb(null, true); else cb(new Error('Only PDF/JPG/PNG allowed'));
  }
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 });
const router = express.Router();

const schema = Joi.object({
  serviceId: Joi.string().required(),
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  address: Joi.string().allow(''),
  // preferredDate: Joi.string().allow(''),
  // preferredTime: Joi.string().allow(''),
  notes: Joi.string().allow(''),
  utr: Joi.string().required()   // ✅ NEW
});

router.post('/', limiter, upload.array('documents', 6), async (req, res) => {
  try {
    const { value, error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const service = await Service.findById(value.serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    if (service.requiredDocuments.length && (req.files?.length || 0) === 0) {
      return res.status(400).json({ error: 'Please upload required documents' });
    }

    const docs = (req.files || []).map(f => ({
      url: f.path,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    }));

    const request = await Request.create({
      requestId: `REQ-${nanoid(10).toUpperCase()}`,
      service: service._id,
      applicant: {
        fullName: value.fullName,
        email: value.email,
        phone: value.phone,
        address: value.address
      },
      // schedule: { date: value.preferredDate, time: value.preferredTime },
      notes: value.notes,
      documents: docs,
      utr: value.utr,   // ✅ NEW
      status: 'Pending'
    });

    res.json({ success: true, requestId: request.requestId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/track', async (req, res) => {
  const { requestId, phone } = req.query;
  const item = await Request.findOne({ requestId, 'applicant.phone': phone }).populate('service');
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

export default router;
