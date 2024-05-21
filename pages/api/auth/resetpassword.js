// server.js (Backend)

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());


app.post('/api/send-reset-password-email', async (req, res) => {
 console.log("hii");
 const email=req.body.email;
  try {
    await sendPasswordResetEmail(email);
    //console.log("hii1");
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

async function sendPasswordResetEmail(email) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      auth: {
        user: 'harshitmongia12@gmail.com', // your Gmail email
        pass: 'jvrv nnrn exzb cxmb' // your Gmail password or app-specific password
      }
    });

    await transporter.sendMail({
      from: '"Kaamgar Shayak Junction" <harshitmongia12@gmail.com>',
      to: email,
      subject: 'Password Reset',
      html: `
        <p>Hello,</p>
        <p>Please click the following link to reset your password:</p>
        <p><a href="http://localhost:3000/reset-password">Reset Password</a></p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      `
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/',(req,res)=>{
    res.send(`<h1>Server is started`);
})