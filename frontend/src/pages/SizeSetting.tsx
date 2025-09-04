import React, { useEffect, useState } from "react";
import "../main.css";
import axios from "axios";

interface Size {
  id?: number;
  code: string;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [size, setSize] = useState<Size>({ code: "" });
  const [allSizes, setAllSizes] = useState<Size[]>([]);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState("");

  // Mevcut bedenleri getir
  const fetchSizes = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/sizes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllSizes(response.data);
    } catch (error) {
      console.error("Bedenler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize({ ...size, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const payload = { code: size.code };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/sizes",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Beden oluşturuldu: " + JSON.stringify(response.data));
      setSize({ code: "" });
      fetchSizes(); // listeyi güncelle
    } catch (error) {
      alert("Beden oluşturulamadı: " + error);
    }
  };

  const handleSizeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const found = allSizes.find((s) => s.id === selectedId);
    if (found) {
      setSelectedSizeId(found.id || null);
      setEditCode(found.code);
    }
  };

  const handleUpdate = async () => {
    if (!token || !selectedSizeId) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/sizes/${selectedSizeId}`,
        { code: editCode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Beden güncellendi.");
      fetchSizes();
    } catch (error) {
      alert("Beden güncellenemedi: " + error);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedSizeId) return;

    const confirm = window.confirm("Bu bedeni silmek istediğinizden emin misiniz?");
    if (!confirm) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/sizes/${selectedSizeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Beden silindi.");
      setSelectedSizeId(null);
      setEditCode("");
      fetchSizes();
    } catch (error) {
      alert("Beden silinemedi: " + error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text">
            <label htmlFor="text">Beden Kodu</label>
            <input
              type="text"
              name="code"
              id="code"
              value={size.code}
              onChange={handleChange}
              required
              placeholder="beden kodu"
            />
          </div>

          <div className="submit">
            <button type="submit">Ayarları Kaydet</button>
          </div>
        </form>
      </div>

      <div className="form-wrapper">
        <div className="text">
          <label>Beden Seç:</label>
          <select value={selectedSizeId || ""} onChange={handleSizeSelect}>
            <option value="">-- Seçiniz --</option>
            {allSizes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}
              </option>
            ))}
          </select>
        </div>

        {selectedSizeId && (
          <>
            <div className="text">
              <label htmlFor="editCode">Yeni Kod</label>
              <input
                type="text"
                id="editCode"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
              />
            </div>

            <div className="submit" style={{ display: "flex", gap: "1rem" }}>
              <button type="button" onClick={handleUpdate}>
                Güncelle
              </button>
              <button type="button" onClick={handleDelete} style={{ backgroundColor: "#e74c3c" }}>
                Sil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
