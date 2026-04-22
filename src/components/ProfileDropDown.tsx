// import { Link, useNavigate, useNavigation } from 'react-router-dom'

// import { ProfileMenuItem } from '../layouts/Topbar';
// import React, { useEffect } from 'react';
// import { PopoverLayout } from './HeadlessUI';
// import { useDispatch } from 'react-redux';
// import { AppDispatch, RootState } from '../redux/store';
// import { logoutUser, resetAuth } from '../redux/actions';
// import { useSelector } from 'react-redux';

// interface ProfileDropDownProps {
//   // menuItems: Array<ProfileMenuItem>;
//   profiliePic?: string;
// }

// const ProfileDropDown = ({ profiliePic }: ProfileDropDownProps) => {

//   const navigate = useNavigate();

//   const dispatch = useDispatch<AppDispatch>();

//   const { user, userLoggedIn } = useSelector(
//     (state: RootState) => ({
//       user: state.Auth.user,
//       userLoggedIn: state.Auth.userLoggedIn,
//     })
//   );

//   const PopoverToggler = () => {
//     return (
//       <img src={profiliePic} alt="user-image" className="rounded-full h-10" />
//     )
//   }

//   // const handleLogout = () => {
//   //   dispatch(resetAuth());
//   //   dispatch(logoutUser());
//   //   if (userLoggedIn || user) {
//   //     navigate("/auth/login");
//   //   }
//   // }

//   return (
//     <div className="relative">
     
//     </div>
//   )
// }

// export default ProfileDropDown