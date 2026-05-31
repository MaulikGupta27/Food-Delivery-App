import { useContext } from "react";
import "./FoodDisplay.css"
import { StoreContext } from "../../Context/storeContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext);

  return (
    <section className="food-display" id="food-display">
      <h2 className="food-display-title">
        Top Dishes <span className="gradient-text">Near You</span>
      </h2>
      <div className="food-display-grid">
        {food_list.map((item, index) => {
          if(category==="All" || item.category===category) {
            return <FoodItem key={index} id={item._id} name={item.name} price={item.price} description={item.description} image={item.image} />
          }
          return null;
        })}
      </div>
    </section>
  )
}

export default FoodDisplay
