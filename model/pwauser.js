const mongoose = require('mongoose');

const pwaUserSchema = new mongoose.Schema({
  kycStatus: { type: String, default: 'pending' }, // success, failed, pending
  kycReferenceId: { type: String, required: true, unique: true }, // Dojah reference_id
  verificationId: String, 
  verificationStatus: String, // e.g., Completed
  livenessStatus: Boolean, // true/false for liveness check
  selfieUrl: String, // Selfie image URL
  idStatus: Boolean, // true/false for ID document check
  idType: String, // e.g., National ID
  idNumber: String, // ID document number
  idFirstName: String,
  idLastName: String,
  idDob: String, // Date of birth from ID
  idUrl: String, // ID image URL
  idBackUrl: String, // Back of ID image URL
  governmentDataStatus: Boolean, // true/false for NIN/BVN
  bvn: String, // BVN number
  bvnFirstName: String,
  bvnLastName: String,
  bvnDob: String,
  nin: String, // NIN number
  ninFirstName: String,
  ninLastName: String,
  ninDob: String,
  amlStatus: Boolean, // true/false for AML screening
  amlRiskScore: Number, // AML risk score (0-100)
  amlDetails: Object, // AML screening details (e.g., watchlist matches)
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  
},

{
    timestamps: true,
}

);

const PwaUser = mongoose.model('pwaUser', pwaUserSchema);

module.exports = PwaUser