const sendWaitlistEmail = async (user) => {
  try {
    const filePath = path.join(__dirname, "EmailViews", "waitlistEmailTemplate.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);

    const replacements = {
      fullname: user.fullname?.split(" ")[0] || user.email.split("@")[0], 
      ctaLink: "https://www.jarafi.xyz/", 
      year: new Date().getFullYear(),
      unsubscribeLink: `https://jarafibackend.vercel.app/waitlist/unsubscribe?email=${encodeURIComponent(user.email)}` 
    };
    const htmlToSend = template(replacements);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "info@dltafrica.io", 
        pass: "btgc dtfh rjpm htgn"
      },
    });

    const mailConfigurations = {
      from: `"JaraFi" <info@dltafrica.io>`,
      to: user.email,
      subject: "Welcome to the Waitlist!",
      html: htmlToSend, 
    };

    await transporter.sendMail(mailConfigurations);
    console.log("Waitlist email sent successfully!");
  } catch (error) {
    console.error("Error sending waitlist email:", error.message);
  }
};

module.exports = { sendWaitlistEmail };
