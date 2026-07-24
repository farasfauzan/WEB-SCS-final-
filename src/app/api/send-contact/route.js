import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { getSetting } from "@/lib/data";
import { ContactNotificationEmail } from "@/emails/ContactNotificationEmail";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";

// Simple HTML escape to prevent injection in email template
const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createNodemailerTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    const message = "SMTP_HOST dan SMTP_PORT tidak dikonfigurasi — tidak bisa kirim email via nodemailer.";
    console.error("❌ " + message);
    throw new Error(message);
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function renderEmailContent(name, email, phone, subject, message) {
  const emailElement = ContactNotificationEmail({ name, email, phone, subject, message });
  const htmlBody = await render(emailElement);
  const textBody = `
Pesan Baru dari Website

Nama: ${name}
Email: ${email}
${phone ? `Telepon: ${phone}\n` : ""}${subject ? `Subjek: ${subject}\n` : ""}
Pesan:
${message}
    `.trim();
  return { htmlBody, textBody };
}

async function sendViaResend({ name, email, phone, subject, message, contactEmail, fromEmail, fromName, emailSubject }) {
  const { htmlBody, textBody } = await renderEmailContent(name, email, phone, subject, message);

  const { data, error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    reply_to: email,
    to: contactEmail,
    subject: emailSubject,
    html: htmlBody,
    text: textBody,
    headers: {
      "X-Mailer": "SCS Website Contact Form",
      "X-Priority": "1",
      "Priority": "urgent",
      "Importance": "high",
      "Precedence": "list",
      "List-ID": "<contact.scs-website.local>",
    },
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message || "Resend API error");
  }

  return data;
}

async function sendViaNodemailer({ name, email, phone, subject, message, contactEmail, fromName, emailSubject }) {
  const { htmlBody, textBody } = await renderEmailContent(name, email, phone, subject, message);

  const transporter = createNodemailerTransporter();

  // Nodemailer via Gmail SMTP harus pakai email Gmail sebagai pengirim.
  // SMTP_USER WAJIB dikonfigurasi di .env.local — tidak ada fallback hardcode.
  if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER tidak dikonfigurasi — Nodemailer tidak dapat mengirim email.");
  }
  const nodemailerFrom = process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: `${fromName} <${nodemailerFrom}>`,
    replyTo: email,
    to: contactEmail,
    subject: emailSubject,
    text: textBody,
    html: htmlBody,
    headers: {
      "X-Mailer": "SCS Website Contact Form",
      "X-Priority": "1",
      "Priority": "urgent",
      "Importance": "high",
      "X-MSMail-Priority": "High",
      "Precedence": "list",
      "List-ID": "<contact.scs-website.local>",
    },
  });

  if (process.env.NODE_ENV === "development" && info.messageId) {
    console.log("✉️ Contact email sent:", info.messageId);
    console.log("   To:", contactEmail);
    console.log("   Subject:", emailSubject);
  }

  return info;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validasi field wajib
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, Email, dan Pesan harus diisi" },
        { status: 400 }
      );
    }

    // Validasi format email
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    // Escape hanya untuk subject line (plain text, bukan React)
    const emailSubject = `[Pesan dari Website] ${escapeHtml(subject || "Tidak ada subjek")} - dari ${escapeHtml(name)}`;

    // Ambil settings dari database
    const contactEmail = (await getSetting("contact_email")) || process.env.CONTACT_EMAIL;
    const fromEmail = (await getSetting("contact_from_email")) || process.env.CONTACT_FROM_EMAIL;

    // Jika alamat email tujuan/pengirim tidak dikonfigurasi, return error
    if (!contactEmail) {
      return NextResponse.json(
        { error: "Email tujuan tidak dikonfigurasi. Silakan hubungi administrator." },
        { status: 500 }
      );
    }
    if (!fromEmail) {
      return NextResponse.json(
        { error: "Email pengirim tidak dikonfigurasi. Silakan hubungi administrator." },
        { status: 500 }
      );
    }
    const fromName = "Hubungi Kami";

    const emailPayload = { name, email, phone, subject, message, contactEmail, fromEmail, fromName, emailSubject };

    // Coba kirim via Resend dulu
    try {
      await sendViaResend(emailPayload);
      console.log("✅ Contact email sent via Resend");
    } catch (resendErr) {
      console.warn("⚠️ Resend gagal, fallback ke nodemailer:", resendErr.message);
      // Fallback ke nodemailer
      try {
        // Hapus fromEmail dari payload untuk Nodemailer — dia pakai SMTP_USER sendiri
        const { fromEmail: _, ...nodemailerPayload } = emailPayload;
        await sendViaNodemailer(nodemailerPayload);
        console.log("✅ Contact email sent via nodemailer (fallback)");
      } catch (nodemailerErr) {
        console.error("❌ Nodemailer juga gagal:", nodemailerErr);
        return NextResponse.json(
          { error: "Gagal mengirim pesan. Silakan coba lagi." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil dikirim! Kami akan menghubungi Anda segera.",
    });
  } catch (error) {
    console.error("Send contact error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
