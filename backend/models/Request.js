import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  applicant: {
    fullName: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    address: String
  },
  // schedule: {
  //   date: String,
  //   time: String
  // },
  utr: {
  type: String,
  required: true,
  unique: true, // since UTRs are unique in banking
  trim: true
}
,
  notes: String,
  documents: [{
    url: String,
    originalname: String,
    mimetype: String,
    size: Number
  }],
  status: {
    type: String,
    enum: ['Pending','Verified','Documents Needed','In Progress','Completed','Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);
