/**
 * OrbitWorks content.
 *
 * Carried over from the Vivacity Solutions site (same company — rebrand), with
 * the name swapped. Anything factual (stats, testimonials, team, offices) is
 * kept verbatim rather than invented; if a number moves, change it here.
 */

export const BRAND = {
  name: "OrbitWorks",
  tagline: "Your business, in orbit.",
  /** \n becomes <br/>; FadeText splits the rest per character. */
  headline: "AI-Powered IT Solutions\nThat Actually\nMove the Needle",
  intro:
    "OrbitWorks is a leading AI automation and IT services company in USA, helping businesses scale through intelligent automation, cloud infrastructure, custom software, and data-driven marketing — all aligned with your business goals.",
  supporting:
    "From strategy to execution, we're the IT solutions company that turns complexity into competitive advantage.",
  email: "sales@orb-itworks.com",
  phone: "+1 443 260 9169",
  footerAbout:
    "OrbitWorks is a premier AI automation and IT services company in USA, delivering innovative solutions in software development, cloud infrastructure, artificial intelligence, and digital marketing. We partner with businesses of all sizes to build scalable technology strategies that drive measurable growth.",
} as const;

/** Countries/regions served — used by the Organization JSON-LD. */
export const SERVICES_JSONLD_AREA = ["United States", "Canada"];

/** Section copy, kept here so the page files stay structural. */
export const SECTIONS = {
  trustEyebrow: "Trusted by innovative companies across the United States",
  trustBody:
    "OrbitWorks has earned its reputation as a trusted IT services company by delivering results that speak for themselves. From bootstrapped startups to enterprise brands, our clients rely on us for AI automation and IT services in USA that drive real growth. We're not just another IT solutions company — we're a strategic partner that understands technology is only as valuable as the business outcomes it unlocks. Our track record spans manufacturing, healthcare, fintech, SaaS, and professional services, making us one of the most versatile IT consulting services companies in the market today.",
  pillarsHeading: "Everything We Do",
  pillarsIntro:
    "One partner for all the technology your business needs — AI automation, digital marketing, cloud infrastructure, and on-demand tech talent, under one strategy.",
  industriesHeading: "Industries We Empower",
  industriesIntro:
    "OrbitWorks brings deep domain expertise to every engagement. We've helped businesses across these industries solve complex challenges and unlock new growth through AI automation and IT services in the USA.",
  casesHeading: "Real Results. Proven Impact.",
  casesIntro:
    "Here's what happens when you partner with an IT solutions company that actually delivers. These are just a few examples of how OrbitWorks helps businesses turn technology investments into measurable outcomes.",
  whyHeading: "Why Companies Choose OrbitWorks",
  whyIntro:
    "In a crowded market of IT services companies, what makes OrbitWorks different? It's not just our technical expertise, though that certainly helps. It's our commitment to outcomes over outputs, partnerships over projects, and results over rhetoric. We're the AI automation and IT services company in USA that actually shows up, listens, and delivers.",
  approachHeading: "Our Approach: From Idea to Impact",
  approachBody:
    "Every engagement follows a proven framework that keeps us aligned with your goals, your timeline, and your budget. We don't believe in one-size-fits-all — but we do believe in a process that works.",
  ctaHeading: "Ready to Build Something Remarkable?",
  ctaBody:
    "Join the growing list of businesses that trust OrbitWorks for AI automation and IT services in USA. Let's talk about your goals, your challenges, and how we can help you get where you're going — faster.",
} as const;

export type Pillar = {
  slug: string;
  title: string;
  summary: string;
  /** Revealed on hover — see PillarGrid. */
  points: string[];
  image: string;
  poster?: string;
};

/**
 * The six capabilities on the homepage. /services still lists all thirteen
 * (SERVICES below) — this is the shortlist the SEO copy calls "core pillars".
 */
