import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import LayoutUser from './layouts/LayoutUser';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ADMIN_ROUTES, PUBLIC_ROUTES, SELLER_ROUTES, USER_ROUTES } from './utils/routeConfig';
import LayoutAdmin from './layouts/LayoutAdmin';
import { ToastContainer } from 'react-toastify';
import NotFound from './utils/NotFound';
import ProtectedRoute from './utils/ProtectedRoute';
import Loading from './utils/Loading';
import LayoutSeller from './layouts/LayoutSeller';


function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <BrowserRouter>
          <Routes >
            <Route path="/" element={<LayoutUser />}>
              {PUBLIC_ROUTES.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
            <Route path="/*" element={
              <ProtectedRoute requiredRoles={[1, 2]}>
                <LayoutUser />
              </ProtectedRoute>
            }>
              {USER_ROUTES.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} >
                  {route.children && route.children.map((child, index) => (
                    <Route key={index} path={child.path} element={child.element} />
                  ))}
                </Route>
              ))}
            </Route>
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRoles={[3]}>
                <LayoutAdmin />
              </ProtectedRoute>
            }>
              {ADMIN_ROUTES.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
            <Route path="/seller/*" element={
              <ProtectedRoute requiredRoles={[2]}>
                <LayoutSeller />
              </ProtectedRoute>
            }>
              {SELLER_ROUTES.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Route>
            <Route path='/err' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
