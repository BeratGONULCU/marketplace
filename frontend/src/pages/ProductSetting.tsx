import React, { useEffect, useState } from "react";
import "../productSetting.css";
import axios from "axios"; // HTTP istekleri için axios

interface Product {
  title: string;
  type: string;
  description: string;
  base_price: number | null; // numeric(12,2) için number | null
  base_stock: number | null; // integer veya numeric(12,2) için number | null
  is_published: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  user_id: number | null; // user_id için number | null
}

const App = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    email: "example@email.com",
    password: "",
    isAdmin: false,
    isActive: true,
  });

  const [product, setProduct] = useState<Product>({
    title: "",
    type: "",
    description: "",
    base_price: null,
    base_stock: null,
    is_published: true,
    created_at: null, // eğer ürün ilk defa oluşturuluyorsa ? ekle : değiştirme
    updated_at: null, // eğer ürün varsa ve güncellendiyse ? değiştir : null
    user_id: null, // useAuth ile ya da session ile alıcaz.
  });

  // FastAPI'dan user_id'yi al
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/me"); // FastAPI endpoint'i
        const { user_id } = response.data;
        if (user_id) {
          setProduct((prev) => ({
            ...prev,
            user_id: user_id,
          }));
        }
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı:", error);
      }
    };
    fetchUser();
  }, []); // Boş bağımlılık dizisi ile sadece bir kez çalışır

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "base_stock" || name === "base_price"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }

    const payload = {
      email: user.email,
      hashed_password: user.password, 
      is_active: user.isActive,
      is_admin: user.isAdmin,
      role: user.isAdmin ? "admin" : "user",
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/me",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // localStorage'dan al
          },
        }
      );

      console.log("kullanıcı oluşturuldu:", response.data);
    } catch (error) {
      console.error("kullanıcı oluşturulamadı:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Ürün Ayarları</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="title">
            <label htmlFor="title">ürün adı</label>
            <input
              type="title"
              name="title"
              id="title"
              value={product.title}
              onChange={handleChange}
              required
              placeholder="ürün adı"
            />
          </div>

          <div className="type">
            <label htmlFor="type">ürün tipi</label>
            <input
              type="type"
              name="type"
              id="type"
              value={product.type}
              onChange={handleChange}
              placeholder="ürün tipini girin."
            />
          </div>

          <div className="description">
            <label htmlFor="description">açıklama</label>
            <input
              type="description"
              name="description"
              id="description"
              value={product.description}
              onChange={handleChange}
              placeholder="ürün açıklamasını girin."
            />
          </div>

          <div className="base_price">
            <label htmlFor="base_price">
              ürün fiyat - (eğer variant ise boş bırak)
            </label>
            <input
              type="base_price"
              name="base_price"
              id="base_price"
              value={product.base_price !== null ? product.base_price : ""}
              onChange={handleChange}
              placeholder="ürün fiyatını bilgisini girin. boş kalabilir"
            />
          </div>

          <div className="base_stock">
            <label htmlFor="base_stock">
              ürün stok - (eğer variant ise boş bırak)
            </label>
            <input
              type="base_stock"
              name="base_stock"
              id="base_stock"
              value={product.base_stock !== null ? product.base_stock : ""}
              onChange={handleChange}
              placeholder="ürün stok bilgisini girin. boş kalabilir"
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
