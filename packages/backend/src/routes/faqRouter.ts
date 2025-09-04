import { Router, Request, Response } from "express";

const faqRouter = Router();


const faqs = [
    {
      question: "What is your definition for JusticeTech tools?",
      answer: "The platform must serve individuals directly (B2C). It must help users deal with civil legal issues or processes, beyond just access to information. The primary service must be delivered through technology and manual or lawyer involvement should be minimal or optional, not required for core use."
    },
    {
      question: "What is JustLaw's mission?",
      answer: "JustLaw's mission is to democratize access to justice through technology innovation. We accelerate legal tech startups, connect stakeholders globally, and create solutions that make justice more accessible to everyone."
    },
    {
      question: "How can startups join the Global Accelerator?",
      answer: "Startups can apply through our online application process. We look for innovative legal technology solutions with global impact potential. Selected startups receive funding, mentorship, and access to our global network."
    },
    {
      question: "How does the Stakeholders Directory work?",
      answer: "Our directory connects legal professionals, investors, tech companies, and innovators worldwide. Members can find partners, collaborators, and experts in the legal technology ecosystem to drive innovation and growth."
    },
    {
      question: "What is JustLaw's expansion plan for Europe?",
      answer: "We're expanding our proven Israeli model to key European markets. This includes establishing local accelerator programs, building regional partnerships, and adapting our solutions to European legal systems."
    }
  ];

// GET /api/faqs
faqRouter.get("/", (req: Request, res: Response) => {
  res.json(faqs);
});

export default faqRouter;