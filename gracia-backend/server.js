require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // npm i node-fetch@2

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

const {
  BREVO_API_KEY,
  ADMIN_MAILS,
  MAIL_FROM,
  FROM_EMAIL,
  FROM_NAME,
  PORT,
} = process.env;

console.log("=== CONFIG BACKEND ===");
console.log("BREVO_API_KEY:", BREVO_API_KEY ? "***" : "<vide>");
console.log("ADMIN_MAILS:", ADMIN_MAILS || "<vide>");
console.log("MAIL_FROM:", MAIL_FROM || "<vide>");
console.log("FROM_EMAIL:", FROM_EMAIL || "<vide>");
console.log("FROM_NAME:", FROM_NAME || "<vide>");
console.log("=======================");

if (!BREVO_API_KEY || !ADMIN_MAILS) {
  console.warn(
    "⚠️ BREVO_API_KEY ou ADMIN_MAILS manquant. Les routes mail renverront 500."
  );
}

// --------- util: format from + envoi Brevo HTTP ---------
function getSender() {
  const from = MAIL_FROM || (FROM_EMAIL && FROM_NAME
    ? `"${FROM_NAME}" <${FROM_EMAIL}>`
    : FROM_EMAIL || "no-reply@example.com");

  const name = from.split("<")[0].replace(/"/g, "").trim();
  const email = from.match(/<(.*)>/)?.[1] || from.trim();

  return { name, email };
}

async function sendBrevoEmail({ to, subject, html, requestId, tag }) {
  const sender = getSender();
  console.log(
    `[BREVO][${requestId}] Envoi HTTP API vers: ${to.join(
      ", "
    )} | subject="${subject}" | tag=${tag || "-"}`
  );

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender,
      to: to.map((email) => ({ email })),
      subject,
      htmlContent: html,
      tags: tag ? [tag] : undefined,
    }),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    console.error(
      `[BREVO][${requestId}] HTTP error ${res.status}: ${text || "<vide>"}`
    );
    throw new Error(`Brevo HTTP error ${res.status}`);
  }

  console.log(
    `[BREVO][${requestId}] Email envoyé avec succès. Réponse brute: ${text || "<vide>"}`
  );
  return text;
}

// -------- HEALTH --------
app.get("/api/health", (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`\n[HEALTH][${requestId}] Requête santé reçue sur /api/health`);
  const payload = {
    status: "ok",
    message: "API contact/newsletter opérationnelle (Brevo HTTP)",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
  console.log(`[HEALTH][${requestId}] Réponse:`, payload);
  return res.status(200).json(payload);
});

app.get("/api", (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`\n[HEALTH][${requestId}] Requête reçue sur /api`);
  const payload = {
    status: "ok",
    message: "API contact/newsletter – point d’entrée",
  };
  console.log(`[HEALTH][${requestId}] Réponse:`, payload);
  return res.status(200).json(payload);
});

