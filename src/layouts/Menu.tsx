import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// helpers
import { findAllParent, findAllChildren, findMenuItem } from "../helpers/menu";

// constants
import { MenuItemTypes } from "../constants/menu";
import { SimpleCollapse } from "../components/FrostUI";

interface SubMenus {
  item: MenuItemTypes;
  linkClassName?: string;
  subMenuClassNames?: string;
  activeMenuItems?: Array<string>;
  toggleMenu?: (item: any, status: boolean) => void;
  className?: string;
}

/* ===============================
   MENU WITH CHILDREN
================================= */

// "open" is derived directly from activeMenuItems (no local state to
// keep in sync). This removes a mobile-only race where a local
// setOpen(true) could be reverted by a stale-prop effect before the
// parent's state update landed, making the dropdown appear to never
// open on mobile even though it worked fine on desktop.
const MenuItemWithChildren = ({
  item,
  linkClassName,
  subMenuClassNames,
  activeMenuItems = [],
  toggleMenu,
}: SubMenus) => {
  const open = activeMenuItems.includes(item.key);

  const toggleMenuItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleMenu) toggleMenu(item, !open);
  };

  return (
    <li className="menu-item">
      <button
        type="button"
        className={`${linkClassName} ${open ? "active open" : ""} w-full text-start`}
        aria-expanded={open}
        data-menu-key={item.key}
        onClick={toggleMenuItem}
      >
        {item.icon && (
          <span className="menu-icon">
            <i className={item.icon} />
          </span>
        )}
        <span className="menu-text">{item.label}</span>
        <span className="menu-arrow" />
      </button>

      <SimpleCollapse open={open} as="ul" classNames={subMenuClassNames}>
        {(item.children || []).map((child, idx) => (
          <React.Fragment key={idx}>
            {child.children ? (
              <MenuItemWithChildren
                item={child}
                linkClassName="menu-link"
                activeMenuItems={activeMenuItems}
                subMenuClassNames="sub-menu"
                toggleMenu={toggleMenu}
              />
            ) : (
              <MenuItem
                item={child}
                linkClassName={`menu-link ${
                  activeMenuItems?.includes(child.key) ? "active" : ""
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </SimpleCollapse>
    </li>
  );
};

/* ===============================
   NORMAL MENU ITEM
================================= */

const MenuItem = ({ item, linkClassName }: SubMenus) => {
  return (
    <li className="menu-item">
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
};

/* ===============================
   LINK (🔥 FIXED MOBILE CLOSE + OVERLAY CLEAR)
================================= */

const MenuItemLink = ({ item, className }: SubMenus) => {
  const location = useLocation();
  const html = document.documentElement;

  const isMobile =
    html.getAttribute("data-sidenav-view") === "mobile";

  const isActive = location.pathname === item.url;

  const handleMobileClose = () => {
    if (isMobile) {
      // ✅ Remove sidebar open trigger
      html.classList.remove("sidenav-enable");

      // ✅ Force remove ANY overlay effect from html
      html.classList.remove("overlay-enable");
      html.classList.remove("sidenav-overlay-enable");

      // ✅ Remove inline style if any added
      html.style.removeProperty("overflow");

      // ✅ Remove any possible backdrop element
      document
        .querySelectorAll(
          ".offcanvas-backdrop, .modal-backdrop, .sidebar-overlay"
        )
        .forEach((el) => el.remove());
    }
  };

  return (
    <Link
      to={item.url!}
      target={item.target}
      data-menu-key={item.key}
      onClick={handleMobileClose}
      className={`side-nav-link-ref ${className} ${
        isActive ? "active" : ""
      }`}
    >
      {item.icon && (
        <span className="menu-icon">
          <i className={item.icon} />
        </span>
      )}
      <span className="menu-text">{item.label}</span>
    </Link>
  );
};


/* ===============================
   MAIN APP MENU
================================= */

interface AppMenuProps {
  menuItems: MenuItemTypes[];
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
  const location = useLocation();
  const menuRef = useRef(null);
  const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

  const toggleMenu = (menuItem: MenuItemTypes, show: boolean) => {
    const html = document.documentElement;
    const isMobile = html.getAttribute("data-sidenav-view") === "mobile";

    setActiveMenuItems((prev) => {
      if (show) {
        const parents = findAllParent(menuItems, menuItem);

        // Mobile: accordion behavior — only one top-level dropdown
        // open at a time, so opening one always shows correctly
        // instead of getting lost among other open items.
        if (isMobile) {
          return [menuItem.key, ...parents];
        }

        // Desktop: allow multiple open at once, just add this item.
        return Array.from(new Set([...prev, menuItem.key, ...parents]));
      }

      // Closing: drop this item and its whole sub-tree from the open
      // list, but leave unrelated open items untouched.
      const descendants = findAllChildren(menuItem);
      return prev.filter(
        (key) => key !== menuItem.key && !descendants.includes(key)
      );
    });
  };

  const activeMenu = useCallback(() => {
    const div = document.getElementById("main-side-menu");
    let matchingMenuItem: HTMLElement | null = null;

    if (div) {
      const items: any = div.getElementsByClassName("side-nav-link-ref");

      for (let i = 0; i < items.length; ++i) {
        let trimmedURL = location.pathname.replace(
          import.meta.env.PUBLIC_URL || "",
          ""
        );

        const url = items[i].pathname.replace(
          import.meta.env.PUBLIC_URL,
          ""
        );

        if (trimmedURL === "/") trimmedURL = "/dashboard";

        if (trimmedURL === url) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        const activeMt = findMenuItem(menuItems, mid as any);

        if (activeMt) {
          setActiveMenuItems([
            activeMt.key,
            ...findAllParent(menuItems, activeMt),
          ]);
        }
      }
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  return (
    <ul className="menu" ref={menuRef} id="main-side-menu">
      {(menuItems || []).map((item, idx) => (
        <React.Fragment key={idx}>
          {item.isTitle ? (
            <li className="menu-title">{item.label}</li>
          ) : item.children ? (
            <MenuItemWithChildren
              item={item}
              toggleMenu={toggleMenu}
              subMenuClassNames="sub-menu"
              activeMenuItems={activeMenuItems}
              linkClassName={`menu-link ${
                activeMenuItems.includes(item.key) ? "active" : ""
              }`}
            />
          ) : (
            <MenuItem item={item} linkClassName="menu-link" />
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default AppMenu;