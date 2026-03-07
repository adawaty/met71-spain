export type Testimonial = {
  name: string;
  company?: string;
  role?: string;
  quote: string;
  route?: "import" | "export";
};

// NOTE: Replace these with real client testimonials when available.
export const testimonials: Testimonial[] = [
  {
    name: "Client (Name withheld)",
    company: "Automotive Importer",
    role: "Operations",
    route: "import",
    quote:
      "Met71 Spain kept the paperwork and handoffs tight. We had clear milestones and zero surprises during clearance.",
  },
  {
    name: "Client (Name withheld)",
    company: "Agri Export Partner",
    role: "Logistics",
    route: "export",
    quote:
      "The team coordinated packaging, documents, and freight like one workflow. Timelines stayed predictable end-to-end.",
  },
  {
    name: "Client (Name withheld)",
    company: "Trade Partner",
    role: "Procurement",
    quote:
      "Communication was fast and practical. When something changed, we knew immediately—and we had options.",
  },
];
