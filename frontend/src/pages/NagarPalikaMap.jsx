import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useParams } from "react-router-dom";
import io from "socket.io-client";


const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const buildingIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40],
});


function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (
    let i = 0, j = polygon.length - 1;
    i < polygon.length;
    j = i++
  ) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}


function ClickHandler({ boundary }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const inside = isPointInPolygon([lat, lng], boundary);

      if (inside) {
        alert(
          `✅ This point (${lat.toFixed(4)}, ${lng.toFixed(4)}) is INSIDE NagarPalika`
        );
      } else {
        alert(
          `❌ This point (${lat.toFixed(4)}, ${lng.toFixed(4)}) is OUTSIDE NagarPalika`
        );
      }
    },
  });

  return null;
}


export default function NagarPalikaMap({ mode }) {
  const nagarId = localStorage.getItem("nagarId");

  let type = "office";

  if (mode === "department") {
    const { deptId } = useParams();
    type = deptId;
  }

  const [boundary, setBoundary] = useState([]);
  const [reports, setReports] = useState([]);

  const pos = JSON.parse(localStorage.getItem("center"));
  const [center, setCenter] = useState([pos[1], pos[0]]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const boundaryRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/nagarpalika/${nagarId}/boundary`
        );

        setBoundary(boundaryRes.data.boundary);

        const reportsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/nagarpalika/${nagarId}/reports/${type}`
        );

        setReports(reportsRes.data);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    fetchData();
  }, [nagarId]);


  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND);

    socket.on("assigned", (report) => {
      if (
        report.nagarId === nagarId &&
        (type === "office" || report.department === type)
      ) {
        setReports((prev) => [...prev, report]);
      }
    });

    return () => {
      socket.off("assigned");
    };
  }, []);


  const getIconByStatus = (status) => {
    if (status === "completed") return greenIcon;
    if (status === "inprogress") return orangeIcon;
    if (status === "approved") return blueIcon;

    return redIcon;
  };


  return (
    <div className="flex bg-gray-100 w-full h-[80vh]">

      {/* Legend Panel */}
      <div className="w-60 rounded mr-6 bg-white shadow-lg p-4 border-r overflow-y-auto h-full">
        <h2 className="text-lg font-bold mb-3 text-indigo-700">
          🗺️ Legend
        </h2>

        <ul className="space-y-3 flex flex-col h-[70vh] justify-evenly">

          <li className="flex justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <img
                src={redIcon.options.iconUrl}
                alt="Pending"
                className="w-5 h-8"
              />
              <span className="text-indigo-700 text-xl">
                Pending Issue
              </span>
            </div>

            <div className="text-xl mt-[0.2rem] text-indigo-700">
              {reports.filter((r) => r.status === "pending").length}
            </div>
          </li>


          <li className="flex justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <img
                src={blueIcon.options.iconUrl}
                alt="Approved"
                className="w-5 h-8"
              />
              <span className="text-indigo-700 text-xl">
                Approved Issue
              </span>
            </div>

            <div className="text-xl mt-[0.2rem] text-indigo-700">
              {reports.filter((r) => r.status === "approved").length}
            </div>
          </li>


          <li className="flex justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <img
                src={orangeIcon.options.iconUrl}
                alt="In Progress"
                className="w-5 h-8"
              />
              <span className="text-indigo-700 text-xl">
                In Progress Issue
              </span>
            </div>

            <div className="text-xl mt-[0.2rem] text-indigo-700">
              {reports.filter((r) => r.status === "inprogress").length}
            </div>
          </li>


          <li className="flex justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <img
                src={greenIcon.options.iconUrl}
                alt="Completed"
                className="w-5 h-8"
              />
              <span className="text-indigo-700 text-xl">
                Completed Issue
              </span>
            </div>

            <div className="text-xl mt-[0.2rem] text-indigo-700">
              {reports.filter((r) => r.status === "completed").length}
            </div>
          </li>

        </ul>
      </div>


      {/* Map Section */}
      <div className="flex-1 h-full">
        <MapContainer
          center={center}
          zoom={8}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />


          {boundary.length > 0 && (
            <Polyline
              positions={[...boundary, boundary[0]]}
              pathOptions={{
                color: "red",
                weight: 3,
              }}
            />
          )}


          {boundary.length > 0 && (
            <Marker position={center} icon={buildingIcon}>
              <Popup>
                🏛️ <b>NagarPalika Office</b>
              </Popup>
            </Marker>
          )}


          {reports.map((issue, i) => (
            <Marker
              key={i}
              position={[
                issue.location.coordinates[1],
                issue.location.coordinates[0],
              ]}
              icon={getIconByStatus(issue.status)}
            >
              <Popup>
                <b>{issue.title}</b>
                <br />
                Status: {issue.status}
              </Popup>
            </Marker>
          ))}


          {boundary.length > 0 && (
            <ClickHandler boundary={boundary} />
          )}
        </MapContainer>
      </div>

    </div>
  );
}