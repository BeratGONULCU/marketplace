import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  type: string;
  description: string | null;
  base_price: number | null;
  base_stock: number | null;
  is_published: boolean;
}

interface Variant {
  id?: number;
  product_id: number;
  price: number;
  stock: number;
  sku: string;
  barcode: string;
  color_id: number;
  size_id: number;
}

const ProductVariantSetting = () => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    product_id: 0,
    price: 0,
    stock: 0,
    sku: "",
    barcode: "",
    color_id: 0,
    size_id: 0,
  });

  // Get all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Ürünler alınamadı", err);
      }
    };
    fetchProducts();
  }, [token]);

  // Get variants for selected product
  useEffect(() => {
    if (!selectedProduct || selectedProduct.type !== "VARIANTED") return;
    const fetchVariants = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/products/${selectedProduct.id}/variants`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVariants(res.data);
        setNewVariant((prev) => ({ ...prev, product_id: selectedProduct.id }));
      } catch (err) {
        console.error("Varyantlar alınamadı", err);
      }
    };
    fetchVariants();
  }, [selectedProduct, token]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const found = products.find((p) => p.id === selectedId) || null;
    setSelectedProduct(found);
  };

  const handleNewVariantChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewVariant((prev) => ({
      ...prev,
      [name]: ["price", "stock", "color_id", "size_id"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleAddVariant = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/products/products/${selectedProduct?.id}/variants`,
        [newVariant],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVariants((prev) => [...prev, ...res.data]);
      alert("Varyant eklendi");
    } catch (err) {
      console.error("Varyant ekleme hatası", err);
    }
  };

  const handleUpdateVariant = async (variant: Variant) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/products/products/variants/${variant.id}`,
        variant,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Varyant güncellendi");
    } catch (err) {
      console.error("Varyant güncelleme hatası", err);
    }
  };

  return (
    <div>
      <h2>Ürün Seç</h2>
      <select onChange={handleSelectChange} value={selectedProduct?.id ?? ""}>
        <option value="">Bir ürün seçin</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title} ({p.type})
          </option>
        ))}
      </select>

      {selectedProduct?.type === "VARIANTED" && (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "50px" , marginRight: "80px" }}>
    {/* Sol: Mevcut Varyantlar */}
    <div style={{ flex: 1 }}>
      <h3>Mevcut Varyantlar</h3>
      {variants.map((v, i) => (
        <div
          key={v.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 10,
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            maxWidth: "300px",
          }}
        >
          <label>
            SKU:
            <input
              type="text"
              value={v.sku}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].sku = e.target.value;
                setVariants(updated);
              }}
            />
          </label>

          <label>
            Barkod:
            <input
              type="text"
              value={v.barcode}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].barcode = e.target.value;
                setVariants(updated);
              }}
            />
          </label>

          <label>
            Fiyat:
            <input
              type="number"
              value={v.price}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].price = Number(e.target.value);
                setVariants(updated);
              }}
            />
          </label>

          <label>
            Stok:
            <input
              type="number"
              value={v.stock}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].stock = Number(e.target.value);
                setVariants(updated);
              }}
            />
          </label>

          <label>
            Renk ID:
            <input
              type="number"
              value={v.color_id}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].color_id = Number(e.target.value);
                setVariants(updated);
              }}
            />
          </label>

          <label>
            Beden ID:
            <input
              type="number"
              value={v.size_id}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].size_id = Number(e.target.value);
                setVariants(updated);
              }}
            />
          </label>

          <button onClick={() => handleUpdateVariant(v)}>Güncelle</button>
        </div>
      ))}
    </div>

    {/* Sağ: Yeni Varyant Ekleme */}
    <div style={{ flex: 1, maxWidth: "300px", marginLeft: "80px" }}>
      <h3>Yeni Varyant Ekle</h3>
      <label>
        SKU:
        <input
          name="sku"
          placeholder="örn: giyim"
          value={newVariant.sku}
          onChange={handleNewVariantChange}
        />
      </label>
      <label>
        Barkod:
        <input
          name="barcode"
          placeholder="örn: 8691234567892"
          value={newVariant.barcode}
          onChange={handleNewVariantChange}
        />
      </label>
      <label>
        Fiyat:
        <input
          name="price"
          type="number"
          placeholder="Fiyat"
          value={newVariant.price}
          onChange={handleNewVariantChange}
        />
      </label>
      <label>
        Stok:
        <input
          name="stock"
          type="number"
          placeholder="Stok"
          value={newVariant.stock}
          onChange={handleNewVariantChange}
        />
      </label>
      <label>
        Renk ID:
        <input
          name="color_id"
          type="number"
          placeholder="Renk ID"
          value={newVariant.color_id}
          onChange={handleNewVariantChange}
        />
      </label>
      <label>
        Beden ID:
        <input
          name="size_id"
          type="number"
          placeholder="Beden ID"
          value={newVariant.size_id}
          onChange={handleNewVariantChange}
        />
      </label>
      <button onClick={handleAddVariant}>Varyant Ekle</button>
    </div>
  </div>
)}

    </div>
  );
};

export default ProductVariantSetting;