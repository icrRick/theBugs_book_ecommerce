import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ requiredRoles = [], children }) => {
    const { isAuthenticated, isInitialized, userInfo ,hasRole} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isInitialized) {
            return;
        }
        if (!isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: { from: location }
            });
            return;
        }
        if (requiredRoles.length > 0 && userInfo && !requiredRoles.includes(userInfo.role)) {
            navigate('/err', { replace: true });
        }
    }, [isAuthenticated, isInitialized, userInfo, requiredRoles, navigate, location]);

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }
    const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
        return <Navigate to="/err" replace />;
    }
   

    return <>{children}</>;
}

export default ProtectedRoute; 