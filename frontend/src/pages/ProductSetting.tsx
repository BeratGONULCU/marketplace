import React, { useEffect, useState } from "react";
import "../productSetting.css";
import axios from "axios";

interface Product {
  id?: number;
  title: string;
  type: string;
  description: string | null;
  base_price: number | null;
  base_stock: number | null;
  is_published: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  user_id: number | null;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const [product, setProduct] = useState<Product>({
    title: "",
    type: "",
    description: "",
    base_price: null,
    base_stock: null,
    is_published: true,
    created_at: null,
    updated_at: null,
    user_id: null,
  });

  // Kullanıcıdan user_id'yi al
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { user_id } = response.data;
        if (user_id) {
          setProduct((prev) => ({ ...prev, user_id }));
        }
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı:", error);
      }
    };
    fetchUser();
  }, [token]);

  // Mevcut ürünleri getir
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Ürünler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Ürün seçimi yapılınca formu doldur
  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedProductId(id);
    const selected = products.find((p) => p.id === id);
    if (selected) setProduct(selected);
  };

  // Form değişikliği
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  // Ürün oluştur
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = { ...product };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/products",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Ürün oluşturuldu");
      setProduct({
        title: "",
        type: "",
        description: "",
        base_price: null,
        base_stock: null,
        is_published: true,
        created_at: null,
        updated_at: null,
        user_id: product.user_id,
      });
      fetchProducts();
    } catch (error) {
      alert("Oluşturma başarısız.");
    }
  };

  // Ürün güncelle
  const handleUpdate = async () => {
    if (!token || !selectedProductId) return;

    const payload = {
      title: product.title,
      type: product.type,
      description: product.description,
      base_price: product.base_price,
      base_stock: product.base_stock,
      is_published: product.is_published,
    };

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/products/${selectedProductId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Ürün güncellendi.");
      fetchProducts();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Güncelleme başarısız.");
    }
  };

  // Ürün sil
  const handleDelete = async () => {
    if (!token || !selectedProductId) return;
    const confirmDelete = window.confirm(
      "Bu ürünü silmek istediğinize emin misiniz?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/products/${selectedProductId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Ürün silindi.");
      setProduct({
        title: "",
        type: "",
        description: "",
        base_price: null,
        base_stock: null,
        is_published: true,
        created_at: null,
        updated_at: null,
        user_id: product.user_id,
      });
      setSelectedProductId(null);
      fetchProducts();
    } catch (error) {
      alert("Silme başarısız.");
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Ürün Ayarları</h2>

        <label>Ürün Seç</label>
        <select onChange={handleProductSelect} value={selectedProductId ?? ""}>
          <option value="">Yeni Ürün</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="title">
            <label htmlFor="title">ürün adı</label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              required
              placeholder="ürün adı"
            />
          </div>

          <div className="type">
            <label htmlFor="type">Ürün Tipi</label>
            <select
              name="type"
              value={product.type}
              onChange={handleChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="STANDARD">STANDARD</option>
              <option value="VARIANTED">VARIANTED</option>
            </select>
          </div>

          <div className="description">
            <label htmlFor="description">açıklama</label>
            <input
              type="text"
              name="description"
              value={product.description || ""}
              onChange={handleChange}
              placeholder="ürün açıklaması"
            />
          </div>

          <div className="base_price">
            <label>ürün fiyat</label>
            <input
              type="number"
              step="0.01"
              name="base_price"
              value={product.base_price ?? ""}
              onChange={handleChange}
              placeholder="örn: 99.90"
            />
          </div>

          <div className="base_stock">
            <label>ürün stok</label>
            <input
              type="number"
              name="base_stock"
              value={product.base_stock ?? ""}
              onChange={handleChange}
              placeholder="örn: 100"
            />
          </div>

          <div
            className="submit"
            style={{
              display: "flex",
              flexDirection: "row", // ➜ yan yana diz
              justifyContent: "center", // ➜ ortala
              alignItems: "center",
              gap: "1rem", // ➜ butonlar arası boşluk
              marginTop: "1rem",
            }}
          >
            <button
              type="submit"
              style={{
                flex: "1",
                minWidth: "100px",
                padding: "0.5rem",
              }}
            >
              Yeni Oluştur
            </button>

            {selectedProductId && (
              <>
                <button
                  type="button"
                  onClick={handleUpdate}
                  style={{
                    flex: "1",
                    minWidth: "100px",
                    padding: "0.5rem",
                  }}
                >
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    flex: "1",
                    minWidth: "100px",
                    padding: "0.5rem",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                  }}
                >
                  Sil
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
