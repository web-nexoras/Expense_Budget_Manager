
const { emailTemp } = require("./emailTemp");

const mailSender = async ({
  to,
  name,
  otp,
  purpose,
  expiresInMinutes,
}) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing from .env");
  }

  if (!process.env.MAIL_FROM) {
    throw new Error("MAIL_FROM is missing from .env");
  }

  // Brevo expects a bare address; accept either user@domain.com or Name <user@domain.com>.
  const senderEmail =
    process.env.MAIL_FROM.match(/<([^<>]+)>/)?.[1]?.trim() ||
    process.env.MAIL_FROM.trim();

  const { subject, text, html } = emailTemp({
    name,
    otp,
    purpose,
    expiresInMinutes,
  });

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: "Expense Budget Manager",
      },
      to: [{ email: to, name }],
      subject,
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    let detail = responseBody;

    try {
      const error = JSON.parse(responseBody);
      detail = error.message || error.code || responseBody;
    } catch {
      // Keep the raw response text when Brevo does not return JSON.
    }

    throw new Error(`Brevo email API returned ${response.status}: ${detail || "Email sending failed"}`);
  }

  return await response.json();
};

module.exports = { mailSender };