export const PILLARS: Pillar[] = [
  {
    slug: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    summary:
      "Design, migrate, and optimize cloud environments with secure and scalable architectures. Our IT consulting company ensures performance, cost efficiency, and long-term growth.",
    points: [
      "Cloud migration strategy",
      "DevOps & CI/CD enablement",
      "Infrastructure as code",
      "Monitoring & cost optimization",
      "Disaster recovery",
    ],
    image: "/media/2024/05/cloud.jpg",
  },
  {
    slug: "software-development",
    title: "Software Development",
    summary:
      "Build high-performance web and mobile applications with seamless user experiences. As an IT company in software development, we create scalable, future-ready solutions.",
    points: [
      "Web & mobile development",
      "Custom software delivery",
      "API & microservices",
      "UI/UX and product design",
    ],
    image: "/media/2024/05/development.jpg",
  },
  {
    slug: "data-ai",
    title: "Data & AI",
    summary:
      "Turn data into actionable insights using advanced analytics, BI, and AI solutions. Our professional IT solutions provider enables smarter decision-making through data intelligence.",
    points: [
      "Data engineering",
      "BI dashboards & reporting",
      "Predictive analytics",
      "GenAI & automation",
    ],
    image: "/media/2024/05/ai.mp4",
    poster: "/media/2024/05/data.jpg",
  },
  {
    slug: "platforms",
    title: "Platforms",
    summary:
      "Streamline operations with enterprise platforms, ERP systems, and workflow automation tailored to business needs.",
    points: [
      "Enterprise platform setup",
      "ERP & Dynamics 365",
      "Workflow automation",
      "Cross-platform integrations",
    ],
    image: "/media/2024/05/product.jpg",
  },
  {
    slug: "marketing",
    title: "Marketing",
    summary:
      "Drive growth with performance marketing, SEO, and conversion-focused campaigns designed for measurable ROI.",
    points: [
      "Search engine optimisation (SEO)",
      "Performance & paid media",
      "Content marketing",
      "Conversion rate optimisation",
    ],
    image: "/media/2024/05/marketing.jpg",
  },
  {
    slug: "staff-augmentation",
    title: "Staff Augmentation",
    summary:
      "Access top-tier tech talent to scale your team quickly and efficiently with flexible engagement models.",
    points: [
      "On-demand IT experts",
      "Dedicated remote teams",
      "Skill-specific hiring",
      "Short & long-term engagement",
    ],
    // Reused from the image cluster — this pillar wants its own photo.
    image: "/media/2024/05/11.jpg",
  },
];

/** "Why choose us" — the SEO copy's five proof points. */
export const WHY = [
  {
    title: "End-to-End Expertise",
    body: "From strategy and architecture to development, deployment, and ongoing support, we handle the entire lifecycle. You don't need to juggle multiple vendors. We're your one-stop IT solutions company.",
  },
  {
    title: "Scalable Solutions",
    body: "We build for tomorrow, not just today. Our solutions grow with your business, so you're never left rebuilding what you just built.",
  },
  {
    title: "Deep Industry Experience",
    body: "We've worked across manufacturing, healthcare, fintech, SaaS, logistics, and more. We understand the unique challenges of your industry and bring proven solutions to the table.",
  },
  {
    title: "Agile Delivery",
    body: "Fast doesn't mean reckless. We ship working software early and often, gathering feedback and iterating continuously. No waterfall delays. No surprises.",
  },
  {
    title: "Global Delivery Model",
    body: "Our distributed teams work seamlessly across time zones, so your project keeps moving, even while you sleep. We combine the best of onshore strategy with global execution.",
  },
];

/** The four-step process. */
export const APPROACH = [
  {
    step: "Discover & Strategize",
    body: "We start by understanding your business, your challenges, and your vision. We conduct stakeholder interviews, assess your current technology landscape, and identify the highest-impact opportunities.",
  },
  {
    step: "Design & Develop",
    body: "We design solutions that are intuitive, scalable, and built to last. Our developers write clean, maintainable code, and our designers create experiences your users will love.",
  },
  {
    step: "Deploy & Optimize",
    body: "We launch with precision, monitor performance in real time, and make data-driven adjustments. Deployment isn't the finish line — it's where the real work begins.",
  },
  {
    step: "Scale & Grow",
    body: "As your business evolves, so do we. We continuously optimize, add features, and expand capabilities to keep you ahead of the curve.",
  },
];

/** Headline outcomes for the homepage case strip. */
export const CASE_RESULTS = [
  {
    title: "Cloud Transformation for a Manufacturing Firm",
    result: "Infrastructure costs reduced by 40% year-over-year",
    sector: "Manufacturing",
  },
  {
    title: "AI-Powered Analytics for Healthcare",
    result: "Clinical decision-making speed improved by 60%",
    sector: "Healthcare",
  },
  {
    title: "Custom SaaS Platform Development",
    result: "User engagement increased by 3X in the first quarter",
    sector: "SaaS & Technology",
  },
];

