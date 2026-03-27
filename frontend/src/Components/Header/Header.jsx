import "./Header.css"

const Header = () => {
  const handleViewMenuClick = () => {
    const menuSection = document.getElementById("explore-menu");
    if (!menuSection) return;

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const scrollTop =
      window.pageYOffset +
      menuSection.getBoundingClientRect().top -
      navbarHeight -
      8;

    window.scrollTo({ top: Math.max(0, scrollTop), behavior: "smooth" });
  };

  return (
    <div id="home-top" className="header">
      <div id="header-contents" className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>Choose from a diverse menu featauring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious bite at a time.</p>
        <button type="button" onClick={handleViewMenuClick}>View Menu</button>
      </div>
    </div>
  )
}

export default Header
