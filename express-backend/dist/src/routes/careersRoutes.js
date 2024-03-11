import { Router } from 'express';
import multer from 'multer';
import { sendEmail } from '../services/emailService.js';
const router = Router();
const upload = multer({
    dest: 'uploads/'
});
// careers prefix set in server.ts
router.post('/', upload.single('resume'), async (req, res)=>{
    const { recaptchaResponse, name, email, phoneNumber, skills, message } = req.body;
    const file = req.file; // file could be undefined
    if (!file) {
        return res.status(400).send('Resume file is required.');
    }
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
            to: process.env.RECEIVER_EMAIL_CAREERS,
            subject: "Website Career Inquiry",
            text: `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nSkills: \n${skills}\nMessage: \n${message}`,
            attachments: [
                {
                    filename: file.originalname,
                    path: file.path
                }
            ]
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

//# sourceMappingURL=careersRoutes.js.map