const WaitlistUser = require("../model/waitlist");
const { sendWaitlistEmail } = require("../utils/sendWailtlistEmail")

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

    if (newUser) {

      await sendWaitlistEmail(newUser)

      res.status(201).json({ message: "You have successfully joined the waitlist!" });

    } else {
      res.status(400).json({ message: "Error adding this user to the waitlist!" });


    }



  } catch (error) {
    console.error("Error adding user to waitlist:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const unsubscribeUser = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required to unsubscribe." });
  }

  try {
    const user = await WaitlistUser.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found in waitlist." });
    }

    return res.status(200).send(`
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }

    .container {
      max-width: 400px;
      width: 90%;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    .message {
      background: #f8d7da;
      padding: 15px;
      border-radius: 8px;
      color: #721c24;
      font-size: 18px;
    }

    .back-button {
      display: block;
      width: 100%;
      padding: 12px;
      margin-top: 20px;
      background: #4caf50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      text-align: center;
      transition: background 0.3s ease-in-out;
    }

    .back-button:hover {
      background: #388e3c;
    }

    @media (max-width: 480px) {
      .container {
        width: 95%;
      }
      
      .message {
        font-size: 16px;
        padding: 10px;
      }
      
      .back-button {
        font-size: 14px;
        padding: 10px;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="message">
      <h2>You have successfully unsubscribed.</h2>
      <p>We’re sorry to see you go!</p>
    </div>
    <a class="back-button" href="https://www.jarafi.xyz/">Go Back to Home</a>
  </div>

</body>
</html>
`);
  } catch (error) {
    console.error("Error unsubscribing user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = { joinWaitlist, unsubscribeUser };
