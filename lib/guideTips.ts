export type GuideTopicKey =
  | "payments"
  | "vpn"
  | "transport"
  | "safety"
  | "culture"
  | "sim"
  | "apps";

export const GUIDE_TIPS: Record<
  GuideTopicKey,
  { title: string; bullets: string[] }
> = {
  payments: {
    title: "Payments in China",
    bullets: [
      "Set up Alipay or WeChat Pay before arrival",
      "Link foreign card if possible",
      "Carry 200-500 RMB cash for small vendors",
    ],
  },
  vpn: {
    title: "Internet & VPN",
    bullets: [
      "Some apps are restricted in China",
      "Install VPN before arrival",
      "Download offline maps",
    ],
  },
  transport: {
    title: "Transportation tips",
    bullets: [
      "High-speed rail is best between cities",
      "Arrive early for station security",
      "Use DiDi for taxis",
    ],
  },
  safety: {
    title: "Safety",
    bullets: [
      "China is generally safe in cities",
      "Watch belongings in crowds",
    ],
  },
  culture: {
    title: "Cultural tips",
    bullets: [
      "Respect queues",
      "Avoid sensitive political topics",
    ],
  },
  sim: {
    title: "SIM & eSIM",
    bullets: [
      "eSIM is easiest for visitors",
      "China Mobile has best coverage",
    ],
  },
  apps: {
    title: "Essential apps",
    bullets: [
      "WeChat",
      "Alipay",
      "DiDi",
      "Baidu Maps",
    ],
  },
};
