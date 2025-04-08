import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Products from "../components/seller/Products";
import ProtectedRoute from "./ProtectedRoute";

const Home = lazy(() => import("../components/user/Home"));
const Profile = lazy(() => import("../components/user/Profile"));
const Address = lazy(() => import("../components/user/Address"));
const Ordered = lazy(() => import("../components/user/Ordered"));
const OrderDetail = lazy(() => import("../components/user/OrderDetail"));
const Favorite = lazy(() => import("../components/user/Favorite"));
const Cart = lazy(() => import("../components/user/Cart"));
const Payment = lazy(() => import("../components/user/Payment"));
const ProductDetail = lazy(() => import("../components/user/ProductDetail"));
const Dashboard = lazy(() => import("../components/admin/Dashboard"));
const Genres = lazy(() => import("../components/admin/Genres"));
const Login = lazy(() => import("../components/auth/Login"));
const Register = lazy(() => import("../components/auth/Register"));
const ChangePassword = lazy(() => import("../components/auth/ChangePassword"));
const ReportProducts = lazy(() => import("../components/user/ReportProducts"));
const ReportProductDetail = lazy(() => import("../components/user/ReportProductDetail"));
const Search = lazy(() => import("../components/user/Search"));
const ShopDetail = lazy(() => import("../components/user/ShopDetail"));
const LayoutAccount = lazy(() => import("../layouts/LayoutAccount"));
const SellerRegistration = lazy(() => import("../components/seller/SellerRegistration"));
const Report = lazy(() => import("../components/user/Report"));
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/auth/ResetPassword"));
const OrdersSeller = lazy(() => import("../components/seller/OrdersSeller"));
const Store = lazy(() => import("../components/seller/Store"));
const SellerProducts = lazy(() => import("../components/seller/SellerProducts"));
const DashboardSeller = lazy(() => import("../components/seller/Dashboard"));
const Promotions = lazy(() => import("../components/seller/Promotions"));
const Reviews = lazy(() => import("../components/seller/Reviews"));
const Vouchers = lazy(() => import("../components/seller/Vouchers"));
const StatisticRevenue = lazy(() => import("../components/seller/StatisticRevenue"));
const StatisticProduct = lazy(() => import("../components/seller/StatisticProduct"));
const SellerOrderDetail = lazy(() => import("../components/seller/SellerOrderDetail"));
const AddVoucher = lazy(() => import("../components/seller/AddVoucher"));
const EditVoucher = lazy(() => import("../components/seller/EditVoucher"));
const AddPromotion = lazy(() => import("../components/seller/AddPromotion"));
const EditPromotion = lazy(() => import("../components/seller/EditPromotion"))
const AddProduct = lazy(() => import("../components/seller/AddProduct"));
const EditProduct = lazy(() => import("../components/seller/EditProduct"));
const Test = lazy(() => import("../components/auth/Test"));
const AddGenre = lazy(() => import("../components/admin/AddGenre"));
const Publishers = lazy(() => import("../components/admin/Publishers"));
const Authors = lazy(() => import("../components/admin/Authors"));
const AddAddress = lazy(() => import("../components/user/AddAddress"));
const EditAddress = lazy(() => import("../components/user/EditAddress"));
const PlaceOrderAddress = lazy(() => import("../components/user/PlaceOrderAddress"));
export const PUBLIC_ROUTES = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: 'home', element: <Home /> },
  { path: 'product-detail/:id', element: <ProductDetail /> },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  { path: 'search', element: <Search /> },
  { path: "shop/:id", element: <ShopDetail /> },
  { path: "register-seller", element: <SellerRegistration /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "reset-password", element: <ResetPassword /> },
]

export const USER_ROUTES = [
  { path: 'payment', element: <Payment /> },
  { path: "report-product/:id", element: <Report /> },
  { path: 'cart', element: <Cart /> },
  { path: 'place-order-address', element: <PlaceOrderAddress /> },
  {
    path: "account",
    element: <ProtectedRoute requiredRoles={[1, 2]}><LayoutAccount /></ProtectedRoute>,
    children: [
      { path: "profile", element: <Profile /> },
      { path: "address", element: <Address /> },
      { path: "address/add", element: <AddAddress /> },
      { path: "address/edit/:addressId", element: <EditAddress /> },
      { path: "ordered", element: <Ordered /> },
      { path: "order/:id", element: <OrderDetail /> },
      { path: "favorite", element: <Favorite /> },
      { path: "report-products", element: <ReportProducts /> },
      { path: "report-product-detail/:id", element: <ReportProductDetail /> },
      { path: "change-password", element: <ChangePassword /> },

    ],
  },
]

export const ADMIN_ROUTES = [
  { path: 'dashboard', element: <Dashboard /> },
  { path: 'genres', element: <Genres /> },
  { path: 'addgenre', element: <AddGenre /> },
  { path: 'publishers', element: <Publishers /> },
  { path: 'authors', element: <Authors /> },
]

export const SELLER_ROUTES = [
  { path: 'dashboard', element: <DashboardSeller /> },
  { path: 'orders', element: <OrdersSeller /> },
  { path: 'products', element: <Products /> },
  { path: 'addproduct', element: <AddProduct /> },
  { path: 'editproduct/:product_code', element: <EditProduct /> },
  { path: 'store', element: <Store /> },
  { path: 'products', element: <SellerProducts /> },
  { path: 'promotions', element: <Promotions /> },
  { path: 'addpromotion', element: <AddPromotion /> },
  { path: 'editpromotion/:promotionId', element: <EditPromotion /> },
  { path: 'reviews', element: <Reviews /> },
  { path: 'vouchers', element: <Vouchers /> },
  { path: 'addvoucher', element: <AddVoucher /> },
  { path: 'editvoucher/:voucherId', element: <EditVoucher /> },
  { path: 'stats/products', element: <StatisticProduct /> },
  { path: 'stats/revenue', element: <StatisticRevenue /> },
  { path: 'order/:orderId', element: <SellerOrderDetail /> }
]