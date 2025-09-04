import express from 'express';
const router = express.Router();

const ContributionArray = [
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" 
           stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-8 h-8 text-white">
           <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>`,
    title: "Time",
    description: "Volunteer as a mentor, advisor, or contributor to our mission",
    buttonText: "Contribute Time",
    link: "/contribute/time"
  },
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" 
           stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-8 h-8 text-white">
           <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
           </svg>`,
    title: "Funding",
    description: "Support our programs and help us scale our impact globally",
    buttonText: "Contribute Funding",
    link: "/contribute/funding"
  },
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" 
           stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-7 h-7 text-white">
           <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
           </svg>`,
    title: "Ideas",
    description: "Share innovative solutions and contribute to our knowledge base",
    buttonText: "Contribute Ideas",
    link: "/contribute/ideas"
  },
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" 
           stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-7 h-7 text-white">
           <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>`,
    title: "Problems",
    description: "Help us identify legal challenges that need technological solutions",
    buttonText: "Contribute Problems",
    link: "/contribute/problems"
  },
  {
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" 
           stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-7 h-7 text-white">
           <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
           </svg>`,
    title: "Connections",
    description: "Introduce us to key stakeholders in the legal tech ecosystem",
    buttonText: "Contribute Connections",
    link: "/contribute/connections"
  },
  
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: ContributionArray
  });
});

export default router;
