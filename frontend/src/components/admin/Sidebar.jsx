import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faClipboardList,
  faPlus,
  faShoppingBasket,
  faUsers,
  faStar,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import "../../App.css";

const Sidebar = () => {
  const [showProductMenu, setShowProductMenu] = useState(false);
  return (
    <>
      <div className="sidebar-wrapper">
        <nav id="sidebar">
          <ul className="list-unstyled components">
            <li>
              <NavLink to="/dashboard">
                <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to=""
                className="dropdown-toggle"
                onClick={() => setShowProductMenu(!showProductMenu)}
              >
                <FontAwesomeIcon icon={faProductHunt} /> Products
                <FontAwesomeIcon icon={faCaretDown} className="ms-4" />
              </NavLink>
              {showProductMenu && (
                <ul className="list-unstyled" id="productSubmenu">
                  <li>
                    <NavLink to="/admin/products">
                      <FontAwesomeIcon
                        icon={faClipboardList}
                        className="me-3"
                      />
                      All
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/product">
                      <FontAwesomeIcon icon={faPlus} className="me-3" />
                      Create
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <NavLink to="/admin/orders">
                <FontAwesomeIcon icon={faShoppingBasket} /> Orders
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/users">
                <FontAwesomeIcon icon={faUsers} /> Users
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/reviews">
                <FontAwesomeIcon icon={faStar} /> Reviews
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
