/**
 * Legal documents — Orbit Works LLC, effective July 15, 2026.
 *
 * Transcribed from OrbitWorks_Legal_Policies (Privacy Policy, Terms and
 * Conditions, Cancellation and Refund Policy). Rendered by LegalDoc and served
 * at /privacy, /terms and /refund-policy (all noindex-linked from the footer).
 *
 * NOTE: this is the client-supplied policy copy, reproduced as provided. It has
 * placeholder vendors ("TBD") and should be reviewed by counsel before launch.
 */

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "sub"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type LegalSection = { no: string; title: string; blocks: LegalBlock[] };

export type LegalDoc = {
  slug: string;
  navLabel: string;
  title: string;
  subtitle: string;
  effective: string;
  intro: string[];
  sections: LegalSection[];
};

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  navLabel: "Privacy Policy",
  title: "Privacy Policy",
  subtitle: "How Orbit Works collects, uses, and protects your information.",
  effective: "Effective Date: July 15, 2026  ·  Last Updated: July 15, 2026",
  intro: [
    "This Privacy Policy describes how Orbit Works LLC (‘Orbit Works,’ ‘we,’ ‘our,’ or ‘us’) collects, uses, shares, and protects personal information when you visit our website at orbitworks.com, use our services, fill out a form, book a call, or otherwise interact with us. By using our website or services, you agree to the terms of this Privacy Policy.",
    "This policy complies with applicable US privacy laws including the California Consumer Privacy Act (CCPA) as amended effective January 1, 2026, and applicable data protection regulations across all US states with active privacy legislation.",
  ],
  sections: [
    {
      no: "01",
      title: "Information We Collect",
      blocks: [
        { type: "p", text: "We collect the following categories of personal information:" },
        { type: "sub", text: "Information You Provide Directly" },
        {
          type: "list",
          items: [
            "Full name and business name",
            "Email address and phone number (including WhatsApp number)",
            "Website URL and business details submitted through our audit tools or forms",
            "Payment information processed through third-party payment processors",
            "Communications sent to us by email, phone, or messaging platforms",
          ],
        },
        { type: "sub", text: "Information Collected Automatically" },
        {
          type: "list",
          items: [
            "IP address and approximate geographic location",
            "Browser type, device type, and operating system",
            "Pages visited, time spent on pages, and referring URLs",
            "Cookies, pixel tags, and similar tracking technologies",
            "Ad interaction data from Google Ads, Meta Ads, and LinkedIn Ads pixels",
          ],
        },
        { type: "sub", text: "Information From Third Parties" },
        {
          type: "list",
          items: [
            "Lead data from advertising platforms (Google, Meta, LinkedIn)",
            "CRM-enriched contact data from business data providers",
            "Analytics and behavioural data from integrated marketing platforms",
          ],
        },
      ],
    },
    {
      no: "02",
      title: "How We Use Your Information",
      blocks: [
        { type: "p", text: "We use the information we collect for the following purposes:" },
        {
          type: "list",
          items: [
            "To respond to enquiries, book discovery calls, and deliver our services",
            "To send you the results of your free AI Business Audit or Marketing Assessment",
            "To process payments and manage client accounts and contracts",
            "To send service updates, invoices, and operational communications",
            "To send marketing communications where you have provided consent",
            "To run and optimise paid advertising campaigns on Google, Meta, and LinkedIn",
            "To analyse website traffic and improve our website and user experience",
            "To comply with legal obligations and enforce our terms of service",
            "To protect against fraud, unauthorized access, and abuse",
          ],
        },
      ],
    },
    {
      no: "03",
      title: "Cookies and Tracking Technologies",
      blocks: [
        {
          type: "p",
          text: "Our website uses cookies and similar tracking technologies. A cookie is a small data file stored on your device. We use the following types:",
        },
        {
          type: "list",
          items: [
            "Essential Cookies: Required for the website to function. Cannot be disabled.",
            "Analytics Cookies: Google Analytics 4 (GA4) to track visitor behaviour and traffic sources.",
            "Advertising Pixels: Meta Pixel, Google Tag Manager, LinkedIn Insight Tag to measure ad performance and enable remarketing.",
            "Preference Cookies: To remember your settings and choices.",
            "Conversions API (CAPI): Server-side event tracking for Meta advertising compliance.",
          ],
        },
        {
          type: "callout",
          text: "You can manage or disable non-essential cookies through our cookie consent banner when you first visit the site, or through your browser settings. Disabling certain cookies may affect website functionality.",
        },
      ],
    },
    {
      no: "04",
      title: "Third-Party Services and Data Sharing",
      blocks: [
        {
          type: "p",
          text: "We work with the following third-party service providers who may process your data on our behalf:",
        },
        {
          type: "table",
          head: ["Service", "Provider", "Purpose"],
          rows: [
            ["Website Analytics", "Google Analytics 4", "Website traffic analysis"],
            ["Tag Management", "Google Tag Manager", "Pixel and event management"],
            ["Email Marketing", "Email platform (TBD)", "Client and lead communications"],
            ["CRM and Pipeline", "CRM platform (TBD)", "Lead and client management"],
            ["Ad Tracking", "Meta Pixel and CAPI", "Advertising attribution"],
            ["Call Booking", "Calendly", "Discovery call scheduling"],
            ["Payment Processing", "Stripe or PayPal", "Payment collection"],
            ["Hosting", "Hostinger", "Website hosting and storage"],
          ],
        },
        {
          type: "p",
          text: "We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.",
        },
      ],
    },
    {
      no: "05",
      title: "HIPAA Notice",
      blocks: [
        {
          type: "callout",
          text: "Orbit Works is a technology and digital marketing services company. We do not operate as a Covered Entity or Business Associate under the Health Insurance Portability and Accountability Act (HIPAA). We do not collect, process, or store Protected Health Information (PHI) as part of our standard services. If you are a healthcare provider and wish to engage Orbit Works for services that may involve PHI, a separate Business Associate Agreement (BAA) must be signed before any such engagement begins. Without a signed BAA, do not share PHI with us through any channel.",
        },
      ],
    },
    {
      no: "06",
      title: "Your Privacy Rights",
      blocks: [
        {
          type: "p",
          text: "Depending on the state in which you reside, you may have the following rights regarding your personal information:",
        },
        {
          type: "list",
          items: [
            "Right to Know: Request details about the categories of personal information we have collected about you.",
            "Right to Access: Obtain a copy of the personal information we hold about you.",
            "Right to Delete: Request deletion of your personal information, subject to legal exceptions.",
            "Right to Correct: Request correction of inaccurate personal information.",
            "Right to Opt Out: Opt out of the sale or sharing of your personal information (we do not sell your data).",
            "Right to Non-Discrimination: We will not discriminate against you for exercising any of these rights.",
          ],
        },
        {
          type: "p",
          text: "To exercise any of these rights, contact us at privacy@orbitworks.com. We will respond within 45 days as required by applicable US privacy law.",
        },
      ],
    },
    {
      no: "07",
      title: "Data Retention",
      blocks: [
        {
          type: "p",
          text: "We retain personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Specifically:",
        },
        {
          type: "list",
          items: [
            "Client contact and contract data: Retained for 7 years after contract termination for legal and tax compliance.",
            "Website analytics data: Retained for 26 months in Google Analytics 4.",
            "Marketing and enquiry data: Retained for 2 years from last interaction.",
            "Payment records: Retained for 7 years as required by US tax law.",
          ],
        },
      ],
    },
    {
      no: "08",
      title: "Data Security",
      blocks: [
        {
          type: "p",
          text: "We implement reasonable technical and organisational security measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. These measures include SSL/TLS encryption on all data transmitted through our website, restricted access controls, and secure hosting infrastructure. No method of transmission over the internet is 100% secure. We cannot guarantee absolute security but commit to promptly notifying affected individuals in the event of a confirmed data breach as required by applicable law.",
        },
      ],
    },
    {
      no: "09",
      title: "Children's Privacy",
      blocks: [
        {
          type: "p",
          text: "Our website and services are not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that we have collected information from a person under 18 without parental consent, we will delete it promptly. If you believe we have collected such information, contact us at privacy@orbitworks.com.",
        },
      ],
    },
    {
      no: "10",
      title: "Changes to This Policy",
      blocks: [
        {
          type: "p",
          text: "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. When we update this policy, we will revise the effective date at the top of this page. We encourage you to review this policy periodically. Your continued use of our website or services after any changes constitutes your acceptance of the updated policy.",
        },
      ],
    },
    {
      no: "11",
      title: "Contact Us",
      blocks: [
        { type: "p", text: "For questions, concerns, or requests relating to this Privacy Policy, contact us at:" },
        {
          type: "callout",
          text: "Orbit Works LLC  ·  Email: privacy@orbitworks.com  ·  Website: orbitworks.com  ·  WhatsApp: Available via website contact page",
        },
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: "terms",
  navLabel: "Terms & Conditions",
  title: "Terms and Conditions",
  subtitle: "The agreement between you and Orbit Works LLC when using our services.",
  effective: "Effective Date: July 15, 2026  ·  Last Updated: July 15, 2026",
  intro: [
    "Please read these Terms and Conditions (‘Terms’) carefully before engaging Orbit Works LLC (‘Orbit Works,’ ‘we,’ ‘our,’ or ‘us’) for any service. By signing a service agreement, submitting a payment, or using our website, you (‘Client,’ ‘you,’ or ‘your’) agree to be bound by these Terms. If you do not agree, do not use our services.",
  ],
  sections: [
    {
      no: "01",
      title: "Services",
      blocks: [
        {
          type: "p",
          text: "Orbit Works provides technology and digital growth services including but not limited to: AI automation and chatbot systems, digital marketing management (Google Ads, Meta Ads, LinkedIn Ads, SEO, email and WhatsApp marketing), custom website and mobile app development, cloud migrations and IT infrastructure, CRM setup and sales pipeline automation, and staff augmentation and on-demand IT talent placement.",
        },
        {
          type: "p",
          text: "The specific scope of services, deliverables, timelines, and fees for each engagement are defined in a separate Statement of Work (SOW) or Service Agreement signed by both parties. These Terms apply to all engagements unless otherwise specified in writing.",
        },
      ],
    },
    {
      no: "02",
      title: "Payment Terms",
      blocks: [
        { type: "p", text: "All fees are quoted in US Dollars (USD) unless otherwise agreed in writing." },
        {
          type: "list",
          items: [
            "Setup fees (one-time): Due and payable before work commences on the engagement.",
            "Monthly retainers: Due on the 1st of each month, payable by automatic bank transfer, wire transfer, or credit card.",
            "Paid audit fee: Due at the time of booking. Credited in full toward the first month's package if the Client signs a service agreement.",
            "Late payment: Invoices unpaid after 15 days will incur a late fee of 1.5% per month on the outstanding balance.",
            "Disputed charges: Any invoice disputes must be raised in writing within 7 days of the invoice date.",
            "Suspension: Orbit Works reserves the right to pause service delivery if payment is more than 30 days overdue.",
          ],
        },
      ],
    },
    {
      no: "03",
      title: "Minimum Contract Term",
      blocks: [
        {
          type: "callout",
          text: "All Orbit Works service packages require a minimum contract term of 6 (six) months from the start date. This minimum term applies to monthly retainer services across all tiers (Starter, Growth, and Scale). The minimum term is required to ensure sufficient time to build, optimise, and demonstrate measurable results from the systems and campaigns we deliver.",
        },
        {
          type: "p",
          text: "After the initial 6-month term, the engagement automatically continues on a rolling month-to-month basis until either party provides written cancellation notice as described in the Cancellation Policy below.",
        },
      ],
    },
    {
      no: "04",
      title: "Intellectual Property",
      blocks: [
        {
          type: "p",
          text: "All AI systems, chatbot logic, automation workflows, dashboard configurations, n8n flows, GoHighLevel structures, and other technology built by Orbit Works as part of a client engagement remain the exclusive intellectual property of Orbit Works LLC unless otherwise agreed in a separate written assignment agreement signed by both parties.",
        },
        {
          type: "p",
          text: "Clients receive a limited, non-exclusive licence to use the systems and outputs during the active service period. Upon termination of the engagement, the licence terminates and Orbit Works systems must not be continued to be used without a new agreement.",
        },
        {
          type: "callout",
          text: "IP Buyout Option: A Client who wishes to purchase full ownership of the systems built for them may do so by paying a one-time buyout fee equal to 12 (twelve) times their current monthly retainer fee. Upon receipt of full payment, Orbit Works will transfer all relevant files, credentials, and configuration access to the Client.",
        },
        {
          type: "p",
          text: "Client-provided content (logos, brand assets, images, copy, business data) remains the property of the Client. Orbit Works will not use client materials for any purpose outside the agreed engagement.",
        },
      ],
    },
    {
      no: "05",
      title: "No Guarantee of Results",
      blocks: [
        {
          type: "p",
          text: "Orbit Works commits to delivering agreed services with professional skill and care. However, we do not guarantee specific outcomes including but not limited to: specific search rankings, number of leads generated, advertising return on investment, revenue increases, sales conversions, or chatbot performance metrics.",
        },
        {
          type: "p",
          text: "Digital marketing and AI system performance is subject to numerous external variables including market conditions, platform algorithm changes, audience behaviour, client responsiveness, and competitive landscape. Orbit Works will provide transparent monthly reporting and continuously optimise strategies to improve outcomes.",
        },
      ],
    },
    {
      no: "06",
      title: "Client Responsibilities",
      blocks: [
        { type: "p", text: "For Orbit Works to deliver services effectively, Clients agree to:" },
        {
          type: "list",
          items: [
            "Provide timely access to all required accounts, platforms, credentials, and assets",
            "Deliver requested content, approvals, and feedback within agreed timelines",
            "Assign a primary point of contact with authority to approve decisions",
            "Maintain sufficient advertising budget as agreed in the SOW",
            "Not engage a competing agency for the same service scope without prior notice",
          ],
        },
        {
          type: "p",
          text: "Delays caused by the Client's failure to provide required materials or approvals will not constitute grounds for a refund or early termination.",
        },
      ],
    },
    {
      no: "07",
      title: "Limitation of Liability",
      blocks: [
        {
          type: "p",
          text: "To the maximum extent permitted by applicable law, Orbit Works' total liability to any Client for any claim arising from or relating to a service engagement shall not exceed the total fees paid by the Client to Orbit Works in the 3 months immediately preceding the claim.",
        },
        {
          type: "p",
          text: "Orbit Works shall not be liable for any indirect, consequential, incidental, punitive, or special damages including loss of profits, loss of data, or business interruption, even if advised of the possibility of such damages.",
        },
      ],
    },
    {
      no: "08",
      title: "Confidentiality",
      blocks: [
        {
          type: "p",
          text: "Both parties agree to keep confidential any proprietary information, trade secrets, client data, pricing, methodologies, or business strategies disclosed during the engagement. This obligation survives termination of the agreement for a period of 2 years.",
        },
      ],
    },
    {
      no: "09",
      title: "Termination by Orbit Works",
      blocks: [
        {
          type: "p",
          text: "Orbit Works reserves the right to terminate an engagement immediately and without refund in the following circumstances:",
        },
        {
          type: "list",
          items: [
            "Non-payment of invoices beyond 30 days",
            "Client providing false information or misrepresenting their business",
            "Client requesting services that violate applicable law or platform policies",
            "Abusive, threatening, or inappropriate conduct toward Orbit Works personnel",
          ],
        },
      ],
    },
    {
      no: "10",
      title: "Governing Law and Dispute Resolution",
      blocks: [
        {
          type: "p",
          text: "These Terms are governed by the laws of the State of Texas, United States, without regard to conflict of law provisions. Any disputes arising under these Terms shall first be subject to good-faith negotiation between the parties. If unresolved within 30 days, disputes shall be submitted to binding arbitration in Austin, Texas, under the rules of the American Arbitration Association.",
        },
      ],
    },
    {
      no: "11",
      title: "Changes to These Terms",
      blocks: [
        {
          type: "p",
          text: "Orbit Works reserves the right to update these Terms at any time. Clients will be notified of material changes by email at least 30 days before they take effect. Continued use of our services after the effective date constitutes acceptance of the updated Terms.",
        },
        { type: "callout", text: "Questions about these Terms? Contact us at: legal@orbitworks.com" },
      ],
    },
  ],
};

export const REFUND: LegalDoc = {
  slug: "refund-policy",
  navLabel: "Cancellation & Refund",
  title: "Cancellation and Refund Policy",
  subtitle: "Clear terms for ending a service engagement with Orbit Works LLC.",
  effective: "Effective Date: July 15, 2026  ·  Last Updated: July 15, 2026",
  intro: [
    "This Cancellation and Refund Policy applies to all service engagements with Orbit Works LLC. By signing a service agreement or making a payment, you agree to these terms. Please read this policy carefully before committing to any engagement.",
  ],
  sections: [
    {
      no: "01",
      title: "Minimum Contract Commitment",
      blocks: [
        {
          type: "callout",
          text: "All Orbit Works monthly retainer packages (Starter, Growth, and Scale) carry a minimum commitment of 6 (six) consecutive months. Cancellation requests received before the 6-month minimum term is complete are subject to the Early Cancellation terms defined in Section 3 below.",
        },
      ],
    },
    {
      no: "02",
      title: "Cancellation After the Minimum Term",
      blocks: [
        {
          type: "p",
          text: "After the initial 6-month term, either party may cancel the engagement by providing written notice of at least 30 (thirty) days to the other party. Notice must be submitted in writing via email to hello@orbitworks.com. Verbal notice, WhatsApp messages, or phone calls do not constitute valid cancellation.",
        },
        {
          type: "list",
          items: [
            "Cancellation takes effect at the end of the current billing cycle following the 30-day notice period.",
            "All services will continue to be delivered and invoiced during the 30-day notice period.",
            "Orbit Works will prepare an offboarding summary including account access, campaign data export, and a handover document at no additional charge.",
          ],
        },
      ],
    },
    {
      no: "03",
      title: "Early Cancellation (Before 6-Month Term)",
      blocks: [
        {
          type: "callout",
          text: "If a Client cancels before completing the 6-month minimum term, all remaining monthly retainer fees for the balance of the minimum term become immediately due and payable. For example: if a Client on a $1,400/month Growth package cancels after Month 2, the remaining 4 months ($5,600) are owed in full. This fee is not a penalty but a reflection of the resource allocation, team planning, and strategic work committed to the engagement.",
        },
        {
          type: "p",
          text: "Orbit Works may, at its sole discretion, offer an alternative resolution such as a service pause, package downgrade, or restructured timeline in lieu of early termination fees. Any such alternative must be agreed in writing by both parties.",
        },
      ],
    },
    {
      no: "04",
      title: "Setup Fees",
      blocks: [
        {
          type: "p",
          text: "One-time setup fees are non-refundable once the onboarding and build process has commenced.",
        },
        {
          type: "p",
          text: "Setup fees cover the initial strategic planning, account configuration, system architecture, campaign build, and resource allocation required to launch the engagement. This work begins immediately upon receipt of payment and cannot be reversed once started.",
        },
      ],
    },
    {
      no: "05",
      title: "Paid Audit Fee",
      blocks: [
        {
          type: "p",
          text: "The paid deep-dive audit fee ($300 to $500 depending on scope) is non-refundable after the audit session has been conducted and the action roadmap has been delivered.",
        },
        {
          type: "callout",
          text: "If the Client proceeds to sign a monthly service package within 14 days of the audit, the full audit fee is credited in full toward the first month's retainer. The credit cannot be applied retroactively or transferred to a third party.",
        },
      ],
    },
    {
      no: "06",
      title: "Monthly Retainer Refunds",
      blocks: [
        {
          type: "p",
          text: "Monthly retainer payments are non-refundable for the month in which services have been delivered or commenced. Orbit Works does not offer pro-rated refunds for partial months of service.",
        },
        {
          type: "p",
          text: "Refund requests for a current billing month will not be considered unless Orbit Works has demonstrably failed to deliver the core scope of services agreed in the SOW due to our own internal failure.",
        },
      ],
    },
    {
      no: "07",
      title: "Advertising Spend",
      blocks: [
        {
          type: "callout",
          text: "Orbit Works does not hold, manage, or control client advertising budgets. All ad spend on Google, Meta, LinkedIn, or any other platform is paid directly by the Client to those platforms. Orbit Works manages campaigns on the Client's behalf but does not collect ad spend funds. Ad spend already deployed to advertising platforms is non-refundable by Orbit Works under any circumstances.",
        },
      ],
    },
    {
      no: "08",
      title: "Refund Eligibility",
      blocks: [
        { type: "p", text: "Refunds from Orbit Works are considered only under the following limited circumstances:" },
        {
          type: "list",
          items: [
            "The Client cancels in writing within 72 hours of signing an agreement and before any work has commenced.",
            "Orbit Works fails to commence any agreed service delivery within 30 days of the start date without a mutually agreed delay.",
            "A verifiable technical failure on Orbit Works' side results in material loss of service for 7 or more consecutive days.",
          ],
        },
        {
          type: "p",
          text: "Refund requests based on dissatisfaction with results, changes in business direction, budget constraints, or competitor comparisons do not qualify for a refund, as digital marketing and technology outcomes are subject to market variables outside Orbit Works' control.",
        },
      ],
    },
    {
      no: "09",
      title: "Intellectual Property on Cancellation",
      blocks: [
        { type: "p", text: "Upon termination of an engagement, the following applies:" },
        {
          type: "list",
          items: [
            "All Orbit Works-built systems (chatbots, workflows, dashboards, automations) remain the property of Orbit Works and access will be revoked unless the Client has purchased the IP buyout as described in the Terms and Conditions.",
            "All campaign data, ad account history, and analytics data belonging to the Client will be made available for export during a 14-day offboarding window.",
            "Client-owned assets (logos, brand files, content, creative assets) will be returned to the Client.",
            "Any third-party platform subscriptions set up in the Client's name remain the Client's responsibility after termination.",
          ],
        },
      ],
    },
    {
      no: "10",
      title: "How to Request Cancellation or a Refund",
      blocks: [
        { type: "p", text: "All cancellation and refund requests must be submitted in writing to:" },
        {
          type: "callout",
          text: "Email: hello@orbitworks.com  ·  Subject Line: Cancellation Request [Company Name] [Service Package]. Include in your email: your full name, company name, service package, start date, and reason for cancellation. We will acknowledge your request within 2 business days and process it within 10 business days.",
        },
      ],
    },
    {
      no: "11",
      title: "Dispute Resolution",
      blocks: [
        {
          type: "p",
          text: "If you believe a charge was made in error or you have a billing dispute, please contact us at hello@orbitworks.com before initiating a chargeback with your bank or credit card provider. Chargebacks initiated without prior written notice to Orbit Works will be contested with full documentation and may result in immediate termination of all services.",
        },
        {
          type: "p",
          text: "We are committed to resolving all disputes in good faith. If we cannot reach a resolution within 14 days of your written dispute, the matter will be escalated to binding arbitration as described in our Terms and Conditions.",
        },
        {
          type: "callout",
          text: "Questions About This Policy? Contact us at hello@orbitworks.com or visit orbitworks.com/contact",
        },
      ],
    },
  ],
};

export const LEGAL_DOCS: LegalDoc[] = [PRIVACY, TERMS, REFUND];

export function legalBySlug(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