/**
 * Social accounts.
 *
 * EMPTY ON PURPOSE. The theme shipped with Kenza's own Instagram/LinkedIn
 * hard-coded; pointing those at OrbitWorks' footer would send your visitors to
 * a different agency. The footer hides the block while this is empty — add the
 * real handles and it reappears.
 */
export const SOCIAL: { label: string; href: string; cls: string }[] = [];

export type Service = {
  slug: string;
  title: string;
  summary: string;
  points: string[];
  /**
   * Card art — a still, or an .mp4/.webm loop (ServiceMedia picks the element).
   * Only the first six carry art (the set shown on the homepage); the rest
   * render as type-only cards on /services.
   */
  image?: string;
  /** First frame for video art, so the card isn't blank before playback. */
  poster?: string;
};

/** Digital marketing leads — it is the growth line the rebrand is built around. */
export const SERVICES: Service[] = [
  {
    slug: "digital-marketing",
    title: "Digital marketing",
    summary:
      "Demand that compounds. Search, social and paid working off one strategy and one set of numbers.",
    points: [
      "Search engine optimisation (SEO)",
      "Social media marketing (SMM)",
      "Pay-per-click (PPC)",
      "Online reputation management (ORM)",
      "Content marketing",
    ],
    image: "/media/2024/05/marketing.jpg",
  },
  {
    slug: "software-development",
    title: "Software development",
    summary:
      "Product teams that ship. Web, mobile and the services behind them, built to be handed over.",
    points: [
      "Web & mobile development",
      "Custom software delivery",
      "API & microservices",
      "UI/UX and product design",
    ],
    image: "/media/2024/05/development.jpg",
  },
  {
    slug: "ai-automation",
    title: "AI automation & GenAI",
    summary:
      "Automation with a business case attached — scoped against the work it removes, not the hype.",
    points: [
      "AI strategy & consulting",
      "Custom AI development",
      "NLP, chatbots & GenAI",
      "Computer vision solutions",
    ],
    // Loop rather than a still; re-encoded from 4K/22MB down to ~0.2MB.
    image: "/media/2024/05/ai.mp4",
    poster: "/media/2024/05/data.jpg",
  },
  {
    slug: "cloud-modernisation",
    title: "Cloud migration & modernisation",
    summary:
      "Move without the outage. Migration, automation and the pipelines to keep it moving after.",
    points: [
      "Cloud migration strategy",
      "DevOps & CI/CD enablement",
      "Cloud automation & IaC",
      "Monitoring & optimisation",
      "IaaS/PaaS, storage & disaster recovery",
    ],
    image: "/media/2024/05/cloud.jpg",
  },
  {
    slug: "data-ai",
    title: "Data & AI solutions",
    summary: "The reporting layer that makes the rest measurable.",
    points: [
      "Data engineering",
      "BI dashboards & reporting",
      "Predictive analytics",
      "Data lake architecture",
    ],
    image: "/media/2024/05/data.jpg",
  },
  {
    slug: "product-development",
    title: "Product development as a service",
    summary: "From MVP to a product with a roadmap — a full team, without the hiring cycle.",
    points: [
      "MVP development",
      "Custom software & SaaS",
      "Software modernisation",
      "Full team model",
    ],
    image: "/media/2024/05/product.jpg",
  },
  {
    slug: "web-development",
    title: "Custom website development",
    summary: "Sites that load fast, rank, and are handed over in a state you can edit.",
    points: ["Custom website design", "WordPress", "Ecommerce", "Shopify", "Wix"],
  },
  {
    slug: "mobile-development",
    title: "Custom mobile app development",
    summary: "One codebase where it makes sense, native where it doesn't.",
    points: ["Flutter", "Native iOS", "Native Android"],
  },
  {
    slug: "crm",
    title: "CRM services",
    summary: "A pipeline your sales team actually uses, wired to the marketing that feeds it.",
    points: [
      "Setup & onboarding",
      "Sales pipeline automation",
      "Workflow integrations",
      "Reporting dashboards",
      "Lead lifecycle optimisation",
    ],
  },
  {
    slug: "power-platform",
    title: "Power Platform & Dynamics 365",
    summary: "Enterprise plumbing — the integrations that stop the copy-paste.",
    points: [
      "Enterprise platform setup",
      "Cross-platform integrations",
      "Automation and orchestration",
      "Scalable system connectivity",
    ],
  },
  {
    slug: "staff-augmentation",
    title: "Staff augmentation",
    summary: "Senior people, on your board, this month.",
    points: [
      "On-demand IT experts",
      "Project staffing",
      "Dedicated remote teams",
      "Skill-specific hiring",
      "Short & long-term engagement",
    ],
  },
  {
    slug: "it-consulting",
    title: "IT consulting & strategy",
    summary: "The roadmap before the spend.",
    points: [
      "IT roadmap & planning",
      "Technology assessment",
      "Digital transformation strategy",
      "Security & compliance advisory",
    ],
  },
  {
    slug: "website-maintenance",
    title: "Website maintenance",
    summary: "The unglamorous half — kept patched, backed up and fast.",
    points: [
      "Content updates",
      "Security monitoring",
      "Performance optimisation",
      "Backup and restoration",
      "Troubleshooting",
      "SEO maintenance",
    ],
  },
];

