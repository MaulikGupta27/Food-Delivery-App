import { useContext, useState, useMemo } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/storeContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [dietFilter, setDietFilter] = useState("all"); // "all", "veg", "non-veg"
  const [sortBy, setSortBy] = useState("default"); // "default", "price-low", "price-high", "rating", "name"

  const filteredFoods = useMemo(() => {
    return food_list.filter((item) => {
      // 1. Category filter
      const matchesCategory = category === "All" || item.category === category;

      // 2. Search query filter (matches name or description)
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query));

      // 3. Diet filter
      let matchesDiet = true;
      if (dietFilter === "veg") {
        matchesDiet = item.isVeg === true;
      } else if (dietFilter === "non-veg") {
        matchesDiet = item.isVeg === false;
      }

      return matchesCategory && matchesSearch && matchesDiet;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 4.5) - (a.rating || 4.5);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [food_list, category, searchTerm, dietFilter, sortBy]);

  return (
    <section className="food-display" id="food-display">
      <div className="food-display-header">
        <div>
          <h2 className="food-display-title">
            Top Dishes <span className="gradient-text">Near You</span>
          </h2>
          <p className="food-display-subtitle">
            Showing {filteredFoods.length} {filteredFoods.length === 1 ? "dish" : "dishes"}
            {category !== "All" && ` in ${category}`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="food-search-box">
          <svg
            className="food-search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search dishes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="food-search-input"
          />
          {searchTerm && (
            <button
              className="food-search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="food-toolbar">
        <div className="food-diet-filters">
          <button
            className={`diet-filter-btn ${dietFilter === "all" ? "active" : ""}`}
            onClick={() => setDietFilter("all")}
          >
            All Dishes
          </button>
          <button
            className={`diet-filter-btn veg ${dietFilter === "veg" ? "active" : ""}`}
            onClick={() => setDietFilter("veg")}
          >
            <span className="dot veg"></span> Pure Veg
          </button>
          <button
            className={`diet-filter-btn non-veg ${dietFilter === "non-veg" ? "active" : ""}`}
            onClick={() => setDietFilter("non-veg")}
          >
            <span className="dot non-veg"></span> Non-Veg
          </button>
        </div>

        <div className="food-sort-box">
          <label htmlFor="food-sort-select">Sort by:</label>
          <select
            id="food-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="food-sort-select"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Food Grid */}
      {filteredFoods.length === 0 ? (
        <div className="food-empty-state">
          <div className="food-empty-icon">🍽️</div>
          <h3>No dishes found</h3>
          <p>We couldn't find any dish matching your current search and filter criteria.</p>
          {(searchTerm || dietFilter !== "all" || category !== "All") && (
            <button
              className="btn-gradient reset-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setDietFilter("all");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="food-display-grid">
          {filteredFoods.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
              isAvailable={item.isAvailable !== false}
              isVeg={item.isVeg !== false}
              rating={item.rating || 4.5}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodDisplay;
