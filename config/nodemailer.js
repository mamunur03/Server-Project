const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendPasswordResetEmail = async (email, token) => {
    console.log('Recipient Email:', email);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'emailsend349@gmail.com',
        pass: process.env.mail_pass,
      },
    });

    
    await transporter.sendMail({
      from: 'emailsend349@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Hi, your OTP for password update is ${token}`,
      html: `<p>Hi,</p><p>Your OTP for password update is ${token}</p>`,
    });

    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Email not sent!');
    console.error(error);
    return error;
  }
};

module.exports = sendPasswordResetEmail;