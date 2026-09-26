const TEXTBEE_API_URL =
  "https://api.textbee.dev/api/v1/gateway/send-sms";

const normalizePhone = (phone) => {
  const value = String(phone || "").trim();

  if (value.startsWith("+")) {
    return value;
  }

  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    return `+${cleaned}`;
  }

  throw new Error("Invalid parent phone number");
};

const sendSms = async (phone, message) => {
  const apiKey = process.env.TEXTBEE_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey) {
    throw new Error("TEXTBEE_API_KEY is missing");
  }

  if (!deviceId) {
    throw new Error("TEXTBEE_DEVICE_ID is missing");
  }

  const recipient = normalizePhone(phone);

  const response = await fetch(TEXTBEE_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deviceId,
      recipients: [recipient],
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("TEXTBEE ERROR:", data);
    throw new Error(data.message || "Failed to send SMS");
  }

  console.log("SMS SENT:", data);

  return data;
};

module.exports = { sendSms };