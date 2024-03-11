import { Router } from 'express';
import { sendEmail } from '../services/emailService.js';
import fetch from 'node-fetch';
const router = Router();
// contact prefix set in server.ts
router.post('/', async (req, res)=>{
    const { recaptchaResponse, name, email, phoneNumber, companyUrl, message } = req.body;
    // Verify recaptchaResponse with google's api
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
    try {
        const response = await fetch(verifyURL, {
            method: 'POST'
        });
        const data = await response.json(); // Not strict
        if (!data.success) {
            return res.status(400).send('reCAPTCHA verification failed');
        }
        const emailResult = await sendEmail({
            from: email,
            to: process.env.RECEIVER_EMAIL_SALES,
            subject: "Sales Demo Request",
            text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nCompany URL: ${companyUrl}\nMessage: \n${message}`
        });
        if (emailResult.success) {
            res.send(emailResult.message);
        } else {
            res.status(500).send(emailResult.message);
        }
    } catch (error) {
        console.error('Failed to submit form:', error);
        res.status(500).send('Server error');
    }
});
export default router;

//# sourceMappingURL=contactRoutes.js.map