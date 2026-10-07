const sendEmail = async ({ to, toName, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is missing");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "SLOMS",
        email: "sloms.college@gmail.com",
      },
      to: [
        {
          email: to,
          name: toName || "",
        },
      ],
      subject,
      htmlContent,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("BREVO ERROR:", data);
    throw new Error(data.message || "Failed to send email");
  }

  console.log("BREVO EMAIL SENT:", data);

  return data;
};

module.exports = { sendEmail };
