import React, { useEffect, useState } from "react";
import axios from "axios";
import "../main.css";

interface Product {
  id: number;
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

interface ProductImage {
  id?: number;
  product_id: number;
  url: string;
  sort: number;
}

const ProductImageUploader = () => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const [image, setImage] = useState<ProductImage>({
    product_id: 0,
    url: "",
    sort: 0,
  });

  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [editImage, setEditImage] = useState<ProductImage>({
    product_id: 0,
    url: "",
    sort: 0,
  });
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  // Ürünleri getir
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Ürünler yüklenemedi", error);
      }
    };

    fetchProducts();
  }, [token]);

  // Seçilen ürünün görsellerini getir
  const fetchProductImages = async (productId: number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/productImage?product_id=${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductImages(response.data);
      if (response.data.length > 0) {
        setEditImage(response.data[0]);
        setSelectedImageId(response.data[0].id || null);
      } else {
        setEditImage({ product_id: productId, url: "", sort: 0 });
        setSelectedImageId(null);
      }
    } catch (error) {
      console.error("Görseller alınamadı", error);
    }
  };

  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = Number(e.target.value);
    setSelectedProductId(productId);
    setImage({ product_id: productId, url: "", sort: 0 });
    fetchProductImages(productId);
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
    setEditImage((prev) => ({
      ...prev,
      [name]: name === "sort" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedProductId) return;

    try {
      await axios.post("http://127.0.0.1:8000/api/productImage", image, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Görsel başarıyla eklendi");
      setImage({ product_id: selectedProductId, url: "", sort: 0 });
      fetchProductImages(selectedProductId);
    } catch (err: any) {
      if (err.response) {
        alert("Görsel ekleme başarısız: " + JSON.stringify(err.response.data));
      } else {
        alert("Bilinmeyen hata oluştu.");
      }
    }
  };

  const handleUpdate = async () => {
    if (!token || !selectedImageId) return;
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/productImage/${selectedImageId}`,
        editImage,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Görsel güncellendi");
      fetchProductImages(editImage.product_id);
    } catch (error) {
      alert("Görsel güncellenemedi: " + error);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedImageId) return;
    const confirmDelete = window.confirm("Bu görseli silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/productImage/${selectedImageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Görsel silindi");
      setEditImage({ product_id: selectedProductId!, url: "", sort: 0 });
      setSelectedImageId(null);
      fetchProductImages(selectedProductId!);
    } catch (error) {
      alert("Görsel silinemedi: " + error);
    }
  };

  return (
    <div className="wrapper">
      {/* Sol: Görsel ekleme */}
      <div className="form-wrapper">
        <h2>Ürün Görseli Ekle</h2>
        <form onSubmit={handleSubmit}>
          <label>Ürün Seç</label>
          <select
            onChange={handleSelectProduct}
            value={selectedProductId ?? ""}
            required
          >
            <option value="">Bir ürün seçin</option>
            {products
              .filter((p) => p.type === "STANDARD")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
          </select>

          <label>Görsel URL</label>
          <input
            type="text"
            name="url"
            value={image.url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />

          <label>Sıralama</label>
          <input
            type="number"
            name="sort"
            value={image.sort}
            onChange={handleChange}
            placeholder="1"
            required
          />

          <button type="submit">Görseli Kaydet</button>
        </form>
      </div>

      {/* Sağ: Güncelle / Sil */}
      <div className="form-wrapper">
        <h2>Görsel Güncelle/Sil</h2>

        {selectedProductId ? (
          productImages.length > 0 ? (
            <>
              <label>URL</label>
              <input
                type="text"
                name="url"
                value={editImage.url}
                onChange={handleEditChange}
              />

              <label>Sıralama</label>
              <input
                type="number"
                name="sort"
                value={editImage.sort}
                onChange={handleEditChange}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={handleUpdate}>
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{ backgroundColor: "#e74c3c", color: "#fff" }}
                >
                  Sil
                </button>
              </div>
            </>
          ) : (
            <p>Bu ürüne ait görsel bulunamadı.</p>
          )
        ) : (
          <p>Lütfen önce bir ürün seçin.</p>
        )}
      </div>
    </div>
  );
};

export default ProductImageUploader;
