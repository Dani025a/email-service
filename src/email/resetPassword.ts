import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (email: string, resetToken: string, user: string) => {
  let resetUrl = "";

  if (user === "admin") {
    resetUrl = `http://localhost:2000/reset-password?token=${resetToken}`;
  } else {
    resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetUrl}`,
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};


