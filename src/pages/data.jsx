import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "../style/style-data.css";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import copy from "copy-to-clipboard";

const DataPelaporan = () => {
  const [laporans, setLaporans] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await axios.get("http://103.27.206.43:8000/api/laporan");
        setLaporans(response.data);
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
      }
    };

    fetchLaporan();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://103.27.206.43:8000/api/laporan/${id}/status`,
        {
          status_laporan: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLaporans((prev) =>
        prev.map((lap) =>
          lap.id === id ? { ...lap, status_laporan: newStatus } : lap
        )
      );
    } catch (error) {
      console.error("Gagal mengubah status:", error);
    }
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus laporan ini?"
    );
    if (!konfirmasi) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://103.27.206.43:8000/api/laporan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLaporans((prev) => prev.filter((lap) => lap.id !== id));
    } catch (error) {
      console.error("Gagal menghapus laporan:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(laporans);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer]), "laporan_kekeringan.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(laporans);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "laporan_kekeringan.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Data Pelaporan Kekeringan", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [
        [
          "No",
          "Tanggal",
          "Nama",
          "Nomor",
          "Alamat",
          "Koordinat",
          "Deskripsi",
          "Status",
        ],
      ],
      body: laporans.map((lap, i) => [
        i + 1,
        lap.tanggal_pelaporan,
        lap.nama_pelapor,
        lap.nomor_pelapor,
        lap.alamat_pelapor,
        `${lap.latitude}, ${lap.longitude}`,
        lap.deskripsi,
        lap.status_laporan,
      ]),
    });
    doc.save("laporan_kekeringan.pdf");
  };

  const copyToClipboard = () => {
    const rows = laporans.map(
      (lap, i) =>
        `${i + 1}\t${lap.tanggal_pelaporan}\t${lap.nama_pelapor}\t${
          lap.nomor_pelapor
        }\t${lap.alamat_pelapor}\t${lap.latitude}, ${lap.longitude}\t${
          lap.deskripsi
        }\t${lap.status_laporan}`
    );
    copy(rows.join("\n"));
    alert("Data berhasil disalin ke clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Daftar Pelaporan Kejadian Kekeringan</h1>
        <p>Segera lapor jika terjadi kekeringan di sekitar anda.</p>

        <div className="actions">
          <div className="left-buttons">
            <button onClick={copyToClipboard}>Copy</button>
            <button onClick={exportToCSV}>CSV</button>
            <button onClick={exportToExcel}>Excel</button>
            <button onClick={exportToPDF}>PDF</button>
            <button onClick={handlePrint}>Print</button>
          </div>
          <a href="/input" className="lapor-button">
            Lapor
          </a>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Nama Pelapor</th>
              <th>Nomor Telepon</th>
              <th>Alamat</th>
              <th>Koordinat</th>
              <th>Deskripsi</th>
              <th>Status</th>
              {role === "admin" && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {laporans.map((laporan, index) => (
              <tr key={laporan.id}>
                <td>{index + 1}</td>
                <td>{laporan.tanggal_pelaporan}</td>
                <td>{laporan.nama_pelapor}</td>
                <td>{laporan.nomor_pelapor}</td>
                <td>{laporan.alamat_pelapor}</td>
                <td>
                  {laporan.latitude}, {laporan.longitude}
                </td>
                <td>{laporan.deskripsi}</td>
                <td>
                  {role === "admin" ? (
                    <select
                      value={laporan.status_laporan}
                      onChange={(e) =>
                        handleStatusChange(laporan.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  ) : (
                    laporan.status_laporan
                  )}
                </td>
                {role === "admin" && (
                  <td>
                    {role === "admin" && (
                      <div className="admin-actions">
                        <button
                          className="edit-btn"
                          onClick={() =>
                            (window.location.href = `/edit/${laporan.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(laporan.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default DataPelaporan;
