import ConnectDB from '@/DB/connectDB';
import User from '@/models/User';
import Joi from 'joi';
import { hash } from 'bcryptjs';
import nodemailer from 'nodemailer';

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required()
});

export default async (req, res) => {
    await ConnectDB();

    const { email, password, name } = req.body;
    const { error } = schema.validate({ email, password, name });

    if (error) return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const ifExist = await User.findOne({ email });
        
        if (ifExist) {
            return res.status(406).json({ success: false, message: "User Already Exists" });
        } else {
            const hashedPassword = await hash(password, 12);
            const createUser = await User.create({ email, name, password: hashedPassword });

            // Send registration email
            let resp=await sendRegistrationEmail(email, name);
            console.log(resp);

            return res.status(201).json({ success: true, message: "Account created successfully" });
        }
    } catch (error) {
        console.log('Error in register (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong, Please Retry Later!" });
    }
};

// Function to send registration email
const sendRegistrationEmail = async (toEmail, userName) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // e.g., 'gmail'
        auth: {
            user: "harshitmongia12@gmail.com",
            pass: "iryk bkfn ohsv kmxe"
        }
    });

    const mailOptions = {
        from: 'harshitmongia12@gmail.com',
        to: toEmail,
        subject: 'Registration Successful',
        text: `Dear ${userName},\nThank you for taking the time to register on the Kaamgar Shayak Junction website. \nWe are thrilled to welcome you to our community of empowered workers dedicated to supporting each other and advocating for positive change in the workplace.
        \nBest Regards,\nKaamgar Sahayak Junction(K.S.J.)`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Registration email sent successfully');
    } catch (error) {
        console.error('Error sending registration email:', error);
    }
};
