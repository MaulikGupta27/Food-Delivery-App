import { assets } from "../../assets/assets";
import "./Add.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    isVeg: true,
    isAvailable: true,
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("isVeg", data.isVeg);
    formData.append("isAvailable", data.isAvailable);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          isVeg: true,
          isAvailable: true,
        });
        setImage(false);
        toast.success(response.data.message || "Food item added successfully");
      } else {
        toast.error(response.data.message || "Failed to add food");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add food");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add panel-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Add menu item</h2>
        </div>
        <p className="section-note">
          Upload a high-quality image, define dietary type, and publish it to the storefront.
        </p>
      </div>

      <form className="flex-col add-form" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Dish Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Dish Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="e.g. Greek Salad with Feta"
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Dish Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="4"
            placeholder="Describe ingredients, flavor profile, and portion size..."
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
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

          <div className="add-price flex-col">
            <p>Price (₹)</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="e.g. 240"
              min="1"
              required
            />
          </div>
        </div>

        {/* Dietary and Stock Toggles */}
        <div className="add-toggles-row">
          <div className="diet-toggle-item">
            <span className="toggle-label">Dietary Type:</span>
            <div className="diet-pill-selector">
              <button
                type="button"
                className={`diet-pill veg ${data.isVeg ? "active" : ""}`}
                onClick={() => setData({ ...data, isVeg: true })}
              >
                🌱 Veg
              </button>
              <button
                type="button"
                className={`diet-pill non-veg ${!data.isVeg ? "active" : ""}`}
                onClick={() => setData({ ...data, isVeg: false })}
              >
                🍗 Non-Veg
              </button>
            </div>
          </div>

          <div className="stock-toggle-item">
            <span className="toggle-label">Initial Stock:</span>
            <button
              type="button"
              className={`stock-pill ${data.isAvailable ? "in-stock" : "out-stock"}`}
              onClick={() => setData({ ...data, isAvailable: !data.isAvailable })}
            >
              {data.isAvailable ? "● In Stock" : "○ Out of Stock"}
            </button>
          </div>
        </div>

        <button type="submit" className="add-btn" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : "Add to Menu"}
        </button>
      </form>
    </div>
  );
};

export default Add;
