import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

const colors = {
  bg: "#050B08",
  surface: "#0B1611",
  text: "#E8F5EC",
  muted: "#8FA89A",
  primary: "#22E07A",
  border: "#1b3326",
};

export function EmailLayout({
  preview,
  heading,
  children,
}: {
  preview: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          background: colors.bg,
          margin: 0,
          padding: "24px 0",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px" }}>
          <Text
            style={{ color: colors.primary, fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}
          >
            SakaSense
          </Text>
          <Section
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 24,
            }}
          >
            <Heading style={{ color: colors.text, fontSize: 24, margin: "0 0 16px" }}>
              {heading}
            </Heading>
            {children}
          </Section>
          <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 16 }}>
            SakaSense Venture Solutions · Smart Soil Intelligence
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const p = {
  color: colors.text,
  fontSize: 15,
  lineHeight: "24px",
  margin: "0 0 12px",
} as const;
export const muted = {
  color: colors.muted,
  fontSize: 13,
  lineHeight: "20px",
  margin: "0 0 8px",
} as const;
export { colors };
