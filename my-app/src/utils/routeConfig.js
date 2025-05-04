import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Stores from "../components/admin/Stores";
import ReportStores from "../components/admin/ReportStores";

import Statistics from "../components/admin/Statistics";

import ProtectedRoute from "./ProtectedRoute";
import PaymentStatus from "../components/user/PaymentStatus";
import Products from "../components/seller/Products";
import AdminShopDetail from "../components/admin/AdminShopDetail";
import PaymentCOD from "../components/user/PaymentCOD";
import AdminReportProductDetail from "../components/admin/AdminReportProductDetail";
import SellerReportProducts from "../components/seller/SellerReportProducts";
import SellerReportProductDetail from "../components/seller/SellerReportProductDetail";
import SellerReportShops from "../components/seller/SellerReportShops";
import SellerReportShopDetail from "../components/seller/SellerReportShopDetail";
import ConfirmEmail from "../components/user/ConfirmEmail";
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
const ReportShops = lazy(() => import("../components/user/ReportShops"));
const AdminReportProducts = lazy(() =>
  import("../components/admin/ReportProducts")
);
const ReportProductDetail = lazy(() =>
  import("../components/user/ReportProductDetail")
);
const ReportShopDetail = lazy(() =>
  import("../components/user/ReportShopDetail")
);
const AdminReportStoresDetail = lazy(() =>
  import("../components/admin/AdminReportStoresDetail")
);
const Search = lazy(() => import("../components/user/Search"));
const ShopDetail = lazy(() => import("../components/user/ShopDetail"));
const LayoutAccount = lazy(() => import("../layouts/LayoutAccount"));
const SellerRegistration = lazy(() =>
  import("../components/seller/SellerRegistration")
);
const Report = lazy(() => import("../components/user/Report"));

const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/auth/ResetPassword"));
const OrdersSeller = lazy(() => import("../components/seller/OrdersSeller"));
const Store = lazy(() => import("../components/seller/Store"));
const SellerProducts = lazy(() =>
  import("../components/seller/SellerProducts")
);
const DashboardSeller = lazy(() => import("../components/seller/Dashboard"));
const Promotions = lazy(() => import("../components/seller/Promotions"));
const Reviews = lazy(() => import("../components/seller/Reviews"));
const Vouchers = lazy(() => import("../components/seller/Vouchers"));
const StatisticRevenue = lazy(() =>
  import("../components/seller/StatisticRevenue")
);
const StatisticProduct = lazy(() =>
  import("../components/seller/StatisticProduct")
);
const SellerOrderDetail = lazy(() =>
  import("../components/seller/SellerOrderDetail")
);
const AddVoucher = lazy(() => import("../components/seller/AddVoucher"));
const EditVoucher = lazy(() => import("../components/seller/EditVoucher"));
const AddPromotion = lazy(() => import("../components/seller/AddPromotion"));
const EditPromotion = lazy(() => import("../components/seller/EditPromotion"));
const AddProduct = lazy(() => import("../components/seller/AddProduct"));
const EditProduct = lazy(() => import("../components/seller/EditProduct"));
const Publishers = lazy(() => import("../components/admin/Publishers"));
const Authors = lazy(() => import("../components/admin/Authors"));
const AddAddress = lazy(() => import("../components/user/AddAddress"));
const EditAddress = lazy(() => import("../components/user/EditAddress"));
const PlaceOrderAddress = lazy(() =>
  import("../components/user/PlaceOrderAddress")
);
const ReportShop = lazy(() => import("../components/user/ReportShop"));
const AdminProducts = lazy(() => import("../components/admin/Products"));
const AdminProductDetail = lazy(() =>
  import("../components/admin/AdminProductDetail")
);

export const PUBLIC_ROUTES = [
  { path: "/", element: <Navigate to="/home" /> },
  { path: "home", element: <Home /> },
  { path: "product-detail/:id", element: <ProductDetail /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "search", element: <Search /> },
  { path: "shop/:id", element: <ShopDetail /> },
  { path: "register-seller", element: <SellerRegistration /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "reset-password", element: <ResetPassword /> },
  { path: "confirm-email", element: <ConfirmEmail /> },
];
export const USER_ROUTES = [
  { path: "report-product/:id", element: <Report /> },
  { path: "report-shop/:id", element: <ReportShop /> },
  { path: "register-seller", element: <SellerRegistration /> },
  { path: "cart", element: <Cart /> },
  { path: "payment-cod", element: <PaymentCOD /> },
  { path: "place-order-address", element: <PlaceOrderAddress /> },
  { path: "user/payment-status", element: <PaymentStatus /> },
  { path: "payment", element: <Payment /> },
  {
    path: "account",
    element: <LayoutAccount />,
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
      { path: "report-shops", element: <ReportShops /> },
      { path: "report-shop-detail/:id", element: <ReportShopDetail /> },
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
];

export const ADMIN_ROUTES = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "genres", element: <Genres /> },
  { path: "products", element: <AdminProducts /> },
  { path: "stores", element: <Stores /> },
  { path: "publishers", element: <Publishers /> },
  { path: "reports/products", element: <AdminReportProducts /> },
  { path: "reports/product-detail/:id", element: <AdminReportProductDetail /> },
  { path: "reports/stores", element: <ReportStores /> },
  { path: "authors", element: <Authors /> },
  { path: "shop/:shopSlug", element: <AdminShopDetail /> },
  { path: "product/:productCode", element: <AdminProductDetail /> },
  { path: "reports/stores/:id", element: <AdminReportStoresDetail /> },
  { path: "statistics", element: <Statistics /> },
];

export const SELLER_ROUTES = [
  { path: "dashboard", element: <DashboardSeller /> },
  { path: "orders", element: <OrdersSeller /> },
  { path: "products", element: <Products /> },
  { path: "addproduct", element: <AddProduct /> },
  { path: "editproduct/:product_code", element: <EditProduct /> },
  { path: "store", element: <Store /> },
  { path: "products", element: <SellerProducts /> },
  { path: "promotions", element: <Promotions /> },
  { path: "addpromotion", element: <AddPromotion /> },
  { path: "editpromotion/:promotionId", element: <EditPromotion /> },
  { path: "reviews", element: <Reviews /> },
  { path: "vouchers", element: <Vouchers /> },
  { path: "addvoucher", element: <AddVoucher /> },
  { path: "editvoucher/:voucherId", element: <EditVoucher /> },
  { path: "stats/products", element: <StatisticProduct /> },
  { path: "stats/revenue", element: <StatisticRevenue /> },
  { path: "order/:orderId", element: <SellerOrderDetail /> },
  { path: "report-products", element: <SellerReportProducts /> },
  { path: "report-product/:id", element: <SellerReportProductDetail /> },
  { path: "report-shops", element: <SellerReportShops /> },
  { path: "report-shop/:id", element: <SellerReportShopDetail /> },
];
