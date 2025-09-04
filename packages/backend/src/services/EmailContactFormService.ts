import { Request, Response } from "express";
import nodemailer from "nodemailer";

const contactService = async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },

        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "@gmail.com",
            subject: `Contact from ${name} <${email}>`,
            text: message,
        });

        res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ success: false, error: "Failed to send email." });
    }
};

export default contactService;
