import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { useSelector, useDispatch } from "react-redux";
import { getMenuItems } from "../helpers/menu";

// constants
import AppMenu from "./Menu";
import * as LayoutConstants from "../constants/layout";

// store
import { AppDispatch, RootState } from "../redux/store";
import { changeSideBarType, logoutUser, resetAuth } from "../redux/actions";

// images
import logoLight from "../assets/images/logo-light.webp";
import logoDark from "../assets/images/logo-dark.webp";
import logoSm from "../assets/images/logo-sm.png";

const SideBarContent = () => {
  return <AppMenu menuItems={getMenuItems()} />;
};

interface LeftSideBarProps {
  isCondensed: boolean;
}

const HoverMenuToggler = () => {
  const { sideBarType } = useSelector((state: RootState) => ({
    sideBarType: state.Layout.sideBarType,
  }));

  const dispatch = useDispatch<AppDispatch>();

  const toggleHoverMenu = () => {
    if (
      sideBarType === LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVER
    ) {
      dispatch(
        changeSideBarType(
          LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVERACTIVE
        )
      );
    } else if (
      sideBarType ===
      LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVERACTIVE
    ) {
      dispatch(
        changeSideBarType(
          LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVER
        )
      );
    }
  };

  return (
    <button
      id="button-hover-toggle"
      className="absolute top-5 end-2 rounded-full p-1.5"
      onClick={toggleHoverMenu}
    >
      <span className="sr-only">Menu Toggle Button</span>
      <i className="mgc_round_line text-xl"></i>
    </button>
  );
};

const LeftSideBar = ({ isCondensed }: LeftSideBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    closeMobileSidebar(); 
    dispatch(resetAuth());
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const closeMobileSidebar = () => {
    document.documentElement.classList.remove("sidenav-enable");
  };

  return (
    <>
      <div className="app-menu flex flex-col h-screen bg-white dark:bg-gray-900">

        {/* Logo */}
        <Link to="/" className="logo-box  border-b-2 border-x-slate-600 ">
          <div className="logo-light">
            <img src={logoLight} className="logo-lg h-12 w-auto" alt="logo" />
            <img src={logoSm} className="logo-sm" alt="logo small" />
          </div>
          <div className="logo-dark">
            <img src={logoDark} className="logo-lg h-12 w-auto" alt="logo" />
            <img src={logoSm} className="logo-sm" alt="logo small" />
          </div>
        </Link>

        <HoverMenuToggler />

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-hidden">
          <SimpleBar className="h-full" id="leftside-menu-container">
            <SideBarContent />
          </SimpleBar>
        </div>

        {/* Modern Text Logout */}
       <div className="p-4 border-t dark:border-gray-700">
  <div
   onClick={() => {
  closeMobileSidebar();   // ✅ close sidebar instantly
  setShowConfirm(true);
}}
    className="flex items-center justify-between 
               px-2  rounded-lg
               text-gray-600 dark:text-gray-300 
               hover:bg-gray-100 dark:hover:bg-gray-800
               hover:text-red-500 dark:hover:text-red-400 
               cursor-pointer transition-all duration-200 
               text-sm font-medium"
  >
    <div className="flex justify-center gap-4">
     <i className="mgc_exit_line text-[16px] "></i>
    <span className="text-[16px]">Logout</span>
    </div>
   
  </div>
</div>

      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-80 p-6">

            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Confirm Logout
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg 
                           bg-gray-100 hover:bg-gray-200 
                           dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg 
                           bg-red-500 hover:bg-red-600 
                           text-white"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      <div
        className="mobile-sidebar-overlay"
        onClick={closeMobileSidebar}
      />
    </>
  );
};

export default LeftSideBar;