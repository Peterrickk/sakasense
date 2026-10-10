export type TeamMember = {
  slug: string;
  name: string;
  initials: string;
  title: string;
  bio: string;
  /** public/ path. Initials avatar is shown until the file exists (set hasPhoto: true). */
  photo: string;
  hasPhoto: boolean;
  linkedin?: string;
  email?: string;
};

export const team: TeamMember[] = [
  {
    slug: "peter-jade-talabucon",
    name: "Peter Jade Talabucon",
    initials: "PT",
    title: "Chief Executive Officer",
    bio: "[PLACEHOLDER bio — vision, strategy, and partnerships]",
    photo: "/images/team/peter-jade-talabucon.webp",
    hasPhoto: true,
  },
  {
    slug: "aliana-maria-akala",
    name: "Aliana Maria Akala",
    initials: "AA",
    title: "Chief Financial Officer",
    bio: "[PLACEHOLDER bio — finance, operations, sustainable growth]",
    photo: "/images/team/aliana-maria-akala.webp",
    hasPhoto: true,
  },
  {
    slug: "louigie-guillera",
    name: "Louigie B. Guillera",
    initials: "LG",
    title: "Chief Technology Officer",
    bio: "[PLACEHOLDER bio — IoT hardware, firmware, software platforms]",
    photo: "/images/team/louigie-guillera.webp",
    hasPhoto: true,
  },
];
