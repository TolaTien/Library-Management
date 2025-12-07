import App from '../App';
import DetailProduct from '../pages/DetailProduct';
import Login from '../pages/Login';
import RegisterUser from '../pages/RegisterUser';
import Admin from '../pages/DashbroadComponents/index';
import InforUser from '../pages/InforUser';
import BorrowingHistory from '../pages/InforUserComponents/BorrowingHistory';
import AdminNotifications from '../pages/InforUserComponents/AdminNotifications';
export const routes = [
    {
        path: '/',
        component: <App />,
    },
    {
        path: '/product/:id',
        component: <DetailProduct />,
    },
    {
        path: '/notifications',
        component: <AdminNotifications/>,
    },
    {
        path: '/borrowingHistory',
        component: <BorrowingHistory />,
    },
    {
        path: '/login',
        component: <Login />,
    },
    {
        path: '/register',
        component: <RegisterUser />,
    },
    {
        path: '/admin',
        component: <Admin />,
    },
    {
        path: '/inforUser',
        component: <InforUser/>,
    },
];
