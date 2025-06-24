import React, { useEffect, useState } from "react";
import "../style/style-input.css";
import Navbar from "../components/navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const EditLaporan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_pelapor: "",
    nomor_pelapor: "",
    alamat_pelapor: "",
    tanggal_pelaporan: "",
    deskripsi: "",
    latitude: "",
    longitude: "",
    status_laporan: "Pending",
  });

  // Ambil data laporan berdasarkan ID
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/laporan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (error) {
        console.error("Gagal memuat data laporan:", error);
      }
    };

    fetchLaporan();
  }, [id]);

  // Setup peta dan marker
  useEffect(() => {
    if (L.DomUtil.get("form-map") !== null) {
      L.DomUtil.get("form-map")._leaflet_id = null;
    }

    const map = L.map("form-map").setView([-7.9916, 110.6169], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 0);

    let marker = null;

    const setSingleMarker = (lat, lng, popupText = "") => {
      const latitude = Number(lat);
      const longitude = Number(lng);

      if (marker) {
        marker.setLatLng([latitude, longitude]);
      } else {
        marker = L.marker([latitude, longitude]).addTo(map);
      }

      if (popupText) {
        marker.bindPopup(popupText).openPopup();
      }

      setFormData((prev) => ({
        ...prev,
        latitude: latitude.toFixed(8),
        longitude: longitude.toFixed(8),
      }));
    };

    if (formData.latitude && formData.longitude) {
      map.setView([formData.latitude, formData.longitude], 14);
      setSingleMarker(formData.latitude, formData.longitude, "Lokasi saat ini");
    }

    map.on("click", function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setSingleMarker(lat, lng);
    });
  }, [formData.latitude, formData.longitude]);

  // Handle input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/laporan/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Laporan berhasil diperbarui!");
      navigate("/data");
    } catch (error) {
      alert("Gagal memperbarui laporan");
      console.error(error.response?.data);
    }
  };

  return (
    <>
      <Navbar />
      <div className="forminput-page">
        <div className="forminput-container">
          <h2>Edit Laporan Kekeringan</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nama_pelapor">Nama Pelapor</label>
            <input
              type="text"
              id="nama_pelapor"
              name="nama_pelapor"
              value={formData.nama_pelapor}
              onChange={handleChange}
              required
            />

            <label htmlFor="nomor_pelapor">Nomor Pelapor</label>
            <input
              type="text"
              id="nomor_pelapor"
              name="nomor_pelapor"
              value={formData.nomor_pelapor}
              onChange={handleChange}
              required
            />

            <label htmlFor="alamat_pelapor">Alamat Pelapor</label>
            <textarea
              id="alamat_pelapor"
              name="alamat_pelapor"
              value={formData.alamat_pelapor}
              onChange={handleChange}
              required
            ></textarea>

            <label htmlFor="tanggal_pelaporan">Tanggal Pelaporan</label>
            <input
              type="date"
              id="tanggal_pelaporan"
              name="tanggal_pelaporan"
              value={formData.tanggal_pelaporan}
              onChange={handleChange}
              required
            />

            <label htmlFor="deskripsi">Deskripsi</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
            ></textarea>

            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              step="0.00000001"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />

            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              step="0.00000001"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />

            <label>Pilih Lokasi pada Peta</label>
            <div id="form-map" className="forminput-map"></div>

            <label htmlFor="status_laporan">Status Laporan</label>
            <select
              id="status_laporan"
              name="status_laporan"
              value={formData.status_laporan}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Selesai">Selesai</option>
            </select>

            <button type="submit">Update Laporan</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditLaporan;
