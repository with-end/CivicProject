import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { useTranslation } from "react-i18next";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { openDB } from "idb";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DB_NAME = "reportsDB";
const STORE_NAME = "pendingReports";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "reportId",
        });
      }
    },
  });
}

async function saveReportToDB(report) {
  const db = await getDB();
  await db.put(STORE_NAME, report);
}

function LocationPicker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });

  return location ? <Marker position={location} /> : null;
}

export default function SubmitReport() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const nagarId = localStorage.getItem("nagarId");
  const myLocation = JSON.parse(localStorage.getItem("myLocation"));
  const pos = JSON.parse(localStorage.getItem("center"));
  const emailId = useSelector((state) => state.auth.email);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState(myLocation || null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(emailId || null);

  const fileInputRef = useRef(null);

  const mapCenter = myLocation || [pos[1], pos[0]];

  const handleSpeak = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(t("speechNotSupported"));
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = `${i18n.language}-IN`;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setDescription((prev) => `${prev} ${spokenText}`.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleCapture = async () => {
    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert(t("cameraNotSupported"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const video = document.createElement("video");

      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      const file = new File([blob], "capture.jpg", {
        type: "image/jpeg",
      });

      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Camera error:", err);
      toast.error(t("cameraError"));
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert(t("selectLocation"));
      return;
    }

    setLoading(true);

    const reportId = uuidv4();

    const report = {
      reportId,
      reporterEmail: email,
      nagarId,
      title,
      description,
      location: {
        type: "Point",
        coordinates: [location[1], location[0]],
      },
      status: "submitted",
    };

    if (imageFile) {
      report.imageBase64 = await fileToBase64(imageFile);
    }

    try {
      const formData = new FormData();

      formData.append("reporterEmail", report.reporterEmail);
      formData.append("title", report.title);
      formData.append("description", report.description);
      formData.append(
        "location",
        JSON.stringify(report.location)
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reports/${nagarId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message === "reportSubmitted") {
        toast.success(t(res.data.message));
        navigate("/public");
      } else {
        toast.error(t(res.data.message));
      }
    } catch (err) {
      console.warn(
        "Offline or network issue, saving report locally.",
        err
      );

      await saveReportToDB(report);

      if (
        "serviceWorker" in navigator &&
        "SyncManager" in window
      ) {
        const registration =
          await navigator.serviceWorker.ready;

        await registration.sync.register("sync-reports");

        toast.success(t("reportOffline"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 lg:p-4 h-[83vh] flex flex-col-reverse md:flex-row gap-4">

      {/* Form */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl max-sm:hidden font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
          {t("submitReport")}
        </h2>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder={t("title")}
            className="p-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder={t("emailId")}
            className="p-2 border rounded-lg"
            value={email}
            inputMode="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <textarea
            placeholder={t("description")}
            className="p-2 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex flex-wrap gap-3 mb-2">
            <button
              type="button"
              onClick={handleSpeak}
              className="flex-1 bg-gradient-to-r from-[#01D2F1] via-[#0B9FE7] to-[#1567D7] text-white py-2 rounded-lg text-sm"
            >
              🎤 {t("speak")}
            </button>

            <button
              type="button"
              onClick={handleCapture}
              className="flex-1 bg-gradient-to-r from-[#F52ACB] via-[#D91BB4] to-[#A5009E] text-white py-2 rounded-lg text-sm"
            >
              📸 {t("capture")}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex-1 bg-gradient-to-r from-[#6B7280] via-[#4B5563] to-[#374151] text-white py-2 rounded-lg text-sm"
            >
              📁 {t("upload")}
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="relative w-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="hidden md:block w-full h-40 bg-gray-200 rounded-lg" />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#9CFF00] via-[#52E600] to-[#1FCB00] hover:bg-green-600 text-white py-2 rounded-xl font-semibold"
          >
            {loading
              ? t("submitting")
              : t("submitReport")}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-2">
          {t("clickOnMap")}
        </p>
      </div>

      {/* Map */}
      <div className="w-full md:w-2/3 h-[40vh] md:h-[100%] rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          center={mapCenter}
          zoom={12}
          className="w-full h-full z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LocationPicker
            location={location}
            setLocation={setLocation}
          />
        </MapContainer>
      </div>

      <h2 className="text-2xl md:hidden font-bold bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
        {t("submitReport")}
      </h2>
    </div>
  );
}