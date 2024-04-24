import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { join } from 'path';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// console.log(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, verificationToken) => {
    console.log(verificationToken);
	const msg = {
		to: email,
		from: 'cherevko.rg@gmail.com',
		subject: 'Email Verification',
		text: `Please click the following link to verify your email: /users/verify/${verificationToken}`,
		html: `<p>Please click the following link to verify your email: <a href="https://localhost:3000/api/users/verify/:${verificationToken}">Verify Email</a></p>`,
	};

	try {
		await sgMail.send(msg);
		console.log('Email sent successfully');
	} catch (error) {
		console.error('Error sending email:', error.response.body);
	}
};

export default sendVerificationEmail;
