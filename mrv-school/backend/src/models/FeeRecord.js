const mongoose = require('mongoose');

// Fee ledger entry. NOTE: this is a record-keeping model, not a live payment
// gateway — status is set by admin (offline payment recorded) rather than a
// checkout flow. See backend README for what a real online-payment
// integration would additionally require.
const schema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    academicYear: { type: String, required: true },
    term: { type: String, required: true }, // e.g. "Term 1", "Annual"
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending', index: true },
    paidAmount: { type: Number },
    paidDate: { type: Date },
    paymentMode: { type: String }, // cash, cheque, bank-transfer, etc.
    receiptUrl: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);
schema.index({ student: 1, academicYear: 1, term: 1 }, { unique: true });
module.exports = mongoose.model('FeeRecord', schema);
