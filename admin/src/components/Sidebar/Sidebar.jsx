import "./Sidebar.css"
import {assets} from "../../assets/assets"
import { NavLink } from "react-router-dom"

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-top">
        <p className="sidebar-label">Workspace</p>
        <p className="sidebar-title">FeastDash panel</p>
        <p className="sidebar-copy">A focused control surface for the restaurant menu and order queue.</p>
      </div>
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
            <img src={assets.add_icon} alt="Add" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
            <img src={assets.order_icon} alt="Order" />
            <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
            <img src={assets.order_icon} alt="Add" />
            <p>Orders</p>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
