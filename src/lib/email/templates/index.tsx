import { Button, Text } from "@react-email/components";
import { EmailLayout, colors, muted, p } from "./layout";
import { formatPHP } from "@/lib/money";

type Line = { name: string; quantity: number; lineTotalCentavos: number };

function LineItems({ lines }: { lines: Line[] }) {
  return (
    <>
      {lines.map((l) => (
        <Text key={l.name} style={p}>
          {l.quantity} × {l.name} — {formatPHP(l.lineTotalCentavos)}
        </Text>
      ))}
    </>
  );
}

export function OrderConfirmationEmail(props: {
  orderNumber: string;
  lines: Line[];
  totalCentavos: number;
  trackUrl: string;
  guideUrl: string;
}) {
  return (
    <EmailLayout
      preview={`Order ${props.orderNumber} confirmed`}
      heading="Thank you for your order"
    >
      <Text style={p}>
        We received your payment for order <strong>{props.orderNumber}</strong>.
      </Text>
      <LineItems lines={props.lines} />
      <Text style={{ ...p, fontWeight: 700 }}>Total: {formatPHP(props.totalCentavos)}</Text>
      <Button
        href={props.trackUrl}
        style={{
          background: colors.primary,
          color: "#04130b",
          borderRadius: 999,
          padding: "12px 24px",
          fontWeight: 700,
        }}
      >
        Track your order
      </Button>
      <Text style={{ ...muted, marginTop: 16 }}>
        While you wait, learn to read your soil in the SakaSense Guidebook: {props.guideUrl}
      </Text>
    </EmailLayout>
  );
}

export function ShippedEmail(props: {
  orderNumber: string;
  courier?: string | null;
  trackingNumber?: string | null;
  trackUrl: string;
}) {
  return (
    <EmailLayout
      preview={`Order ${props.orderNumber} has shipped`}
      heading="Your order is on its way"
    >
      <Text style={p}>
        Order <strong>{props.orderNumber}</strong> has shipped.
      </Text>
      {props.courier ? <Text style={p}>Courier: {props.courier}</Text> : null}
      {props.trackingNumber ? <Text style={p}>Tracking number: {props.trackingNumber}</Text> : null}
      <Button
        href={props.trackUrl}
        style={{
          background: colors.primary,
          color: "#04130b",
          borderRadius: 999,
          padding: "12px 24px",
          fontWeight: 700,
        }}
      >
        View order status
      </Button>
    </EmailLayout>
  );
}

export function AutoReplyEmail(props: { name: string; kind: "contact" | "quote" }) {
  return (
    <EmailLayout preview="We got your message" heading={`Thanks, ${props.name}`}>
      <Text style={p}>
        {props.kind === "quote"
          ? "We received your quote request and will reply with pricing soon."
          : "We received your message and will get back to you soon."}
      </Text>
      <Text style={muted}>If you did not send this, you can ignore this email.</Text>
    </EmailLayout>
  );
}

export function InternalAlertEmail(props: { title: string; rows: [string, string][] }) {
  return (
    <EmailLayout preview={props.title} heading={props.title}>
      {props.rows.map(([k, v]) => (
        <Text key={k} style={p}>
          <strong>{k}:</strong> {v}
        </Text>
      ))}
    </EmailLayout>
  );
}

export function NewsletterConfirmEmail(props: { confirmUrl: string }) {
  return (
    <EmailLayout preview="Confirm your subscription" heading="Confirm your subscription">
      <Text style={p}>Tap the button to confirm you want SakaSense news.</Text>
      <Button
        href={props.confirmUrl}
        style={{
          background: colors.primary,
          color: "#04130b",
          borderRadius: 999,
          padding: "12px 24px",
          fontWeight: 700,
        }}
      >
        Confirm subscription
      </Button>
      <Text style={{ ...muted, marginTop: 16 }}>
        If you did not request this, ignore this email.
      </Text>
    </EmailLayout>
  );
}

export function VerifyEmail(props: { verifyUrl: string }) {
  return (
    <EmailLayout preview="Verify your email" heading="Verify your email">
      <Text style={p}>Confirm your email address to finish setting up your SakaSense account.</Text>
      <Button
        href={props.verifyUrl}
        style={{
          background: colors.primary,
          color: "#04130b",
          borderRadius: 999,
          padding: "12px 24px",
          fontWeight: 700,
        }}
      >
        Verify email
      </Button>
    </EmailLayout>
  );
}
