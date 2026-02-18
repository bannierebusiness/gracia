// netlify/functions/contact.js
const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // Autoriser uniquement POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { nom, prenom, email, type, message } = data;

    if (!nom || !prenom || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Nom, prénom, email et message sont obligatoires.",
        }),
      };
    }

    // Récupération des paramètres SMTP depuis les variables d'environnement
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      ADMIN_MAILS,
      FROM_EMAIL,
      FROM_NAME,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_MAILS) {
      console.error("Variables SMTP / ADMIN_MAILS manquantes.");
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Configuration SMTP manquante côté serveur.",
        }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, // STARTTLS sur 587 par ex.
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const adminList = ADMIN_MAILS.split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    // ========== 1) Email que TOI (admins) vous recevez ==========
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
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;"><strong>Nom :</strong> ${nom}</p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;"><strong>Prénom :</strong> ${prenom}</p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;"><strong>Email :</strong> ${email}</p>
              <p style="margin:2px 0;font-size:13px;color:#e5e7eb;">
                <strong>Type de demande :</strong> ${type || "Non précisé"}
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

    if (adminList.length > 0) {
      await transporter.sendMail({
        from: `"${FROM_NAME || "Portfolio Gracia"}" <${FROM_EMAIL || SMTP_USER}>`,
        to: adminList,
        subject: "Nouvelle demande de contact - Portfolio Gracia",
        html: ownerHtml,
      });
    }

    // ========== 2) Accusé de réception au visiteur ==========
    const visitorHtml = `
      <div style="margin:0;padding:24px;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 18px 45px rgba(15,23,42,0.22);border:1px solid #e5e7eb;">
          <div style="padding:20px 24px;background:linear-gradient(135deg,#0f172a,#1f2937);">
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#e5e7eb;opacity:.85;">
              Accusé de réception
            </p>
            <h1 style="margin:6px 0 0;font-size:20px;color:#f9fafb;font-weight:600;">
              Merci pour votre message, ${prenom}
            </h1>
          </div>

          <div style="padding:20px 24px;background:#ffffff;">
            <p style="margin:0 0 8px;font-size:14px;color:#111827;line-height:1.6;">
              Bonjour ${prenom},
            </p>
            <p style="margin:0 0 12px;font-size:14px;color:#111827;line-height:1.6;">
              Merci de m&apos;avoir contacté. J&apos;ai bien reçu votre message et je reviendrai vers vous 
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

    await transporter.sendMail({
      from: `"${FROM_NAME || "Portfolio Gracia"}" <${FROM_EMAIL || SMTP_USER}>`,
      to: email,
      subject: "Votre demande a bien été reçue",
      html: visitorHtml,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("CONTACT FUNCTION ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Erreur serveur lors de l’envoi des emails.",
      }),
    };
  }
};
