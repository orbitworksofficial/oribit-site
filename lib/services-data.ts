/**
 * Services Hub content — OrbitWorks_ServicesHub_Brief (July 2026).
 *
 * The brief is the source of truth: 4 category buckets, 13 services, copy final.
 * Two surfaces consume this:
 *   - Homepage Section 07 — the 4 bucket cards (name, tagline, `included` list).
 *   - /services hub        — the same 4 buckets, each expanded into full service
 *                            cards (tagline, description, sub-services, who,
 *                            outcome).
 *
 * `taglineHome` / `taglineHub` differ by a few words in the brief for buckets 2
 * and 3, so both are kept verbatim rather than reconciled. Each bucket carries
 * its own accent (the coloured markers in the brief) exposed to CSS as
 * --bucket-accent.
 */

export type ServiceCard = {
  /** Anchor id on the hub page. */
  slug: string;
  /** Two-digit index as printed in the brief. */
  no: string;
  title: string;
  /** The quoted lead line. */
  tagline: string;
  description: string;
  subServices: string[];
  who: string;
  outcome: string;
};

export type ServiceBucket = {
  /** Anchor id + sticky-nav target. */
  slug: string;
  /** Sticky-nav label (short). */
  navLabel: string;
  name: string;
  taglineHome: string;
  taglineHub: string;
  /** Homepage card "services included" list (marketing shortlist). */
  included: string[];
  /** Full service cards for the hub. */
  services: ServiceCard[];
  /** Per-bucket accent, from the brief. */
  accent: string;
  /** Preview still for the homepage showcase. */
  image: string;
};

export const SERVICES_HOMEPAGE = {
  label: "Everything we do",
  heading: "One Partner. All the Technology Your Business Needs.",
  sub: "From AI automation to cloud infrastructure, every service is delivered under one unified strategy with a single account team.",
  cta: "View All Services",
} as const;

export const SERVICES_HUB = {
  heading: "Everything Your Business Needs. One Partner to Deliver It.",
  sub: "Orbit Works delivers 13 specialist services across AI automation, digital marketing, cloud infrastructure, and on-demand tech talent. Every service works under one strategy.",
  ctaHeading: "Not Sure Which Service You Need?",
  ctaSub: "Start with a free 15-minute discovery call. We will listen to your challenges and tell you exactly which service will deliver the fastest result.",
  ctaButton: "Book a Free Discovery Call",
  ctaSecondary: "Or explore individual services above",
} as const;

