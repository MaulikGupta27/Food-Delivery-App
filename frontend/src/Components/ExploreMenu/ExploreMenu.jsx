import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <section className="explore-menu" id="explore-menu">
      <div className="explore-menu-header">
        <h2 className="explore-menu-title">
          Explore <span className="gradient-text">Our Menu</span>
        </h2>
        <p className="explore-menu-subtitle">
          Choose from a variety of delicious dishes prepared with the finest
          ingredients.
        </p>
      </div>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;
          return (
            <button
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name,
                )
              }
              key={index}
              className={`explore-menu-chip ${isActive ? "active" : ""}`}
            >
              <img
                src={item.menu_image}
                alt={item.menu_name}
                className="chip-image"
              />
              <span className="chip-label">{item.menu_name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ExploreMenu;
