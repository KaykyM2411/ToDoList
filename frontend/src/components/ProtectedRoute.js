import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        // Se o usuário não estiver autenticado, redireciona para a tela de login
        return <Navigate to="/login" replace />;
    }

    // Se estiver autenticado, permite que a rota continue
    return children;
};

export default ProtectedRoute;