// -------- CONTACT --------
app.post("/api/contact", async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`\n[CONTACT][${requestId}] Requête reçue`);
  console.log(`[CONTACT][${requestId}] Body:`, req.body);

  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      newsletter,
      type,
      nom,
      prenom,
    } = req.body || {};

    let finalNom = nom;
    let finalPrenom = prenom;

    if ((!finalNom || !finalPrenom) && name) {
      const parts = name.trim().split(" ");
      finalPrenom = finalPrenom || parts[0] || "";
      finalNom = finalNom || parts.slice(1).join(" ") || "";
    }

    console.log(`[CONTACT][${requestId}] Champs mappés:`, {
      finalNom,
      finalPrenom,
      email,
      phone,
      subject,
      type,
      newsletter,
    });

    console.log(`[CONTACT][${requestId}] Validation des champs…`);
    if (!finalNom || !finalPrenom || !email || !message) {
      console.warn(
        `[CONTACT][${requestId}] Validation échouée: nom/prenom/email/message manquant`
      );
      return res.status(400).json({
        success: false,
        message: "Nom, prénom, email et message sont obligatoires.",
      });
    }

    if (!BREVO_API_KEY || !ADMIN_MAILS) {
      console.error(
        `[CONTACT][${requestId}] BREVO_API_KEY ou ADMIN_MAILS manquant`
      );
      return res.status(500).json({
        success: false,
        message: "Configuration Brevo manquante côté serveur.",
      });
    }

    const adminList = ADMIN_MAILS.split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    console.log(`[CONTACT][${requestId}] Liste admins:`, adminList);

    // HTML pour ADMIN
    const ownerHtml = `
      <div style="margin:0;padding:24px;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
        <div style="max-width:640px;margin:0 auto;background:#0b1120;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.6);border:1px solid #1f2937;">
          <div style="padding:20px 24px;background:radial-gradient(circle at top left,#22c55e,#0ea5e9);">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#e5e7eb;opacity:.85;">
              Nouvelle demande de contact
            </p>
            <h1 style="margin:6px 0 0;font-size:20px;color:#f9fafb;font-weight:600;">
              Portfolio technique – Gracia KUTALAKUDIMA
            </h1>
          </div>

          <div style="padding:20px 24px 16px;background:linear-gradient(180deg,#020617,#020617);">
            <p style="margin:0 0 12px;font-size:13px;color:#e5e7eb;line-height:1.5;">
              Vous avez reçu une nouvelle demande depuis le formulaire de contact.
            </p>

            <div style="margin:0 0 16px;padding:12px 14px;border-radius:12px;background:rgba(15,23,42,0.9);border:1px solid #1f2937;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#9ca3af;">
                Coordonnées du demandeur
              </p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;"><strong>Nom :</strong> ${finalNom}</p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;"><strong>Prénom :</strong> ${finalPrenom}</p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;"><strong>Email :</strong> ${email}</p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;">
                <strong>Type de demande :</strong> ${type || subject || "Non précisé"}
              </p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;">
                <strong>Téléphone :</strong> ${phone || "Non précisé"}
              </p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;">
                <strong>Newsletter :</strong> ${newsletter ? "Oui" : "Non"}
              </p>
            </div>

            <div style="margin-top:18px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#9ca3af;">
                Message
              </p>
              <div style="padding:12px 14px;border-radius:12px;background:#020617;border:1px solid #1f2937;white-space:pre-wrap;font-size:13px;color:#e5e7eb;line-height:1.6;">
                ${message}
              </div>
            </div>
          </div>

          <div style="padding:14px 24px;border-top:1px solid #1f2937;background:#020617;">
            <p style="margin:0;font-size:11px;color:#6b7280;line-height:1.4;">
              Email généré automatiquement depuis le portfolio de 
              <span style="color:#e5e7eb;font-weight:500;">Gracia KUTALAKUDIMA</span> – Réseaux, technique et maintenance.
            </p>
          </div>
        </div>
      </div>
    `;

    // HTML pour VISITEUR
    const visitorHtml = `
      <div style="margin:0;padding:24px;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.22);border:1px solid #e5e7eb;">
          <div style="padding:20px 24px;background:linear-gradient(135deg,#0f172a,#1f2937);">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#e5e7eb;opacity:.85;">
              Accusé de réception
            </p>
            <h1 style="margin:6px 0 0;font-size:20px;color:#f9fafb;font-weight:600;">
              Merci pour votre message, ${finalPrenom || finalNom || "merci"}
            </h1>
          </div>

          <div style="padding:20px 24px;background:#ffffff;">
            <p style="margin:0 0 8px;font-size:14px;color:#111827;line-height:1.6;">
              Bonjour ${finalPrenom || finalNom || ""},
            </p>
            <p style="margin:0 0 12px;font-size:14px;color:#111827;line-height:1.6;">
              Merci de m'avoir contacté. J'ai bien reçu votre message et je reviendrai vers vous 
              dans les plus brefs délais pour échanger sur vos besoins en 
              <strong>réseaux, technique et maintenance</strong>.
            </p>

            <div style="margin-top:16px;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;">
                Rappel de votre demande
              </p>
              <div style="padding:12px 14px;border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb;white-space:pre-wrap;font-size:13px;color:#111827;line-height:1.6;">
                ${message}
              </div>
            </div>

            <div style="margin-top:20px;padding:12px 14px;border-radius:10px;background:#f9fafb;border:1px dashed #d1d5db;">
              <p style="margin:0;font-size:12px;color:#4b5563;line-height:1.5;">
                Si votre demande est urgente, vous pouvez également me joindre directement au 
                <strong>0812462888</strong> ou par email à 
                <strong>graciakutala00@gmail.com</strong>.
              </p>
            </div>

            ${
              newsletter
                ? `
            <div style="margin-top:16px;padding:10px 12px;border-radius:10px;background:#ecfdf5;border:1px solid #bbf7d0;">
              <p style="margin:0;font-size:12px;color:#166534;line-height:1.5;">
                Vous avez également demandé à être informé(e) de mes prochaines
                interventions et actualités par email. Merci pour votre confiance.
              </p>
            </div>
            `
                : ""
            }
          </div>

          <div style="padding:14px 24px;border-top:1px solid #e5e7eb;background:#f9fafb;">
            <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
              À bientôt,<br/>
              <strong style="color:#111827;">Gracia KUTALAKUDIMA</strong><br/>
              <span style="color:#4b5563;">Réseaux, technique et maintenance</span>
            </p>
          </div>
        </div>
      </div>
    `;

    // Envoi ADMIN
    if (adminList.length > 0) {
      await sendBrevoEmail({
        to: adminList,
        subject: "Nouvelle demande de contact - Portfolio Gracia",
        html: ownerHtml,
        requestId,
        tag: "contact-admin",
      });
    } else {
      console.warn(
        `[CONTACT][${requestId}] Aucun admin dans ADMIN_MAILS, email admin non envoyé`
      );
    }

    // Envoi VISITEUR
    await sendBrevoEmail({
      to: [email],
      subject: "Votre demande a bien été reçue",
      html: visitorHtml,
      requestId,
      tag: "contact-visitor",
    });

    // Si newsletter cochée → notifier admins
    if (newsletter) {
      console.log(
        `[CONTACT][${requestId}] Newsletter cochée, envoi info newsletter aux admins…`
      );

      const newsletterHtml = `
        <div style="margin:0;padding:24px;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
          <div style="max-width:520px;margin:0 auto;background:#020617;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.6);border:1px solid #1f2937;">
            <div style="padding:18px 22px;background:radial-gradient(circle at top left,#22c55e,#0ea5e9);">
              <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#e5e7eb;opacity:.85;">
                Nouvelle inscription newsletter (via formulaire contact)
              </p>
              <h1 style="margin:6px 0 0;font-size:18px;color:#f9fafb;font-weight:600;">
                Portfolio technique – Gracia KUTALAKUDIMA
              </h1>
            </div>
            <div style="padding:18px 22px;background:#020617;">
              <p style="margin:0 0 10px;font-size:13px;color:#e5e7eb;">
                Cette personne a coché la case newsletter dans le formulaire de contact :
              </p>
              <div style="margin-top:8px;padding:10px 12px;border-radius:10px;background:rgba(15,23,42,0.9);border:1px solid #1f2937;">
                <p style="margin:0;font-size:13px;color:#fbbf24;font-weight:500;">${email}</p>
                <p style="margin:6px 0 0;font-size:12px;color:#e5e7eb;">
                  Nom complet : ${finalPrenom} ${finalNom}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;

      if (adminList.length > 0) {
        await sendBrevoEmail({
          to: adminList,
          subject: "Newsletter (via contact) - Portfolio Gracia",
          html: newsletterHtml,
          requestId,
          tag: "newsletter-via-contact",
        });
      }
    }

    console.log(`[CONTACT][${requestId}] Réponse 200 envoyée au client`);
    return res.json({ success: true });
  } catch (err) {
    console.error(`[CONTACT][${requestId}] CONTACT API ERROR:`, err);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l’envoi des emails.",
    });
  }
});

// -------- NEWSLETTER --------
app.post("/api/newsletter", async (req, res) => {
  const requestId = Date.now().toString(36);
  console.log(`\n[NEWSLETTER][${requestId}] Requête reçue`);
  console.log(`[NEWSLETTER][${requestId}] Body:`, req.body);

  try {
    const { email } = req.body || {};

    console.log(`[NEWSLETTER][${requestId}] Validation de l'email…`);
    if (!email) {
      console.warn(
        `[NEWSLETTER][${requestId}] Validation échouée: email manquant`
      );
      return res
        .status(400)
        .json({ success: false, message: "Email obligatoire." });
    }

    if (!BREVO_API_KEY || !ADMIN_MAILS) {
      console.error(
        `[NEWSLETTER][${requestId}] BREVO_API_KEY ou ADMIN_MAILS manquant`
      );
      return res.status(500).json({
        success: false,
        message: "Configuration Brevo manquante côté serveur.",
      });
    }

    const adminList = ADMIN_MAILS.split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    console.log(`[NEWSLETTER][${requestId}] Liste admins:`, adminList);

    const html = `
      <div style="margin:0;padding:24px;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#020617;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.6);border:1px solid #1f2937;">
          <div style="padding:18px 22px;background:radial-gradient(circle at top left,#22c55e,#0ea5e9);">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#e5e7eb;opacity:.85;">
              Nouvelle inscription newsletter
            </p>
            <h1 style="margin:6px 0 0;font-size:18px;color:#f9fafb;font-weight:600;">
              Portfolio technique – Gracia KUTALAKUDIMA
            </h1>
          </div>
          <div style="padding:18px 22px;background:#020617;">
            <p style="margin:0 0 10px;font-size:13px;color:#e5e7eb;">
              Une nouvelle adresse email souhaite être tenue informée de vos activités :
            </p>
            <div style="margin-top:8px;padding:10px 12px;border-radius:10px;background:rgba(15,23,42,0.9);border:1px solid #1f2937;">
              <p style="margin:0;font-size:13px;color:#fbbf24;font-weight:500;">${email}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    if (adminList.length > 0) {
      await sendBrevoEmail({
        to: adminList,
        subject: "Nouvelle inscription newsletter - Portfolio Gracia",
        html,
        requestId,
        tag: "newsletter-admin",
      });
    } else {
      console.warn(
        `[NEWSLETTER][${requestId}] Aucun admin dans ADMIN_MAILS, email newsletter non envoyé`
      );
    }

    console.log(`[NEWSLETTER][${requestId}] Réponse 200 envoyée au client`);
    return res.json({ success: true });
  } catch (err) {
    console.error(`[NEWSLETTER][${requestId}] NEWSLETTER API ERROR:`, err);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l’inscription newsletter.",
    });
  }
});

// Lancer le serveur
const port = PORT || 10000;
app.listen(port, () => {
  console.log(`🚀 Backend API (Brevo HTTP) démarré sur http://localhost:${port}`);
});
