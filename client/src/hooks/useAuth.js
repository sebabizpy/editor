import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout } from '../redux/slices/authJwt';
// ----------------------------------------------------------------------

useAuth.propTypes = {
  method: PropTypes.oneOf(['jwt', 'firebase'])
};

export default function useAuth(method = 'jwt') {
  // JWT Auth
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector(
    (state) => state.authJwt
  );

  // JWT Auth
  return {
    method: 'jwt',
    user: user,
    isLoading: isLoading,
    isAuthenticated: isAuthenticated,

    login: ({ email, password }) =>
      dispatch(
        login({
          email: email,
          password: password
        })
      ),

    register: ({ email, password, firstName, lastName }) =>
      dispatch(
        register({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName
        })
      ),

    logout: () => dispatch(logout()),

    resetPassword: () => {},

    updateProfile: () => {}
  };
}
