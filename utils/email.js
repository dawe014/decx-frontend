import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or use SMTP for production
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    const htmlMessage = `
      <html>
        <body>
          <h2>Welcome to DECx!</h2>
          <p>Thank you for registering. Please click the button below to verify your account:</p>
          <a href="${message}" style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;">
            Verify Account
          </a>
          <br><br>
          <p>If you did not request this, please ignore this email.</p>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlMessage,
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
