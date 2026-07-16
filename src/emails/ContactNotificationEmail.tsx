import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Heading,
  Row,
  Column,
  Img,
} from "@react-email/components";
import * as React from "react";

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ptsinarcerahsempurna.com";

export const ContactNotificationEmail = ({
  name,
  email,
  phone,
  subject,
  message,
}: ContactNotificationEmailProps) => {
  const previewText = `Pesan baru dari ${name} - ${subject || "Tidak ada subjek"}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/logo-scs.svg`}
              alt="PT Sinar Cerah Sempurna"
              width="180"
              style={logo}
            />
            <Heading style={headerTitle}>Pesan Baru dari Website</Heading>
            <Text style={headerSubtitle}>
              Seseorang telah mengirimkan pesan melalui form Hubungi Kami
            </Text>
          </Section>

          {/* Badge */}
          <Section style={badgeSection}>
            <span style={badge}>📬 Notifikasi Kontak</span>
          </Section>

          {/* Info Card */}
          <Section style={card}>
            <Heading as="h2" style={cardTitle}>
              Detail Pengirim
            </Heading>

            <Row style={infoRow}>
              <Column style={infoLabelCol}>
                <Text style={infoLabel}>Nama Lengkap</Text>
              </Column>
              <Column style={infoValueCol}>
                <Text style={infoValue}>{name}</Text>
              </Column>
            </Row>
            <Row style={infoRowAlt}>
              <Column style={infoLabelCol}>
                <Text style={infoLabel}>Alamat Email</Text>
              </Column>
              <Column style={infoValueCol}>
                <Link href={`mailto:${email}`} style={emailLink}>
                  {email}
                </Link>
              </Column>
            </Row>
            {phone && (
              <Row style={infoRow}>
                <Column style={infoLabelCol}>
                  <Text style={infoLabel}>Nomor Telepon</Text>
                </Column>
                <Column style={infoValueCol}>
                  <Link href={`tel:${phone}`} style={phoneLink}>
                    {phone}
                  </Link>
                </Column>
              </Row>
            )}
            {subject && (
              <Row style={phone ? infoRowAlt : infoRow}>
                <Column style={infoLabelCol}>
                  <Text style={infoLabel}>Subjek</Text>
                </Column>
                <Column style={infoValueCol}>
                  <Text style={infoValue}>{subject}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Message Card */}
          <Section style={card}>
            <Heading as="h2" style={cardTitle}>
              Isi Pesan
            </Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          {/* Quick Reply Section */}
          <Section style={quickReplySection}>
            <Heading as="h3" style={quickReplyTitle}>
              ⚡ Balas Cepat
            </Heading>
            <Text style={quickReplyText}>
              Klik tombol di bawah untuk membalas pesan ini langsung melalui
              email:
            </Text>
            <Link href={`mailto:${email}?subject=Re: ${subject || "Pesan dari Website"}`} style={replyButton}>
              Balas Pesan
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Email ini dikirim secara otomatis dari form Hubungi Kami di website{" "}
              <Link href={baseUrl} style={footerLink}>
                PT Sinar Cerah Sempurna
              </Link>
            </Text>
            <Text style={footerText}>
              Jl. Karangrejo Barat No 09. RT. 02 RW. 02 (Kp. Pentul),
              Tinjomoyo, Semarang
            </Text>
            <Text style={footerText}>
              Tel: 024 8502010 | Email: info@ptsinarcerahsempurna.com
            </Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} PT Sinar Cerah Sempurna. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactNotificationEmail;

// Styles
const main = {
  backgroundColor: "#f4f6f9",
  fontFamily:
    "'Inter', 'Helvetica Neue', Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
};

const header = {
  backgroundColor: "#004282",
  padding: "32px 28px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto 20px",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 6px",
  letterSpacing: "-0.3px",
};

const headerSubtitle = {
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "14px",
  margin: "0",
  lineHeight: "1.5",
};

const badgeSection = {
  padding: "16px 28px 0",
  textAlign: "center" as const,
};

const badge = {
  display: "inline-block",
  backgroundColor: "#e8f0fe",
  color: "#004282",
  fontSize: "12px",
  fontWeight: "600",
  padding: "4px 14px",
  borderRadius: "20px",
  letterSpacing: "0.3px",
};

const card = {
  padding: "20px 28px",
};

const cardTitle = {
  fontSize: "15px",
  fontWeight: "700",
  color: "#1a1a2e",
  margin: "0 0 16px",
  paddingBottom: "10px",
  borderBottom: "2px solid #eef0f4",
};

const infoRow = {
  padding: "8px 0",
};

const infoRowAlt = {
  padding: "8px 0",
  backgroundColor: "#f8f9fb",
  borderRadius: "6px",
};

const infoLabelCol = {
  width: "35%",
  padding: "4px 0",
};

const infoValueCol = {
  width: "65%",
  padding: "4px 0",
};

const infoLabel = {
  fontSize: "13px",
  color: "#6b7280",
  fontWeight: "500",
  margin: "0",
};

const infoValue = {
  fontSize: "14px",
  color: "#1a1a2e",
  fontWeight: "600",
  margin: "0",
};

const emailLink = {
  fontSize: "14px",
  color: "#004282",
  fontWeight: "600",
  textDecoration: "underline",
};

const phoneLink = {
  fontSize: "14px",
  color: "#004282",
  fontWeight: "600",
  textDecoration: "underline",
};

const messageText = {
  fontSize: "14px",
  color: "#374151",
  lineHeight: "1.7",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: "#f8f9fb",
  padding: "16px",
  borderRadius: "8px",
  borderLeft: "3px solid #004282",
};

const quickReplySection = {
  padding: "0 28px 24px",
  textAlign: "center" as const,
};

const quickReplyTitle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#1a1a2e",
  margin: "0 0 8px",
};

const quickReplyText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0 0 14px",
  lineHeight: "1.5",
};

const replyButton = {
  display: "inline-block",
  backgroundColor: "#004282",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 28px",
  borderRadius: "8px",
  textDecoration: "none",
};

const divider = {
  borderColor: "#eef0f4",
  margin: "0 28px",
};

const footer = {
  padding: "20px 28px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0 0 4px",
  lineHeight: "1.5",
};

const footerLink = {
  color: "#004282",
  textDecoration: "underline",
};

const footerCopyright = {
  fontSize: "11px",
  color: "#b0b7c3",
  margin: "12px 0 0",
};
