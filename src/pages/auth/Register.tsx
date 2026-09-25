import { Link } from 'react-router-dom';
import { AuthLayout, PageBreadcrumb } from '../../components';

const Register = () => {
  return (
    <>
      <PageBreadcrumb title='Register' />
      <AuthLayout
        authTitle='Account Registration'
        helpText='New accounts are created by an Administrator. Please contact your admin to get access.'
        bottomLinks={
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Already have an account?
            <Link to="/auth/login" className="text-primary ms-1">
              <b>Log In</b>
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
            🔐
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Self-registration is not available. An <strong>Admin</strong> must create your account.
            Once your account is set up, you will receive your login credentials.
          </p>
          <Link
            to="/auth/login"
            className="btn w-full text-white bg-primary text-center"
          >
            Go to Login
          </Link>
        </div>
      </AuthLayout>
    </>
  );
};

export default Register;