export const SERVICE_BUCKETS: ServiceBucket[] = [
  {
    slug: "ai-automation",
    navLabel: "AI Automation",
    name: "AI Automation and Solutions",
    taglineHome: "Intelligent systems that automate the work your team is doing manually right now.",
    taglineHub: "Intelligent systems that automate the work your team is doing manually right now.",
    accent: "#f3124e",
    image: "/media/2024/05/data.jpg",
    included: [
      "AI Chatbot Agents",
      "Unified Revenue Dashboards",
      "Workflow Automation",
      "Data and AI Solutions",
      "CRM Setup and Automation",
    ],
    services: [
      {
        slug: "ai-automation-genai",
        no: "01",
        title: "AI Automation and GenAI",
        tagline: "The AI your competitors will wish they had first.",
        description:
          "We design and deploy custom AI systems built around your exact business workflow. From intelligent chatbots that handle inbound enquiries around the clock, to GenAI applications that process documents, generate reports, and support decision-making. Every build is tailored. Nothing is templated.",
        subServices: [
          "AI strategy and readiness assessment",
          "Custom AI chatbot and conversational agent development",
          "Natural language processing and GenAI applications",
          "Computer vision and image recognition solutions",
          "AI integration with existing platforms and workflows",
        ],
        who: "US businesses with 5 to 100 employees losing time and leads to manual processes.",
        outcome: "Replace up to 5 full-time roles with one AI system at 40 to 60% of the cost.",
      },
      {
        slug: "unified-revenue-dashboard",
        no: "02",
        title: "Unified Revenue Dashboard and Analytics",
        tagline: "Every number that matters, in one place, live.",
        description:
          "Most businesses make decisions based on data that is scattered across six platforms and three spreadsheets. Our unified dashboards connect your ad accounts, CRM, website analytics, and revenue data into a single live view. You see what is working, what is not, and where to move budget in real time.",
        subServices: [
          "Multi-platform ad spend and ROI dashboard",
          "CRM and pipeline integration with live revenue tracking",
          "Custom KPI dashboards for marketing, sales, and operations",
          "Predictive analytics and trend reporting",
          "Data engineering and data lake architecture for growing businesses",
        ],
        who: "Business owners and operations directors who spend too much time compiling weekly reports.",
        outcome: "Cut reporting time by 80% and eliminate 40% of wasted ad spend within 60 days.",
      },
      {
        slug: "crm-automation",
        no: "03",
        title: "CRM Setup and Sales Pipeline Automation",
        tagline: "Stop chasing leads. Let your CRM do it for you.",
        description:
          "A well-configured CRM is the difference between a lead that closes and a lead that goes cold. We set up, configure, and automate your full sales pipeline from the moment a lead enters your system to the moment they sign. Automated follow-ups, lead scoring, booking sequences, and reporting. All built and running within two weeks.",
        subServices: [
          "Full CRM setup and configuration",
          "Automated lead routing and follow-up sequences",
          "Sales pipeline stages and deal tracking",
          "Email and WhatsApp automation from the CRM",
          "Reporting dashboards and lead lifecycle analytics",
          "Integration with website forms, ad platforms, and booking tools",
        ],
        who: "Any business running paid ads, receiving inbound enquiries, or managing a sales team.",
        outcome:
          "Businesses using automated CRM follow-up close 35% more leads than those doing it manually.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    navLabel: "Digital Marketing",
    name: "Digital Marketing Growth",
    taglineHome: "Full-funnel marketing across every channel that brings qualified leads to you.",
    taglineHub:
      "Full-funnel campaigns across every channel that brings qualified leads directly to you.",
    accent: "#0d6efd",
    image: "/media/2024/05/marketing.jpg",
    included: [
      "Google Ads and DemandGen",
      "Meta Ads",
      "LinkedIn Ads",
      "SEO and Content Marketing",
      "Email and WhatsApp Marketing",
    ],
    services: [
      {
        slug: "paid-advertising",
        no: "04",
        title: "Paid Advertising Management",
        tagline: "Your ads, run by people who understand your business.",
        description:
          "We manage Google Ads, Meta Ads, and LinkedIn Ads campaigns built around your specific client profile and revenue goals. Not just clicks. Qualified leads. Every campaign is built from scratch with custom copy, targeting, and creative briefs. We optimise weekly and report monthly with clear attribution showing you exactly which ad made you money.",
        subServices: [
          "Google Search Ads and DemandGen campaigns",
          "Google Performance Max for e-commerce and lead generation",
          "YouTube video advertising",
          "Meta Ads (Facebook and Instagram) for awareness and lead generation",
          "LinkedIn Ads for B2B targeting and decision-maker reach",
          "Retargeting and remarketing across all platforms",
          "Meta Conversions API (CAPI) and Google enhanced conversions setup",
        ],
        who: "Businesses spending on ads without clear attribution or consistent lead flow.",
        outcome: "Average 3x return on ad spend vs. unmanaged campaigns across our client base.",
      },
      {
        slug: "seo-content-email-whatsapp",
        no: "05",
        title: "SEO, Content, Email and WhatsApp Marketing",
        tagline: "The traffic that keeps coming in long after you stop spending.",
        description:
          "Paid ads stop the moment you stop paying. SEO and content marketing compound over time. We build your organic search presence through keyword strategy, technical SEO, and content that ranks. Combined with email and WhatsApp nurture sequences, this creates a full-funnel marketing engine that converts cold visitors into paying clients.",
        subServices: [
          "Technical SEO audit and optimisation",
          "Keyword research and content strategy",
          "Blog and landing page copywriting",
          "On-page and off-page SEO",
          "Email marketing campaigns and automated nurture sequences",
          "WhatsApp Business API setup and broadcast campaigns",
          "Online reputation management and review strategy",
        ],
        who: "Businesses that want long-term organic growth alongside their paid advertising.",
        outcome:
          "Businesses with strong SEO spend 61% less per lead than those relying on paid ads alone.",
      },
    ],
  },
  {
    slug: "it-cloud",
    navLabel: "IT and Cloud",
    name: "IT and Cloud Solutions",
    taglineHome:
      "The technology infrastructure your business needs to operate securely and at scale.",
    taglineHub:
      "The technology infrastructure your business needs to operate, scale, and stay secure.",
    accent: "#17b98a",
    image: "/media/2024/05/cloud.jpg",
    included: [
      "Cloud Migrations",
      "Custom Website Development",
      "Mobile App Development",
      "Software and Product Development",
      "IT Consulting and Strategy",
      "Power Platform / Dynamics 365",
      "Website Maintenance",
    ],
    services: [
      {
        slug: "cloud-migrations",
        no: "06",
        title: "Cloud Migrations and Modernization",
        tagline: "Move to the cloud. No downtime. No data loss. No surprises.",
        description:
          "Whether you are moving from on-premise servers to AWS or Azure, or modernising a legacy system that is slowing your team down, we plan and execute cloud migrations with zero operational disruption. We handle the strategy, the technical migration, and the post-migration optimisation so your team never loses a working day.",
        subServices: [
          "Cloud migration strategy and roadmap",
          "AWS, Azure, and Google Cloud migrations",
          "DevOps and CI/CD pipeline setup",
          "Cloud infrastructure automation and IaC",
          "Disaster recovery and business continuity planning",
          "Cloud cost optimisation and performance monitoring",
        ],
        who: "Businesses running on outdated infrastructure or scaling beyond what their current setup supports.",
        outcome: "Cloud-native businesses reduce IT infrastructure costs by an average of 30 to 40%.",
      },
      {
        slug: "custom-website",
        no: "07",
        title: "Custom Website Development",
        tagline: "A website that works as hard as your best salesperson.",
        description:
          "We build high-converting websites on WordPress, Shopify, and custom frameworks. Every website we build is mobile-first, SEO-ready, and connected to your marketing stack from Day 1. Whether you need a brand site, an e-commerce store, or a high-converting landing page, we deliver it with the right structure, copy direction, and technical foundation.",
        subServices: [
          "Custom website design and development",
          "WordPress and Elementor Pro builds",
          "Shopify and e-commerce store development",
          "WIX website builds and migrations",
          "Landing page design and development",
          "SEO-optimised site architecture",
          "Google Analytics 4, GTM, and Meta Pixel integration",
        ],
        who: "Businesses with outdated websites that do not generate leads or reflect their brand quality.",
        outcome:
          "A well-built website increases lead conversion rates by an average of 200% vs. DIY builds.",
      },
      {
        slug: "mobile-app",
        no: "08",
        title: "Custom Mobile App Development",
        tagline: "Your business in your client's pocket.",
        description:
          "We design and build native iOS and Android apps and cross-platform mobile applications using Flutter. Whether you need a client-facing app, an internal operations tool, or a mobile version of your web platform, we deliver apps that are fast, secure, and designed around how your users actually behave.",
        subServices: [
          "Flutter cross-platform app development",
          "Native iOS app development",
          "Native Android app development",
          "Mobile UI/UX design and prototyping",
          "App Store and Google Play submission",
          "API integration and backend connectivity",
        ],
        who: "Businesses wanting to extend their service delivery to mobile or build client-facing applications.",
        outcome: "Mobile apps increase customer retention by up to 25% vs. web-only experiences.",
      },
      {
        slug: "software-product",
        no: "09",
        title: "Software and Product Development",
        tagline: "Custom software built for the way your business actually works.",
        description:
          "Off-the-shelf software rarely fits exactly. We build custom web applications, SaaS products, and internal tools designed around your specific workflows and business logic. From MVP to full product, we handle design, development, testing, and delivery with a structured process and a dedicated team that stays accountable to timelines.",
        subServices: [
          "MVP design and development",
          "Custom SaaS product development",
          "Legacy system modernisation and migration",
          "Full product development team model",
          "API and microservices architecture",
          "UI/UX design and user research",
          "QA testing and deployment",
        ],
        who: "Startups building a new product, or established businesses that have outgrown their existing software.",
        outcome:
          "Custom-built software reduces operational inefficiency by an average of 45% within 6 months.",
      },
      {
        slug: "power-platform",
        no: "10",
        title: "Power Platform and Dynamics 365",
        tagline: "Microsoft's most powerful tools. Configured for your business.",
        description:
          "Microsoft Power Platform and Dynamics 365 represent some of the most capable enterprise tools available. Most businesses either do not use them or use a fraction of what they offer. We set them up, integrate them into your existing stack, and automate the workflows that currently eat your team's time.",
        subServices: [
          "Microsoft Power Apps development",
          "Power Automate workflow configuration",
          "Power BI dashboard and reporting setup",
          "Dynamics 365 CRM and ERP implementation",
          "Cross-platform integrations and connectors",
          "Microsoft 365 and SharePoint setup and automation",
        ],
        who: "Businesses already using Microsoft tools who want to extract significantly more value from them.",
        outcome:
          "Businesses using Power Automate report an average of 15 hours per employee saved each month.",
      },
      {
        slug: "it-consulting",
        no: "11",
        title: "IT Consulting and Strategy",
        tagline: "Technology advice without the enterprise price tag.",
        description:
          "Before building anything, it is worth knowing whether you are building the right thing. Our IT consulting engagements start by assessing your current technology stack, identifying inefficiencies, security gaps, and missed opportunities. We then build a prioritised technology roadmap aligned to your business goals for the next 12 to 24 months.",
        subServices: [
          "Current-state technology assessment and audit",
          "IT strategy and digital transformation roadmap",
          "Security and compliance advisory",
          "Technology vendor evaluation and selection",
          "Architecture and systems design reviews",
          "Ongoing fractional CTO support",
        ],
        who: "Business owners and operations leaders who are unsure whether their technology is working for or against them.",
        outcome:
          "Businesses with a clear IT strategy reduce unplanned technology costs by up to 35% annually.",
      },
      {
        slug: "website-maintenance",
        no: "12",
        title: "Website Maintenance and Support",
        tagline: "Your website keeps working. You keep working.",
        description:
          "A website that is not maintained is a security risk and an SEO liability. Our maintenance retainers cover everything from plugin and platform updates to content changes, performance monitoring, and backup management. You never need to think about your website unless you want to.",
        subServices: [
          "Monthly platform and plugin updates",
          "Security monitoring and malware scanning",
          "Performance optimisation and speed testing",
          "Content updates and copy changes",
          "Automated daily backups and recovery",
          "SEO health monitoring and technical fixes",
          "Uptime monitoring and incident response",
        ],
        who: "Any business with a live website that does not have an in-house developer.",
        outcome:
          "Poorly maintained websites lose 22% of their organic search ranking within 6 months.",
      },
    ],
  },
  {
    slug: "staff-augmentation",
    navLabel: "Staff Augmentation",
    name: "Staff Augmentation",
    taglineHome: "On-demand tech talent delivered fast, without the cost and risk of full-time hiring.",
    taglineHub: "On-demand tech talent delivered fast, without the cost and risk of full-time hiring.",
    accent: "#f5a524",
    image: "/media/2024/05/11.jpg",
    included: [
      "On-Demand IT Experts",
      "Dedicated Remote Teams",
      "Project Staffing",
      "Skill-Specific Hiring",
      "Short and Long-Term Pods",
    ],
    services: [
      {
        slug: "staff-augmentation-talent",
        no: "13",
        title: "Staff Augmentation and On-Demand IT Talent",
        tagline: "The right person for the job. Without the recruitment overhead.",
        description:
          "Hiring a full-time developer, data engineer, or IT specialist in the US takes 6 to 12 weeks and costs $80,000 to $150,000 per year before benefits and equipment. With Orbit Works staff augmentation, you get pre-vetted, experienced tech professionals embedded in your team within 1 to 2 weeks. Offshore cost structure. US-aligned working hours and communication standards.",
        subServices: [
          "On-demand software developers (full-stack, frontend, backend)",
          "Data engineers and BI specialists",
          "DevOps and cloud engineers",
          "QA and testing professionals",
          "Project managers and technical leads",
          "Short-term project staffing",
          "Dedicated long-term remote team pods",
          "Skill-specific hiring for niche technology requirements",
        ],
        who: "Businesses that need to scale their technical team quickly without the cost, risk, or delay of direct hiring.",
        outcome:
          "Offshore staff augmentation delivers equivalent skills at 40 to 60% of US market hiring cost.",
      },
    ],
  },
];

/** Flat list of the 13 service titles — used by the contact form dropdown. */
export const SERVICE_TITLES: string[] = SERVICE_BUCKETS.flatMap((b) =>
  b.services.map((s) => s.title),
);
