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
import EditService from '@pages/EditService';
import StatusOrder from '@pages/StatusOrder';
import MyMerchant from '@pages/MyMerchant';
import LaundryServices from '@pages/LaundryServices';
import LaundryOrders from '@pages/LaundryOrders';
import Favorit from '@pages/Favorit';
import Cart from '@pages/Cart';
import Order from '@pages/Order';
import Laundry from '@pages/Laundry';
import MyOrder from '@pages/MyOrder';
import ChatPage from '@pages/ChatPage';
import GoogleCallback from '@pages/GoogleCallback';
import DeletedMerchant from '@pages/DeletedMerchant';

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
    path: '/chat',
    name: 'Chat',
    protected: true,
    component: ChatPage,
    layout: MainLayout,
  },
  {
    path: '/favorit',
    name: 'Favorit',
    protected: true,
    component: Favorit,
    layout: MainLayout,
    role: 'user',
  },
  {
    path: '/user/laundry/:id',
    name: 'Laundry',
    protected: true,
    component: Laundry,
    layout: MainLayout,
    role: 'user',
  },
  {
    path: '/cart',
    name: 'Cart',
    protected: true,
    component: Cart,
    layout: MainLayout,
    role: 'user',
  },
  {
    path: '/order',
    name: 'Order',
    protected: true,
    component: Order,
    layout: MainLayout,
    role: 'user',
  },
  {
    path: '/user/order',
    name: 'My Order',
    protected: true,
    component: MyOrder,
    layout: MainLayout,
    role: 'user',
  },
  {
    path: '/user/order/status/:orderId',
    name: 'Status Order',
    protected: true,
    component: StatusOrder,
    layout: MainLayout,
    role: 'user',
  },
  {
    path: '/admin/user',
    name: 'User',
    protected: true,
    component: Users,
    layout: MainLayout,
    role: 'admin',
  },
  {
    path: '/admin/deletedMerchant',
    name: 'User',
    protected: true,
    component: DeletedMerchant,
    layout: MainLayout,
    role: 'admin',
  },
  {
    path: '/service',
    name: 'Services',
    protected: true,
    component: LaundryServices,
    layout: MainLayout,
    role: 'merchant',
  },
  {
    path: '/service/add',
    name: 'Add Service',
    protected: true,
    component: FormService,
    layout: MainLayout,
    role: 'merchant',
  },
  {
    path: '/service/edit/:id',
    name: 'Edit Service',
    protected: true,
    component: EditService,
    layout: MainLayout,
    role: 'merchant',
  },
  {
    path: '/laundry/orders',
    name: 'Laundry Orders',
    protected: true,
    component: LaundryOrders,
    layout: MainLayout,
    role: 'merchant',
  },
  {
    path: '/laundry',
    name: 'My Merchant',
    protected: true,
    component: MyMerchant,
    layout: MainLayout,
    role: 'merchant',
  },
  {
    path: '/callback',
    name: 'GoogleCallback',
    component: GoogleCallback,
    layout: MainLayout,
  },
  { path: '*', name: 'Not Found', component: NotFound, layout: MainLayout, protected: false },
];

export default routes;