export const INDUSTRIES = [
  { name: "Manufacturing", note: "Operations visibility and the systems under it." },
  { name: "Healthcare & Life Sciences", note: "Patient-facing digital that clears compliance." },
  { name: "Transport & Logistics", note: "Tracking, routing and integration." },
  { name: "Professional Services", note: "Pipeline, proposals and authority content." },
  { name: "SaaS & Technology", note: "Product engineering, onboarding and retention." },
  { name: "Real Estate", note: "Listings, portals and the CRM behind them." },
  { name: "Education & EdTech", note: "Learning platforms and enrolment journeys." },
  {
    name: "Financial Services & Fintech",
    note: "Secure workflows and reporting that stands up to audit.",
  },
  { name: "Hospitality", note: "Booking, ordering and local search." },
  { name: "Sports & Fitness", note: "Membership, booking and retention." },
  { name: "Construction & Engineering", note: "Project tracking, documents and field-to-office flow." },
  { name: "Retail & E-Commerce", note: "Storefronts, checkout and the data behind them." },
  { name: "Energy & Utilities", note: "Asset monitoring, reporting and field operations." },
  { name: "Nonprofit & Public Sector", note: "Service delivery on a constrained budget." },
];

/** Deep-dive spotlights on the industries page. */
export const INDUSTRY_SPOTLIGHTS = [
  {
    name: "Healthcare & Life Sciences",
    body: "Healthcare runs on data, but it's drowning in silos. Providers struggle with interoperability, patient engagement, and administrative overhead. We deliver IT Solutions USA that unify electronic health records, automate prior authorizations using NLP, and build HIPAA-compliant patient portals that actually get used.",
    points: [
      "AI-powered clinical decision support",
      "Secure cloud migrations for sensitive patient data",
      "Automated billing and claims processing",
      "Telehealth platforms with seamless EHR integration",
    ],
  },
  {
    name: "Manufacturing & Industrial",
    body: "Margins are thin. Downtime is expensive. Quality control is non-negotiable. Our IT Solutions USA for manufacturing focus on predictive maintenance, supply chain visibility, and shop-floor automation.",
    points: [
      "Computer vision for real-time defect detection",
      "IoT sensor integration for equipment monitoring",
      "Cloud-based inventory and logistics management",
      "Custom MES (Manufacturing Execution Systems)",
    ],
  },
  {
    name: "Financial Services & Fintech",
    body: "Security, speed, and trust are everything. Banks, insurers, and fintech startups need IT Solutions USA that can handle massive transaction volumes while staying ahead of evolving threats.",
    points: [
      "Fraud detection using behavioral analytics",
      "Automated KYC and AML compliance workflows",
      "Real-time risk assessment dashboards",
      "Secure mobile and web banking platforms",
    ],
  },
  {
    name: "Transportation & Logistics",
    body: "Supply chains are more fragile than ever. Visibility and agility separate the winners from the rest. We deliver IT Solutions USA that optimize routing, track shipments in real time, and reduce fuel costs.",
    points: [
      "AI-driven route optimization",
      "Warehouse automation and robotics integration",
      "Real-time fleet tracking and telematics",
      "Predictive analytics for demand forecasting",
    ],
  },
  {
    name: "SaaS & Technology",
    body: "Hyper-growth requires hyper-scalable infrastructure. Tech companies need IT Solutions USA that can handle millions of users without breaking the bank or the user experience.",
    points: [
      "Cloud-native architecture and microservices",
      "CI/CD pipeline automation",
      "Product analytics and user behavior tracking",
      "Scalable backend systems for B2B and B2C platforms",
    ],
  },
  {
    name: "Professional Services & Consulting",
    body: "Time is literally money. Law firms, accounting practices, and consultancies need IT Solutions USA that streamline client onboarding, document management, and collaboration.",
    points: [
      "Secure client portals and document exchange",
      "Automated time tracking and invoicing",
      "CRM and practice management integrations",
      "AI-powered contract analysis and due diligence",
    ],
  },
];

