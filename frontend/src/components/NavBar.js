import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleNewTask = () => {
        navigate('/nova-tarefa');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">ToDoList</Link>
            </div>
            <div className="navbar-right">
                <button onClick={handleNewTask} className="btn-new-task">Nova Tarefa</button>
                <Link to="/tarefas-concluidas" className="btn-new-task">Concluídas</Link>
                <button onClick={onLogout} className="btn-new-task btn-logout">Sair</button>
            </div>
        </nav>
    );
};

export default Navbar;