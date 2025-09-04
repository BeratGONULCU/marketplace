import React, { useEffect, useState } from "react";
import "../main.css"
import axios from "axios"; // HTTP istekleri için axios

interface Category {
  name: string;
  slug: string;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [category, setCategory] = useState<Category>({
    name: "",
    slug: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value, // input name değerine göre güncelle
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }

    const payload = {
      name: category.name,
      slug: category.slug,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/categories",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // localStorage'dan al
          },
        }
      );

      alert("kategori oluşturuldu: " + JSON.stringify(response.data));
      setCategory({ name: "", slug: "" });
    } catch (error) {
      alert("kategori oluşturulamadı: " + error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text">
            <label htmlFor="text">kategori adı</label>
            <input
              type="text"
              name="category"
              id="category"
              value={category.name}
              onChange={handleChange}
              required
              placeholder="kategori adı"
            />
          </div>

          <div className="text">
            <label htmlFor="text">kategori slug kodu</label>
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
    </div>
  );
};

export default App;
