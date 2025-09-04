import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  type: string;
}

interface Color {
  id: number;
  name: string;
  hex: string;
}

interface ProductColorImage {
  id?: number;
  product_id: number;
  color_id: number;
  url: string;
  sort: number;
}

const ProductColorImageUploader = () => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [image, setImage] = useState<ProductColorImage>({
    product_id: 0,
    color_id: 0,
    url: "",
    sort: 0,
  });

  const [existingImage, setExistingImage] = useState<ProductColorImage | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, colorRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/colors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProducts(productRes.data);
        setColors(colorRes.data);
      } catch (error) {
        console.error("Veriler yüklenemedi", error);
      }
    };

    fetchData();
  }, [token]);

  const fetchExistingImage = async (product_id: number, color_id: number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/productColorImage?product_id=${product_id}&color_id=${color_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.length > 0) {
        setExistingImage(response.data[0]);
      } else {
        setExistingImage(null);
      }
    } catch (error) {
      console.error("Görsel verisi alınamadı", error);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = Number(e.target.value);
    setSelectedProductId(productId);
    setImage((prev) => ({ ...prev, product_id: productId }));
    if (selectedColorId) fetchExistingImage(productId, selectedColorId);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const colorId = Number(e.target.value);
    setSelectedColorId(colorId);
    setImage((prev) => ({ ...prev, color_id: colorId }));
    if (selectedProductId) fetchExistingImage(selectedProductId, colorId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImage((prev) => ({
      ...prev,
      [name]: name === "sort" ? Number(value) : value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExistingImage((prev) => prev ? ({
      ...prev,
      [name]: name === "sort" ? Number(value) : value,
    }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedProductId || !selectedColorId) return;

    try {
      await axios.post("http://127.0.0.1:8000/api/productColorImage", image, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Varyantlı görsel eklendi.");
      fetchExistingImage(selectedProductId, selectedColorId);
      setImage({ product_id: selectedProductId, color_id: selectedColorId, url: "", sort: 0 });
    } catch (error: any) {
      alert("Ekleme başarısız: " + JSON.stringify(error.response?.data || error));
    }
  };

  const handleUpdate = async () => {
    if (!token || !existingImage?.id) return;
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/productColorImage/${existingImage.id}`,
        existingImage,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Görsel güncellendi.");
    } catch (error) {
      alert("Güncelleme başarısız.");
    }
  };

  const handleDelete = async () => {
    if (!token || !existingImage?.id) return;
    const confirmDelete = window.confirm("Görseli silmek istediğine emin misin?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/productColorImage/${existingImage.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Görsel silindi.");
      setExistingImage(null);
    } catch (error) {
      alert("Silme başarısız.");
    }
  };

  return (
    <div className="wrapper">
      {/* Sol: Ekleme */}
      <div className="form-wrapper">
        <h2>Varyantlı Ürün Görseli Ekle</h2>
        <form onSubmit={handleSubmit}>
          <label>Ürün Seç</label>
          <select onChange={handleProductChange} value={selectedProductId ?? ""} required>
            <option value="">Bir ürün seçin</option>
            {products.filter((p) => p.type === "VARIANTED").map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <label>Renk Seç</label>
          <select name="color_id" value={selectedColorId ?? ""} onChange={handleColorChange} required>
            <option value="">Bir renk seçin</option>
            {colors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.hex})
              </option>
            ))}
          </select>

          <label>Görsel URL</label>
          <input type="text" name="url" value={image.url} onChange={handleChange} required />

          <label>Sıralama</label>
          <input type="number" name="sort" value={image.sort} onChange={handleChange} required />

          <button type="submit">Görseli Kaydet</button>
        </form>
      </div>

      {/* Sağ: Güncelle/Sil */}
      <div className="form-wrapper">
        <h2>Görsel Güncelle/Sil</h2>
        {existingImage ? (
          <>
            <label>URL</label>
            <input type="text" name="url" value={existingImage.url} onChange={handleEditChange} />

            <label>Sıralama</label>
            <input type="number" name="sort" value={existingImage.sort} onChange={handleEditChange} />

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button type="button" onClick={handleUpdate}>Güncelle</button>
              <button type="button" onClick={handleDelete} style={{ backgroundColor: "#e74c3c", color: "#fff" }}>
                Sil
              </button>
            </div>
          </>
        ) : (
          <p>Bu ürün ve renge ait görsel bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default ProductColorImageUploader;
