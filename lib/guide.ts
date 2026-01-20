export type GuideCategory = "payments" | "internet" | "transport" | "safety";

export type GuideTip = {
  category: GuideCategory;
  title: string;
  bullets: string[];
  searchQuery: string;
  tags?: string[];
};

export const GUIDE_TIPS: Record<GuideCategory, GuideTip> = {
  payments: {
    category: "payments",
    title: "Payments in China",
    bullets: [
      "Set up Alipay or WeChat Pay before arrival and test a small payment.",
      "Link a foreign card if supported; keep a backup card on hand.",
      "Carry 200-500 RMB for small vendors, taxis, and night markets.",
      "Avoid dynamic currency conversion and pay in RMB when possible.",
      "Keep receipts for hotels and rail tickets for easy refunds or changes.",
      "Use hotel front desks to help with cash top-ups when needed.",
      "Split your daily budget into transport, food, and attractions.",
    ],
    searchQuery: "China Alipay WeChat Pay foreign card cash tips",
    tags: ["money", "cards", "cash"],
  },
  internet: {
    category: "internet",
    title: "Internet and VPN",
    bullets: [
      "Some apps are restricted; install and test essentials before travel.",
      "Download offline maps and translation packs for your main cities.",
      "Use an eSIM or local SIM for stable data and easier logins.",
      "Save hotel addresses in both English and Chinese.",
      "Keep a backup messaging app for your travel group.",
      "Use mobile data for payments instead of public Wi-Fi.",
      "Schedule large uploads or downloads during off-peak hours.",
    ],
    searchQuery: "China VPN tips restricted apps eSIM travel",
    tags: ["vpn", "maps", "esim"],
  },
  transport: {
    category: "transport",
    title: "Transportation basics",
    bullets: [
      "Use high-speed rail for city pairs under five hours.",
      "Arrive 45-60 minutes early for station security checks.",
      "Buy metro QR tickets or a transit card for quick entry.",
      "DiDi is the most common ride-hailing app in major cities.",
      "Keep destination names in Chinese for taxi drivers.",
      "Plan airport transfers in advance during peak hours.",
      "Store your passport and tickets in the same easy-access pocket.",
    ],
    searchQuery: "China high speed rail metro DiDi airport transfer",
    tags: ["rail", "metro", "taxi"],
  },
  safety: {
    category: "safety",
    title: "Safety and common scams",
    bullets: [
      "Use official ticket counters and verified booking apps.",
      "Watch belongings in busy tourist areas and metro stations.",
      "Avoid unsolicited tour guides or deals that feel too good to be true.",
      "Keep a copy of your passport separate from the original.",
      "Use official taxi queues or ride-hailing apps.",
      "Know local emergency numbers: 120 medical, 110 police.",
      "Share your daily plan with a friend or family member.",
    ],
    searchQuery: "China travel safety common scams tourist tips",
    tags: ["safety", "scams"],
  },
};
