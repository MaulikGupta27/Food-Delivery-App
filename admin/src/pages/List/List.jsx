import "./List.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const List = ({ url }) => {

  const [list, setList] = useState([]);

  const removeFood = async(foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {id: foodId });
      if(response.data.success) {
        setList((prev) => prev.filter((item) => item._id !== foodId));
        toast.success("Food removed successfully");
      } else {
        toast.error(response.data.message || "Failed to remove food");
      }
    } catch {
      toast.error("Failed to remove food");
    }
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${url}/api/food/list`);
        if(response.data.success) {
          setList(response.data.data);
        } else {
          toast.error("Failed to fetch list");
        }
      } catch {
        toast.error("Failed to fetch list");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="list panel-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2>List of foods</h2>
        </div>
        <p className="section-note">Keep the catalog lean by reviewing and removing outdated menu items.</p>
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length === 0 ? (
          <div className="empty-state">No menu items yet. Add the first dish to populate the catalog.</div>
        ) : list.map((item, index) => {
          return (
            <div className="list-table-format" key={index}>
              <img src={`${url}/images/`+item.image} alt={item.name} className="list-image" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">X</p>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default List
