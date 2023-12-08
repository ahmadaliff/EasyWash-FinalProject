import MainLayout from '@layouts/MainLayout';
import ForgotPassword from '@pages/ForgotPassword';
import Home from '@pages/Home';
import Login from '@pages/Login';
import NotFound from '@pages/NotFound';
import Profile from '@pages/Profile';
import Register from '@pages/Register';
import ResetPassword from '@pages/ResetPassword';
import Users from '@pages/Users';
import FormService from '@pages/FormService';

const routes = [
  {
    path: '/',
    name: 'Home',
    protected: false,
    component: Home,
    layout: MainLayout,
  },
  {
    path: '/login',
    name: 'Login',
    protected: false,
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    protected: false,
    component: Register,
  },
  {
    path: '/forgotPassword',
    name: 'Forgot Password',
    protected: false,
    component: ForgotPassword,
  },
  {
    path: '/:token/resetPassword',
    name: 'Forgot Password',
    protected: false,
    component: ResetPassword,
  },
  {
    path: '/profile',
    name: 'Profile',
    protected: true,
    component: Profile,
    layout: MainLayout,
  },
  {
    path: '/admin/user',
    name: 'User',
    protected: true,
    component: Users,
    layout: MainLayout,
  },
  {
    path: '/service/add',
    name: 'Add Service',
    protected: false,
    component: FormService,
    layout: MainLayout,
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
