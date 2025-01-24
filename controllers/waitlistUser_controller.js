const WaitlistUser = require("../model/waitlist");
const {sendWaitlistEmail} = require("../utils/sendWailtlistEmail")

const joinWaitlist = async (req, res) => {
  const { fullname, email } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await WaitlistUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "You are already on the waitlist!" });
    }

    // Create new waitlist user
    const newUser = await WaitlistUser.create({ fullname, email });

    if(newUser) {

       await  sendWaitlistEmail(newUser)

       res.status(201).json({ message: "You have successfully joined the waitlist!" });

    }else {
        res.status(400).json({ message: "Error adding this user to the waitlist!" });


    }
    

    
  } catch (error) {
    console.error("Error adding user to waitlist:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { joinWaitlist };
