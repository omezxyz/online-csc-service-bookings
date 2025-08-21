import express from 'express';
import Request from '../models/Request.js';
import Service from '../models/Service.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// ===== Requests =====
router.get('/requests', auth, async (_req, res) => {
  const items = await Request.find().populate('service').sort({ createdAt: -1 });
  res.json(items);
});

router.patch('/requests/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const ok = ['Pending','Verified','Documents Needed','In Progress','Completed','Rejected'].includes(status);
  if (!ok) return res.status(400).json({ error: 'Invalid status' });
  const item = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(item);
});

// ===== Services =====

// List all services
router.get('/services', auth, async (_req, res) => {
  const services = await Service.find().sort({ name: 1 });
  res.json(services);
});

// Create a service
router.post('/services', auth, async (req, res) => {
  const { name, description = '', price = 0, requiredDocuments = [] } = req.body;
  const service = await Service.create({ name, description, price, requiredDocuments });
  res.json(service);
});

// Delete a service
router.delete('/services/:id', auth, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
