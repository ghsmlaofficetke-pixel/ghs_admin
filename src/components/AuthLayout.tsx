import { Link } from "react-router-dom";

// images
import logoLight from '../assets/images/logo.png';
import logoDark from '../assets/images/logo.png';
import posterImg from "../assets/images/brands/poster.webp";

//component

interface AccountLayoutProps {
  pageImage?: any;
  authTitle?: string;
  helpText?: string;
  bottomLinks?: any;
  isCombineForm?: boolean;
  children?: any;
  hasForm?: boolean;
  hasThirdPartyLogin?: boolean;
  userImage?: string;
}

const AuthLayout = ({
  pageImage,
  authTitle,
  helpText,
  bottomLinks,
  isCombineForm,
  children,
  hasForm,
  hasThirdPartyLogin,
  userImage,
}: AccountLayoutProps) => {
  // useEffect(() => {
  //   if (document.body) {
  //     document.body.classList.add('authentication-bg', 'position-relative')
  //   }
  //   return () => {
  //     if (document.body) {
  //       document.body.classList.remove('authentication-bg', 'position-relative')
  //     }
  //   }
  // }, [])

 return (
    <div className="min-h-screen w-full bg-gradient-to-r from-rose-100 via-slate-50 to-teal-100 dark:from-gray-800 dark:to-black flex items-center justify-center">
      
      {/* MAIN WRAPPER */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-transparent px-4 lg:px-8">

        {/* LEFT IMAGE (DESKTOP ONLY) */}
        <div className="hidden lg:flex items-center justify-center">
          <img
            src={posterImg}
            alt="MLA Banner"
            className="max-h-[520px] w-auto rounded-xl opacity-90"
          />
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="flex items-center justify-center">
         <div className="card w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8">

  {/* LOGO */}
<div className="flex justify-center mb-4">
  {/* Light mode */}
  <img
    src={logoDark}
    alt="Logo"
    className="max-h-44 w-auto object-contain block dark:hidden"
  />

  {/* Dark mode */}
  <img
    src={logoLight}
    alt="Logo"
    className="max-h-44 w-auto object-contain hidden dark:block"
  />
</div>

  {children}
  {bottomLinks}
</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
