// routes/pillars.ts
import express from 'express';
const router = express.Router();

const acceleratorIcon = `
<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>
`;

const knowledgeIcon = `
<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13
    C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
</svg>
`;

const stakeholdersIcon = `
<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857
    M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0
    2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
</svg>
`;

router.get('/', (req, res) => {
    const pillarArray = [
        {
            title: "Global Accelerator",
            description: "Startup incubation, funding opportunities, and mentorship programs for legal tech innovators",
            items: [
                "6-month acceleration program",
                "€50K-500K funding rounds",
                "Global mentor network",
                "Market access support",
            ],
            link: "/accelerator",
            icon: acceleratorIcon,
        },
        {
            title: "Knowledge Hub",
            description: "Research, whitepapers, case studies, and best practices in legal technology",
            items: [
                "Industry insights",
                "Best practice guides",
                "Trend analysis",
                "Global case studies",
            ],
            link: "/knowledge-hub",
            icon: knowledgeIcon,
        },
        {
            title: "Stakeholders Directory",
            description: "Network of innovators, investors, legal professionals, and tech companies",
            items: [
                "Global network access",
                "Partnership opportunities",
                "Expert connections",
                "Collaboration tools",
            ],
            link: "/stakeholders-directory",
            icon: stakeholdersIcon,
        }
    ];

    res.json({ success: true, data: pillarArray });
});

export default router;