export const STATS = [
  { value: 50, suffix: "", label: "Clients in 10+ countries" },
  { value: 25, suffix: "+", label: "Projects completed" },
  { value: 50, suffix: "", label: "Specialists on the team" },
  { value: 100, suffix: "", label: "Five-star reviews" },
];

export type Testimonial = {
  quote: string;
  client: string;
  sector: string;
  /**
   * Client logo in public/brand/clients/. Optional — TestimonialCard falls back
   * to a monogram when the file is absent, so adding the real logo file is the
   * only step needed to switch a card over.
   */
  logo?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "OrbitWorks delivered the right talent exactly when we needed it. Their staff augmentation service helped us move faster while maintaining the high standards our clients expect.",
    client: "Zaawia",
    sector: "Staff augmentation",
    logo: "/brand/clients/zaawia.png",
  },
  {
    quote:
      "OrbitWorks streamlined our patient communication with AI automations that save our team valuable time every day. The implementation was smooth, and the solutions fit naturally into our workflow.",
    client: "Kidney Wellness Clinic",
    sector: "Healthcare",
    logo: "/brand/clients/kidney-wellness-clinic.png",
  },
  {
    quote:
      "OrbitWorks completely transformed our online presence. The new website looks fantastic, and their SEO and digital marketing have helped us reach more local customers and generate more orders.",
    client: "Dock Pizza",
    sector: "Hospitality",
    logo: "/brand/clients/dock-pizza.png",
  },
  {
    quote:
      "OrbitWorks transformed our digital presence with effective marketing, SEO, and lead generation strategies. Their professionalism and commitment have made them a trusted partner for our business growth.",
    client: "A&B Travels",
    sector: "Travel",
    logo: "/brand/clients/ab-travels.png",
  },
  {
    quote:
      "OrbitWorks understands how to turn complex cybersecurity offerings into clear, impactful digital communication. Their strategic marketing support has helped strengthen our brand presence and connect us with the audiences that matter most.",
    client: "Advanzatech",
    sector: "Cybersecurity",
    logo: "/brand/clients/advanzatech.png",
  },
  {
    quote:
      "OrbitWorks built a custom software solution that simplified our processes and improved efficiency across our operations. Reliable team, quality work, and excellent support.",
    client: "M Maqsood and Co",
    sector: "Professional services",
    logo: "/brand/clients/m-maqsood-and-co.png",
  },
  {
    quote:
      "Unified Risk Solutions LLC	Working with OrbitWorks was a seamless experience from start to finish. They took the time to understand our business and delivered a custom solution that aligned perfectly with our goals and continues to add value every day.",
    client: "Unified Risk Solutions LLC",
    sector: "Professional services",
    logo: "/brand/clients/unified risk.png",
  },
  {
    quote:
      "Gravity BPO LLC	OrbitWorks transformed the way we manage our operations with a CRM built around our business. Professional team, smooth implementation, and results we noticed immediately.",
    client: "Gravity BPO LLC",
    sector: "Professional services",
    logo: "/brand/clients/gravity.png",
  },
];

/** Marquee runs client names as type — we have no rights-cleared logo files. */
export const CLIENTS = TESTIMONIALS.map((t) => t.client);

export const TEAM = [
  
  { name: "Muhammad Haider", role: "COO" },
  { name: "Muhammad Anis", role: "CFO" },
  { name: "Muhammad Irfan", role: "IT Manager" },
  { name: "Shaheer Arish", role: "CRM Operational Manager" },
];

