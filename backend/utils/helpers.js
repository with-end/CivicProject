const axios = require("axios");
const { EMAIL_USER, FRONTEND_URL } = require("../config/dotenv.config");
const transporter = require("../utils/transporter.js");

// -------------------------
// Cosine Similarity
// -------------------------
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);

  const normA = Math.sqrt(
    a.reduce((sum, value) => sum + value * value, 0)
  );

  const normB = Math.sqrt(
    b.reduce((sum, value) => sum + value * value, 0)
  );

  return dot / (normA * normB);
}

// -------------------------
// Check nearby hospital/school
// -------------------------
async function hasHospitalOrSchool(lat, lng) {
  const query = `
[out:json];
(
  node["amenity"="hospital"](around:500,${lat},${lng});
  way["amenity"="hospital"](around:500,${lat},${lng});
  node["amenity"="school"](around:500,${lat},${lng});
  way["amenity"="school"](around:500,${lat},${lng});
);
out 1;
`;

  try {
    const res = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: {
          "Content-Type": "text/plain",
          "User-Agent": "CivicConnect/1.0",
        },
      }
    );

    return res.data.elements.length > 0;
  } catch (err) {
    console.log(err.response?.status);
    console.log(err.response?.data);
    return false;
  }
}

// -------------------------
// Send Email
// -------------------------
async function sendMail(email, status, issueId) {
  try {
    let text;

    if (status === "submitted") {
      text = `Your request has been accepted and your Issue ID is ${issueId}`;
    } else {
      text = `The current status of your Issue ${issueId} is ${status}`;
    }

    const info = await transporter.sendMail({
      from: `"CivicConnect" <${EMAIL_USER}>`,
      to: email,
      subject: "Regarding your civic issue",
      text,
      html: `
        <h1>
          Click on the link to check the status of ${issueId}
          <a href="${FRONTEND_URL}/public/track">
            Check Status
          </a>
        </h1>
      `,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = {
  cosineSimilarity,
  hasHospitalOrSchool,
  sendMail,
};