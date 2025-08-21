// import express from 'express';
// import Service from '../models/Service.js';
// import Joi from 'joi';
// import { auth } from '../middleware/auth.js';

// const router = express.Router();

// router.get('/', async (_req, res) => {
//   const items = await Service.find().sort({ name: 1 });
//   res.json(items);
// });

// const schema = Joi.object({
//   name: Joi.string().required(),
//   description: Joi.string().allow(''),
//   requiredDocuments: Joi.array().items(Joi.string()).default([]),
//   price: Joi.number().min(0).default(0)
// });

// router.post('/', auth, async (req, res) => {
//   const { value, error } = schema.validate(req.body);
//   if (error) return res.status(400).json({ error: error.message });
//   const item = await Service.create(value);
//   res.json(item);
// });

// router.put('/:id', auth, async (req, res) => {
//   const { value, error } = schema.validate(req.body);
//   if (error) return res.status(400).json({ error: error.message });
//   const item = await Service.findByIdAndUpdate(req.params.id, value, { new: true });
//   res.json(item);
// });

// export default router;
import express from 'express';
import Service from '../models/Service.js';
import Joi from 'joi';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const items = await Service.find().sort({ name: 1 });
  res.json(items);
});

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  requiredDocuments: Joi.array().items(Joi.string()).default([]),
  price: Joi.number().min(0).default(0)
});

router.post('/', auth, async (req, res) => {
  const { value, error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const item = await Service.create(value);
  res.json(item);
});

router.put('/:id', auth, async (req, res) => {
  const { value, error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const item = await Service.findByIdAndUpdate(req.params.id, value, { new: true });
  res.json(item);
});

// ✅ DELETE service
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
