import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import NavBar from './components/NavBar';
import NewTask from './components/NewTask';
import TaskDetail from './components/TaskDetail';
import EditTask from './components/EditTask';
import ProtectedRoute from './components/ProtectedRoute';
import CompletedTasksList from './components/CompletedTasksList'; 
import './App.css';

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginSuccess = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="App">
            {isLoggedIn && <NavBar onLogout={handleLogout} />}

            <Routes>
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rotas protegidas */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute isAuthenticated={isLoggedIn}>
                            <TaskList />
                        </ProtectedRoute>
                    }
                />
                <Route path="/nova-tarefa" element={
                    <ProtectedRoute isAuthenticated={isLoggedIn}>
                        <NewTask />
                    </ProtectedRoute>
                } />
                <Route path="/tarefa/:id" element={
                    <ProtectedRoute isAuthenticated={isLoggedIn}>
                        <TaskDetail />
                    </ProtectedRoute>
                } />
                <Route path="/editar-tarefa/:id" element={
                    <ProtectedRoute isAuthenticated={isLoggedIn}>
                        <EditTask />
                    </ProtectedRoute>
                } />
                <Route path="/tarefas-concluidas" element={
                    <ProtectedRoute isAuthenticated={isLoggedIn}>
                        <CompletedTasksList /> {/* Nova rota para tarefas concluídas */}
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

// Wrapper para o BrowserRouter
function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;