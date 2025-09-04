import React, { useEffect, useState } from "react";
import "../main.css";
import axios from "axios";

interface Category {
  id?: number;
  name: string;
  slug: string;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [category, setCategory] = useState<Category>({ name: "", slug: "" });
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllCategories(response.data);
    } catch (error) {
      console.error("Kategoriler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const payload = { name: category.name, slug: category.slug };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/categories",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Kategori oluşturuldu: " + JSON.stringify(response.data));
      setCategory({ name: "", slug: "" });
      fetchCategories(); // Listeyi yenile
    } catch (error) {
      alert("Kategori oluşturulamadı: " + error);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const selected = allCategories.find((c) => c.id === selectedId);
    if (selected) {
      setSelectedCategoryId(selected.id || null);
      setEditName(selected.name);
      setEditSlug(selected.slug);
    }
  };

  const handleUpdate = async () => {
    if (!token || !selectedCategoryId) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/categories/${selectedCategoryId}`,
        { name: editName, slug: editSlug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Kategori güncellendi.");
      fetchCategories();
    } catch (error) {
      alert("Kategori güncellenemedi: " + error);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedCategoryId) return;
    const confirmDelete = window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/categories/${selectedCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Kategori silindi.");
      setSelectedCategoryId(null);
      setEditName("");
      setEditSlug("");
      fetchCategories();
    } catch (error) {
      alert("Kategori silinemedi: " + error);
    }
  };

  return (
    <div className="wrapper">
      {/* Sol: Kategori oluşturma */}
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text">
            <label htmlFor="name">kategori adı</label>
            <input
              type="text"
              name="name"
              id="name"
              value={category.name}
              onChange={handleChange}
              required
              placeholder="kategori adı"
            />
          </div>

          <div className="text">
            <label htmlFor="slug">kategori slug kodu</label>
            <input
              type="text"
              name="slug"
              id="slug"
              value={category.slug}
              onChange={handleChange}
              required
              placeholder="örn: spor-ayakkabi"
            />
          </div>

          <div className="submit">
            <button type="submit">Ayarları Kaydet</button>
          </div>
        </form>
      </div>

      {/* Sağ: Kategori güncelleme/silme */}
      <div className="form-wrapper">
        <div className="text">
          <label>Kategori Seç:</label>
          <select value={selectedCategoryId || ""} onChange={handleSelect}>
            <option value="">-- Seçiniz --</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategoryId && (
          <>
            <div className="text">
              <label>Yeni Ad</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="text">
              <label>Yeni Slug</label>
              <input
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
              />
            </div>

            <div className="submit" style={{ display: "flex", gap: "1rem" }}>
              <button type="button" onClick={handleUpdate}>
                Güncelle
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{ backgroundColor: "#e74c3c" }}
              >
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
