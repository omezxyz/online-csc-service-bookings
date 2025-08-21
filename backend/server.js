import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import Service from './models/Service.js';
import Admin from './models/Admin.js';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import requestsRoutes from './routes/requests.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;

async function seed() {
  const services = [
    {
      name: 'PAN Card Application',
      description: 'New PAN / Correction / Reprint',
      requiredDocuments: [
        'Aadhaar Card (Front & Back)',
        'Passport Size Photo',
        'Address Proof (if different)'
      ],
      price: 299
    },
    {
      name: 'Scholarship Application',
      description: 'State & central scholarship schemes assistance',
      requiredDocuments: [
        'Aadhaar Card',
        'Income Certificate',
        'Caste/Community Certificate (if applicable)',
        'Bank Passbook (first page)',
        'Recent Marksheet'
      ],
      price: 0
    },
    {
      name: 'Caste Certificate',
      description: 'Application for Caste Certificate',
      requiredDocuments: [
        'Father caste certificate',
        'Proof of Address (POA)',
        'Proof of Date of Birth'
      ],
      price: 149
    },
    {
      name: 'Income Certificate',
      description: 'Apply through e-district channel',
      requiredDocuments: [
        'Aadhaar Card',
        'Income Proof (salary slip/affidavit)',
        'Address Proof',
        'Passport Size Photo'
      ],
      price: 149
    }
  ];

  for (const svc of services) {
    const exists = await Service.findOne({ name: svc.name });
    if (!exists) {
      await Service.create(svc);
      console.log(`✅ Seeded: ${svc.name}`);
    }
  }

  // const admin = await Admin.findOne({ email: 'admin@osp.local' });
  // if (!admin) {
  //   await Admin.create({ email: 'admin@osp.local', passwordHash: await bcrypt.hash('OSP@fucking2025', 10) });
  //   console.log('✅ Seeded admin (admin@osp.local / OSP@fucking2025)');
  // }
  async function updateAdminPassword() {
  const newPassword = 'OSP@fucking2025'; // replace with desired password
  const admin = await Admin.findOne({ email: 'admin@osp.local' });

  if (!admin) {
    // If admin doesn't exist, create a new one
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await Admin.create({ email: 'admin@osp.local', passwordHash });
    console.log('✅ Created admin with new password');
  } else {
    // If admin exists, update password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await Admin.findByIdAndUpdate(admin._id, { passwordHash });
    console.log('✅ Admin password updated');
  }
}

updateAdminPassword().catch(console.error);
}

connectDB(process.env.MONGO_URI).then(async () => {
  if (process.argv.includes('--seed')) await seed();
  app.listen(PORT, () => console.log(`🚀 API listening on :${PORT}`));
});
