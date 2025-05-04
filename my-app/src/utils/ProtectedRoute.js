import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import { showErrorToast } from './Toast';

const ProtectedRoute = ({ requiredRoles = [], children }) => {
    const { isAuthenticated, isInitialized, userInfo, hasRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [hasShownToast, setHasShownToast] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        if (isAuthenticated && requiredRoles.length > 0 && userInfo && !requiredRoles.some(role => hasRole(role))) {
            if (!hasShownToast) {
                showErrorToast("Bạn không có quyền truy cập trang này");
                setHasShownToast(true);
            }
            navigate('/err', { replace: true });
        }
    }, [isAuthenticated, isInitialized, userInfo, requiredRoles, navigate, location, hasRole, hasShownToast]);

    if (!isInitialized) {
        return <Loading />;
    }

    if (!isAuthenticated || !userInfo) {
        if (!hasShownToast) {
            showErrorToast("Vui lòng đăng nhập để tiếp tục");
            setHasShownToast(true);
        }
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
        return <Navigate to="/err" replace />;
    }

    return children;
};

export default ProtectedRoute; 