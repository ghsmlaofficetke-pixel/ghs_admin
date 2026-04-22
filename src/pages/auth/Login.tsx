import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// form validation
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginUser, resetAuth } from "../../redux/actions";

// components
import {
  VerticalForm,
  FormInput,
  AuthLayout,
  PageBreadcrumb,
} from "../../components";

interface UserData {
  phone_no: string;
  password: string;
}


const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, userLoggedIn, loading } = useSelector(
    (state: RootState) => ({
      user: state.Auth.user,
      loading: state.Auth.loading,
      error: state.Auth.error,
      userLoggedIn: state.Auth.userLoggedIn,
    })
  );

  const { error } = useSelector((state: any) => state.Auth);

  console.log(error)

  const redirectUrl = location?.search?.slice(6) || "/";
  // const redirectUrl = "/auth/launch";

  // reset auth state on page load
  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  // redirect AFTER successful login (prevents infinite loop)
  useEffect(() => {
    if (userLoggedIn && user) {
      navigate(redirectUrl, { replace: true });
    }
  }, [userLoggedIn, user, navigate, redirectUrl]);


  const schemaResolver = yupResolver(
    yup.object().shape({
      phone_no: yup
        .string()
        .required("Please enter phone number")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
      password: yup.string().required("Please enter password"),
    })
  );


  const onSubmit = (formData: UserData) => {
    dispatch(loginUser(formData.phone_no, formData.password));
  };

  return (
    <>
      <PageBreadcrumb title="Login" />

      <AuthLayout
        authTitle="Sign In"
        helpText="Enter your phone number and password to access admin panel."
        // bottomLinks={<BottomLink />}
        hasThirdPartyLogin
      >
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}
          defaultValues={{ phone_no: "", password: "" }}
        >
          <FormInput
            label="Phone Number"
            type="text"
            name="phone_no"
            placeholder="Enter your phone number"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
            required
          />

          {error && (
  <div className="text-red-600 text-sm my-4">
    {error}
  </div>
)}

  

          <div className="flex justify-center mb-6">
            <button
              className="btn w-full text-white bg-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  );
};

export default Login;
