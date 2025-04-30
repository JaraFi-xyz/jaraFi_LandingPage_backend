const PwaUser = require("../model/pwauser")


const registerPwaUser = async (req, res) => {

    const { referenceId } = req.body;
  try {
    if (!referenceId) {
      return res.status(400).send({ error: 'referenceId is required' });
    }
    const existingUser = await PwaUser.findOne({ kycReferenceId: referenceId });
    if (existingUser) {
      return res.status(400).send({ error: 'referenceId already in use' });
    }
    const newUser = await PwaUser.create({
      kycReferenceId: referenceId,
      kycStatus: 'pending',
    });
    res.status(201).send({ userId: newUser._id, referenceId: newUser.kycReferenceId });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
    

}


const verifyPwaUser = async (req, res) => {

    try {
        const { status, reference_id, verification_id, data } = req.body;
    
        // Find user by reference_id
        const user = await PwaUser.findOne({ kycReferenceId: reference_id });
        if (!user) {
          console.error('User not found for referenceId:', reference_id);
          return res.status(404).send({ error: 'User not found' });
        }
    
        // Prepare update object
        const update = {
          kycStatus: status ? 'success' : 'failed',
          kycReferenceId: reference_id,
          verificationId: verification_id,
          verificationStatus: req.body.verification_status,
          updatedAt: new Date(),
        };
    
        // Process liveness check (data.selfie)
        if (data?.selfie) {
          update.livenessStatus = data.selfie.status;
          update.selfieUrl = data.selfie.data.selfie_url || null;
          if (!data.selfie.status) {
            console.log(`Liveness check failed for user ${user._id}`);
          }
        }
    
        // Process ID document (data.id)
        if (data?.id) {
          update.idStatus = data.id.status;
          update.idType = data.id.data.id_data.document_type || null;
          update.idNumber = data.id.data.id_data.document_number || null;
          update.idFirstName = data.id.data.id_data.first_name || null;
          update.idLastName = data.id.data.id_data.last_name || null;
          update.idDob = data.id.data.id_data.date_of_birth || null;
          update.idUrl = data.id.data.id_url || null;
          update.idBackUrl = data.id.data.back_url || null;
          if (!data.id.status) {
            console.log(`ID document verification failed for user ${user.kycReferenceId}`);
          }
        }
    
        // Process government data (NIN/BVN in data.government_data)
        if (data?.government_data) {
          update.governmentDataStatus = data.government_data.status;
          if (data.government_data.data?.bvn) {
            update.bvn = data.government_data.data.bvn.entity.bvn || null;
            update.bvnFirstName = data.government_data.data.bvn.entity.first_name || null;
            update.bvnLastName = data.government_data.data.bvn.entity.last_name || null;
            update.bvnDob = data.government_data.data.bvn.entity.date_of_birth || null;
          }
          if (data.government_data.data?.nin) {
            update.nin = data.government_data.data.nin.entity.nin || null;
            update.ninFirstName = data.government_data.data.nin.entity.firstname || null;
            update.ninLastName = data.government_data.data.nin.entity.surname || null;
            update.ninDob = data.government_data.data.nin.entity.birthdate || null;
          }
          if (!data.government_data.status) {
            console.log(`Government data (NIN/BVN) verification failed for user ${user.kycReferenceId}`);
          }
        }
    
        // Process FraudCheck AML (data.fraud_check)
        if (data?.fraud_check) {
          update.amlStatus = data.fraud_check.status;
          update.amlRiskScore = data.fraud_check.data?.risk_score || null;
          update.amlDetails = data.fraud_check.data?.details || null; // e.g., watchlist matches
          if (!data.fraud_check.status) {
            console.log(`AML screening failed for user ${user.kycReferenceId}, risk score: ${update.amlRiskScore}`);
          }
        }
    
        // Update user
        await PwaUser.updateOne({ _id: user._id }, update);
    
        console.log(`KYC updated for user ${user.kycReferenceId}: overall=${update.kycStatus}, liveness=${update.livenessStatus}, id=${update.idStatus}, government_data=${update.governmentDataStatus}, aml=${update.amlStatus}`);
    
        res.status(200).send({ status: 'received' });
      } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).send({ error: 'Internal server error' });
      }


}


const getPwaUser = async (req, res) => {

    try {
        const user = await PwaUser.findOne({kycReferenceId: req?.params?.referenceId});
        if (!user) {
          return res.status(404).send({ error: 'User not found' });
        }
        res.send({
          userId: user._id,
          kycStatus: user.kycStatus,
          livenessStatus: user.livenessStatus,
          idStatus: user.idStatus,
          governmentDataStatus: user.governmentDataStatus,
          amlStatus: user.amlStatus,
          amlRiskScore: user.amlRiskScore,
          idNumber: user.idNumber,
          idFirstName: user.idFirstName,
          idLastName: user.idLastName,
          bvn: user.bvn,
          nin: user.nin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ error: 'Internal server error' });
      }
}


module.exports = {getPwaUser, verifyPwaUser, registerPwaUser}