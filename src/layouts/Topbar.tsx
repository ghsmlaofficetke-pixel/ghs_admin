import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import { AppDispatch, RootState } from "../redux/store";
import { useViewPort } from "../hooks";
import { changeLayoutTheme, changeSideBarType } from "../redux/actions";
import { LayoutTheme, SideBarType } from "../constants/layout";

// logo
import logoLight from '../assets/images/logo-light.webp'
import logoDark from '../assets/images/logo-dark.webp'
import logoSm from '../assets/images/logo-sm.png'

// avatar
import profilePic from '../assets/images/leader.png'
import { MaximizeScreen, NotificationDropdown} from "../components";

export interface NotificationItem {
  id: number;
  text: string;
  subText: string;
  icon?: string;
  avatar?: string;
  bgColor?: string;
  createdAt: Date;
}

export type ProfileMenuItem = {
  label: string;
  icon: string;
  redirectTo: string;
}

/**
 * notification items
 */
const notifications: NotificationItem[] = [
  {
    id: 2,
    text: 'Admin',
    subText: 'New user registered',
    icon: 'mgc_user_add_line text-lg',
    bgColor: 'info',
    createdAt: subtractHours(new Date(), 60),
  },
]

/**
 * profile menu items
 */
// const profileMenus: ProfileMenuItem[] = [
//   {
//     label: 'Gallery',
//     icon: 'mgc_pic_2_line me-2',
//     redirectTo: '/',
//   },
//   {
//     label: 'G H S',
//     icon: 'mgc_task_2_line me-2',
//     redirectTo: '/',
//   },
// ];

/**
 * for subtraction minutes
 */
function subtractHours(date: Date, minutes: number) {
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}

const Topbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useViewPort();

  const {
    layoutTheme,
    sideBarType,
  } = useSelector((state: RootState) => ({
    layoutTheme: state.Layout.layoutTheme,
    sideBarType: state.Layout.sideBarType,
  }));

  /**
  * Toggle the leftmenu when having mobile screen
  */
  const handleLeftMenuCallBack = () => {
  const html = document.documentElement;

  if (width < 1140) {
    html.classList.toggle('sidenav-enable');
    dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_MOBILE));
  } else {
    if (sideBarType === SideBarType.LEFT_SIDEBAR_TYPE_SMALL) {
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_DEFAULT));
    } else {
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_SMALL));
    }
  }
};

  function toggleBodyStyle(set: boolean) {
    if (set == false) {
      document.body.removeAttribute('style')
    }
    else {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '16px'
    }
  }

  function showLeftSideBarBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'backdrop';
    backdrop.className = 'transition-all fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80';
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', function () {
      document.getElementsByTagName('html')[0].classList.remove('sidenav-enable');
      toggleBodyStyle(false)
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_MOBILE));
      hideLeftSideBarBackdrop();
    });
  }

  function hideLeftSideBarBackdrop() {
    const backdrop = document.getElementById('backdrop');
    document.getElementsByTagName('html')[0].classList.remove('sidenav-enable');
    if (backdrop) {
      document.body.removeChild(backdrop);
      document.body.style.removeProperty('overflow');
    }
  }

  /**
  * Toggle Dark Mode
  */
  const toggleDarkMode = () => {
    if (layoutTheme === 'dark') {
      dispatch(changeLayoutTheme(LayoutTheme.THEME_LIGHT));
    } else {
      dispatch(changeLayoutTheme(LayoutTheme.THEME_DARK));
    }
  }

  return (
    <>
      <header className="app-header flex items-center px-4 gap-3 relative">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-2">
          <button
            id="button-toggle-menu"
            className="nav-link p-2"
            onClick={handleLeftMenuCallBack}
          >
            <span className="sr-only">Menu Toggle Button</span>
            <span className="flex items-center justify-center font-bold h-8 w-8">
              <i className="mgc_menu_line text-xl font-bold"></i>
            </span>
          </button>

          <Link to="/" className="logo-box flex items-center">
            <div className="logo-light">
              <img src={logoLight} className="logo-lg h-10 w-auto" alt="Light logo" />
              {/* <img src={logoSm} className="logo-sm h-9 w-auto" alt="Small logo" /> */}
            </div>

            <div className="logo-dark">
              <img src={logoDark} className="logo-lg h-10 w-auto" alt="Dark logo" />
              {/* <img src={logoSm} className="logo-sm h-9 w-auto" alt="Small logo" /> */}
            </div>
          </Link>
        </div>

        {/* Center: Title */}
       <div className="flex-1 flex justify-center px-2">
  <span className="
    text-xs 
    sm:text-sm 
    md:text-lg 
    lg:text-xl 
    xl:text-2xl 
    font-bold 
    text-center 
    leading-snug
    bg-gradient-to-r from-[#2466d1] to-cyan-500 
    bg-clip-text 
    text-transparent
  ">
    126 – ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ
  </span>
</div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <MaximizeScreen />

          <NotificationDropdown notifications={notifications} />

          <button
            id="light-dark-mode"
            type="button"
            className="nav-link p-2"
            onClick={toggleDarkMode}
          >
            <span className="sr-only">Light/Dark Mode</span>
            <span className="flex items-center justify-center h-6 w-6">
              <i className="mgc_moon_line text-2xl"></i>
            </span>
          </button>

          <div className="hidden md:block">
  {/* <ProfileDropDown
    profiliePic={profilePic}
    // menuItems={profileMenus}
  /> */}
  <img src={profilePic} alt="user-image" className="rounded-full h-10" />
</div>

{/* Mobile → Small Logo */}
<div className="block md:hidden">
  <img
    src={logoSm}
    alt="Mobile Logo"
    className="h-9 w-auto"
  />
</div>
        </div>
      </header>
    </>
  )
}

export default Topbar;
