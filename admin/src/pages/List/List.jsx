import "./List.css";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    isVeg: true,
    isAvailable: true,
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Fetch all foods
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch list");
      }
    } catch {
      toast.error("Failed to fetch list");
    }
  };

  useEffect(() => {
    fetchList();
  }, [url]);

  // Remove food
  const removeFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to remove this dish from the menu?")) return;
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        setList((prev) => prev.filter((item) => item._id !== foodId));
        toast.success("Food removed successfully");
      } else {
        toast.error(response.data.message || "Failed to remove food");
      }
    } catch {
      toast.error("Failed to remove food");
    }
  };

  // Fast Toggle Stock Availability
  const toggleAvailability = async (foodId) => {
    try {
      const response = await axios.patch(`${url}/api/food/toggle/${foodId}`);
      if (response.data.success) {
        setList((prev) =>
          prev.map((item) =>
            item._id === foodId ? { ...item, isAvailable: response.data.isAvailable } : item
          )
        );
        toast.success(response.data.message);
      }
    } catch {
      toast.error("Failed to update availability");
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVeg: item.isVeg !== false,
      isAvailable: item.isAvailable !== false,
    });
    setEditImageFile(null);
  };

  // Save Edit Changes
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSavingEdit(true);

    const formData = new FormData();
    formData.append("name", editFormData.name);
    formData.append("description", editFormData.description);
    formData.append("price", Number(editFormData.price));
    formData.append("category", editFormData.category);
    formData.append("isVeg", editFormData.isVeg);
    formData.append("isAvailable", editFormData.isAvailable);

    if (editImageFile) {
      formData.append("image", editImageFile);
    }

    try {
      const response = await axios.put(`${url}/api/food/update/${editingItem._id}`, formData);
      if (response.data.success) {
        const updated = response.data.data;
        setList((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        toast.success("Dish updated successfully!");
        setEditingItem(null);
      } else {
        toast.error(response.data.message || "Failed to update dish");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update dish");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [list, searchTerm, selectedCategory]);

  return (
    <div className="list panel-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>Manage Menu Catalog</h2>
        </div>
        <p className="section-note">
          Review, toggle live availability, edit details, or remove menu items.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-list-toolbar">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search dish by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="admin-cat-select"
        >
          <option value="All">All Categories ({list.length})</option>
          <option value="Salad">Salad</option>
          <option value="Rolls">Rolls</option>
          <option value="Deserts">Deserts</option>
          <option value="Sandwich">Sandwich</option>
          <option value="Cake">Cake</option>
          <option value="Pure Veg">Pure Veg</option>
          <option value="Pasta">Pasta</option>
          <option value="Noodles">Noodles</option>
        </select>
      </div>

      {/* Table */}
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Diet</b>
          <b>Price</b>
          <b>Stock Status</b>
          <b>Actions</b>
        </div>

        {filteredList.length === 0 ? (
          <div className="empty-state">
            No dishes match your search or filter. Try a different query.
          </div>
        ) : (
          filteredList.map((item) => {
            const inStock = item.isAvailable !== false;
            const isVeg = item.isVeg !== false;
            return (
              <div className="list-table-format" key={item._id}>
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${url}/images/${item.image}`
                  }
                  alt={item.name}
                  className="list-image"
                />
                <div className="list-name-col">
                  <p className="dish-name">{item.name}</p>
                </div>
                <p className="cat-col">{item.category}</p>
                <div className="diet-col">
                  <span className={`diet-pill ${isVeg ? "veg" : "non-veg"}`}>
                    {isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
                  </span>
                </div>
                <p className="price-col">₹{item.price}</p>
                <div className="stock-col">
                  <button
                    className={`stock-toggle-btn ${inStock ? "in-stock" : "out-stock"}`}
                    onClick={() => toggleAvailability(item._id)}
                    title="Click to toggle stock status"
                  >
                    {inStock ? "● In Stock" : "○ Out of Stock"}
                  </button>
                </div>
                <div className="action-col">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => openEditModal(item)}
                    title="Edit Dish"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => removeFood(item._id)}
                    title="Delete Dish"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Dish Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Menu Item</h3>
              <button className="close-modal-btn" onClick={() => setEditingItem(null)}>✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="edit-modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Dish Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, price: e.target.value })
                    }
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Category</label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, category: e.target.value })
                  }
                >
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Deserts">Deserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Diet Type</label>
                  <div className="diet-pill-selector">
                    <button
                      type="button"
                      className={`diet-pill veg ${editFormData.isVeg ? "active" : ""}`}
                      onClick={() => setEditFormData({ ...editFormData, isVeg: true })}
                    >
                      🌱 Veg
                    </button>
                    <button
                      type="button"
                      className={`diet-pill non-veg ${!editFormData.isVeg ? "active" : ""}`}
                      onClick={() => setEditFormData({ ...editFormData, isVeg: false })}
                    >
                      🍗 Non-Veg
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label>Availability</label>
                  <button
                    type="button"
                    className={`stock-toggle-btn ${
                      editFormData.isAvailable ? "in-stock" : "out-stock"
                    }`}
                    onClick={() =>
                      setEditFormData({
                        ...editFormData,
                        isAvailable: !editFormData.isAvailable,
                      })
                    }
                  >
                    {editFormData.isAvailable ? "● In Stock" : "○ Out of Stock"}
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label>Replace Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="file-input"
                />
                {editImageFile && (
                  <p className="selected-filename">Selected: {editImageFile.name}</p>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn btn-gradient"
                  disabled={isSavingEdit}
                >
                  {isSavingEdit ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