export const OFFICES = [
  { country: "United States", city: "Baltimore", address: "Baltimore, MD, USA" },
  { country: "Canada", city: "Toronto", address: "100 King St W, Suite 5600, ON M5X 1A9" },
];

export const PRODUCTS = [
  {
    name: "Vivalex",
    status: "Coming soon",
    summary: "In development. Details to follow.",
  },
  {
    name: "Vivalid",
    status: "Coming soon",
    summary: "In development. Details to follow.",
  },
];

/** Case studies are drawn from the testimonial set — same engagements. */
export const CASE_STUDIES = [
   {
    slug: "AB-Travels",
    client: "AB-Travels",
    title: "A brand, reflected properly",
    sector: "Vending",
    image: "/brand/testimonials/ab.jpeg",
  },
  {
    slug: "M Maqsood-and-Co",
    client: "M Maqsood-and-Co",
    title: "A technical services business, properly online",
    sector: "Technical services",
    image: "/brand/testimonials/maqsod.jpeg",
  },
  {
    slug: "Advanzatech",
    client: "Advanzatech Distribution delivers trusted cybersecurity solutions",
    title: "High performance, on and off the page",
    sector: "Powersports",
    image: "/brand/testimonials/aztech.jpeg",
  },
  {
    slug: "aroujo-kidney-wellness",
    client: "Aroujo Kidney Wellness",
    title: "Healthcare that reads as trustworthy",
    sector: "Healthcare",
    image: "/brand/testimonials/kidney.jpeg",
  },
  {
    slug: "pizza-hub",
    client: "Pizza Hub",
    title: "Menu, ordering and mobile in one flow",
    sector: "Hospitality",
    image: "/brand/testimonials/pizza.jpeg",
  }
 ,
];

export const RESOURCES = [
  {
    title: "The digital marketing audit checklist",
    kind: "Checklist",
    summary: "What we run before proposing spend — search, social, paid and analytics.",
  },
  {
    title: "Cloud migration: a readiness guide",
    kind: "Guide",
    summary: "The questions worth answering before anything moves.",
  },
  {
    title: "Choosing an AI use case that pays",
    kind: "Guide",
    summary: "Scoping automation against the work it removes.",
  },
  {
    title: "CRM lifecycle templates",
    kind: "Template",
    summary: "Pipeline stages and automations we deploy on day one.",
  },
];

export type Post = {
  slug: string;
  title: string;
  date: string;
  kind: string;
  excerpt: string;
  author: string;
  readingMinutes: number;
  /** PLACEHOLDER art — Kenza renders from public/media, not OrbitWorks imagery. */
  image: string;
  /** Body paragraphs. A string starting with "## " renders as a subheading. */
  body: string[];
};

