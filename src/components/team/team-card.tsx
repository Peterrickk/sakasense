import Image from "next/image";
import { Mail } from "lucide-react";
import { Linkedin } from "@/components/brand/social-icons";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/content/team";

function Avatar({ member, size }: { member: TeamMember; size: "sm" | "lg" }) {
  const dim = size === "lg" ? "size-40 text-4xl" : "size-20 text-xl";
  return member.hasPhoto ? (
    <Image
      src={member.photo}
      alt={`Portrait of ${member.name}`}
      width={320}
      height={320}
      className={cn(
        "ring-primary/20 group-hover:ring-primary/70 group-hover:shadow-glow rounded-3xl bg-white object-cover object-top ring-2 transition-all",
        dim,
      )}
    />
  ) : (
    <div
      role="img"
      aria-label={`Initials avatar for ${member.name}`}
      className={cn(
        "bg-brand-gradient text-on-primary ring-primary/20 group-hover:ring-primary/70 group-hover:shadow-glow font-display flex items-center justify-center rounded-3xl font-bold ring-2 transition-all",
        dim,
      )}
    >
      {member.initials}
    </div>
  );
}

export function TeamCard({ member, compact = false }: { member: TeamMember; compact?: boolean }) {
  return (
    <article
      className={cn(
        "glass group rounded-card hover:border-primary/50 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1",
        compact ? "gap-3 p-6" : "gap-4 p-8",
      )}
    >
      <Avatar member={member} size={compact ? "sm" : "lg"} />
      <div>
        <h3 className={compact ? "text-xl" : "text-h3"}>{member.name}</h3>
        <p className="text-primary mt-1 font-mono text-sm">{member.title}</p>
      </div>
      {!compact ? (
        <>
          <p className="text-text-muted text-sm">{member.bio}</p>
          <div className="mt-auto flex gap-3">
            {member.linkedin ? (
              <a
                href={member.linkedin}
                aria-label={`${member.name} on LinkedIn`}
                className="text-text-muted hover:text-primary"
              >
                <Linkedin className="size-5" />
              </a>
            ) : null}
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="text-text-muted hover:text-primary"
              >
                <Mail className="size-5" />
              </a>
            ) : null}
          </div>
        </>
      ) : null}
    </article>
  );
}
