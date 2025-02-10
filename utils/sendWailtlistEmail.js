const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const sendWaitlistEmail = async (user) => {
  try {
    // Read the HTML template
    const filePath = path.join(__dirname, "EmailViews", "waitlistEmailTemplate.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);

    // Dynamic content replacements
    const replacements = {
      fullname: user.fullname?.split(" ")[0] || user.email.split("@")[0], // Extract first name or fallback to email username
      ctaLink: "https://www.jarafi.xyz/", // Link for the CTA button
      year: new Date().getFullYear(), // Current year
    };
    const htmlToSend = template(replacements);

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@dltafrica.io",
        pass: "btgc dtfh rjpm htgn"
      },
    });

    // Mail options
    const mailConfigurations = {
      from: `"JaraFi" info@dltafrica.io`,
      to: user.email,
      subject: "Welcome to the Waitlist!",
      html: htmlToSend, // Use the compiled HTML
    };

    // Send email
    await transporter.sendMail(mailConfigurations);
    console.log("Waitlist email sent successfully!");
  } catch (error) {
    console.error("Error sending waitlist email:", error.message);
  }
};

module.exports = { sendWaitlistEmail };
