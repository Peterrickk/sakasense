import { FlaskConical, Sprout, Tractor, Users, type LucideIcon } from "lucide-react";

export type Solution = {
  slug: string;
  title: string;
  icon: LucideIcon;
  pain: string;
  help: string;
  /** What we recommend: the Device, the App, and/or the Dashboard. */
  recommended: string;
  cta: { label: string; href: string };
};

export const solutions: Solution[] = [
  {
    slug: "smallholder",
    title: "Smallholder farmers",
    icon: Sprout,
    pain: "Fertilizer is expensive, and it is hard to know how much a small plot really needs or what to plant.",
    help: "Read your soil in minutes with no internet, get a crop and fertilizer recommendation on the device screen, and apply only what the data says.",
    recommended: "SakaSense Device + mobile app",
    cta: { label: "See the SakaSense Device", href: "/products/sakasense-device" },
  },
  {
    slug: "cooperatives",
    title: "Farmer cooperatives",
    icon: Users,
    pain: "Members farm different plots with different needs, and shared knowledge is scattered.",
    help: "Equip groups with several devices and compare plots side by side in the web dashboard.",
    recommended: "Several SakaSense Devices + Web Dashboard",
    cta: { label: "Request a bulk quote", href: "/quote" },
  },
  {
    slug: "commercial",
    title: "Commercial farms and plantations",
    icon: Tractor,
    pain: "Large areas make manual soil sampling slow, patchy, and costly.",
    help: "Map your zones as plots, track pH and N-P-K history over time, and get alerts and printable reports.",
    recommended: "SakaSense Devices + Web Dashboard",
    cta: { label: "Request a bulk quote", href: "/quote" },
  },
  {
    slug: "institutions",
    title: "Research institutions, schools, and LGUs",
    icon: FlaskConical,
    pain: "Programs need consistent, shareable soil data to guide advice and measure impact.",
    help: "Collect repeatable readings across sites and export reports for analysis.",
    recommended: "SakaSense Devices + Web Dashboard",
    cta: { label: "Talk to our team", href: "/contact" },
  },
];