export const BLOGS: Post[] = [
  {
    slug: "seo-that-compounds",
    title: "SEO that compounds",
    date: "2026-06-18",
    kind: "Digital marketing",
    excerpt: "Why the ranking you buy disappears and the one you earn does not.",
    author: "OrbitWorks",
    readingMinutes: 4,
    image: "/media/2024/05/Services-Brand-and-Experience-Design.jpg",
    body: [
      "Every few months a client asks us to “do SEO” as though it were a switch. It isn’t, and the reason matters: search rankings are a lagging indicator of something else. They measure whether the rest of your business is legible to a machine that is trying to answer a question on someone’s behalf.",
      "## Rented versus owned",
      "Paid placement is rented. The moment the card stops, the traffic stops with it, and nothing you paid for accrues. That is not an argument against paid — it is an argument for knowing which line item you are funding. Rented attention buys you time. It does not compound.",
      "Earned position behaves differently. A page that genuinely answers a question keeps answering it, gets linked to because it is useful, and the links make the next page rank faster. The second year is cheaper than the first. That is the whole case.",
      "## What we actually audit",
      "Before we propose spend, we look at four things: what the site is technically able to say about itself, what it actually says, who else says it, and whether the thing being said is true. In that order. Most engagements stall on the fourth.",
      "The uncomfortable finding is usually that the content is fine and the proposition isn’t. No amount of internal linking fixes a page that has nothing to tell anyone.",
      "## Where it goes wrong",
      "Teams optimise for the report rather than the reader. Rankings go up, sessions go up, and the pipeline does not move, because the traffic arriving was never going to buy anything. If your reporting cannot connect a keyword to a conversation with a human, it is measuring weather, not climate.",
      "Start with the questions your best customers asked before they signed. Answer those properly. The rankings are a side effect.",
    ],
  },
  {
    slug: "ppc-without-the-leak",
    title: "PPC without the leak",
    date: "2026-05-27",
    kind: "Digital marketing",
    excerpt: "Most paid budgets fail on the landing page, not the bid.",
    author: "OrbitWorks",
    readingMinutes: 3,
    image: "/media/2024/05/Services-Business-Innovation-Design.jpg",
    body: [
      "When a paid campaign underperforms, the first instinct is to open the bidding strategy. That is almost never where the money is going.",
      "## The leak is downstream",
      "A click is a promise. The ad makes it and the landing page either keeps it or doesn’t. If the ad says one thing and the page opens on a different one, the visitor leaves — and you were charged either way. Sharpening the bid on a leaking page just buys more expensive water.",
      "We usually find the mismatch in the first six words of the headline. The ad answers a question; the page introduces the company.",
      "## Measure the conversation, not the click",
      "Optimising to clicks optimises for people who click. Optimising to qualified conversations optimises for revenue. Those are different populations and they respond to different creative. Wire the CRM before you raise the budget, or you will scale the wrong one.",
      "## A reasonable order of work",
      "Fix the page. Wire the reporting to a human outcome. Cut the keywords that never produced a conversation. Then, and only then, talk about spend. In that order the budget question usually answers itself.",
    ],
  },
  {
    slug: "genai-in-production",
    title: "GenAI in production",
    date: "2026-04-30",
    kind: "AI",
    excerpt: "What changes between the demo and the thing customers touch.",
    author: "OrbitWorks",
    readingMinutes: 5,
    image: "/media/2024/05/Services-Applied-Research.jpg",
    body: [
      "The demo always works. That is what a demo is for. The gap between it and production is not model quality — it is everything around the model.",
      "## The demo is a happy path",
      "In a demo, someone who built the thing types a well-formed question and reads a plausible answer. In production, a stranger types half a sentence, the context is missing, the upstream service is slow, and the answer has to be either right or visibly uncertain. Most of the engineering is in that second sentence.",
      "## Scope against the work removed",
      "The use cases that survive are the ones attached to a task somebody currently does by hand and dislikes. Those have a measurable before, which means they have a defensible after. “Add AI to the product” has neither and tends to quietly expire.",
      "## Failure has to be designed",
      "Decide in advance what happens when the model is wrong, because it will be. Is it a suggestion a human accepts, or an action the system takes? The first needs a good interface. The second needs an audit trail, a rollback and someone accountable. Confusing them is how these projects get pulled.",
      "## Evaluation before scale",
      "You need a way to tell whether a change made things better that is not one person’s impression on a Tuesday. A small, honest evaluation set built from real inputs beats a large synthetic one. Build it early; it is the thing that lets you move fast later.",
    ],
  },
  {
    slug: "migrating-without-downtime",
    title: "Migrating without downtime",
    date: "2026-03-19",
    kind: "Cloud",
    excerpt: "Sequencing a migration so the business never notices.",
    author: "OrbitWorks",
    readingMinutes: 4,
    image: "/media/2024/05/Services-Metaverse-Design-and-Development.jpg",
    body: [
      "A migration is a sequencing problem wearing an infrastructure costume. The hard part is not moving the workload; it is moving it while people are using it.",
      "## Move the boring things first",
      "Start with what has the fewest dependencies and the least revenue attached. It is not the interesting work, but it is where you find out that the runbook is wrong — and you would rather find that out on a service nobody is watching.",
      "## Two of everything, briefly",
      "For a window, the old and new both run and both are correct. That costs money and it is worth it: it turns a cutover into a switch you can flip back. If you cannot flip back, you do not have a migration plan, you have a launch date.",
      "## Watch the thing customers feel",
      "Instrument the user-facing metric, not just the infrastructure one. CPU can look perfect while checkout is failing. If the dashboard would not have caught the last incident, it will not catch the next one.",
      "## Nothing changes on Friday",
      "The unglamorous rules — small steps, reversible steps, no deploys before a weekend — are unglamorous because they work. Almost every migration horror story is the same story: too much at once, and no way back.",
    ],
  },
];

export function postBySlug(slug: string): Post | undefined {
  return BLOGS.find((p) => p.slug === slug);
}
