import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, logout, isAdmin } = useAuth();
    const { getItemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <span className="logo-icon">🛍️</span>
                    <span className="logo-text">ShopHub</span>
                </Link>

                <nav className="nav-menu">
                    <Link to="/products" className="nav-link">Products</Link>
                    {isAdmin && (
                        <>
                            <Link to="/admin/products" className="nav-link">Manage Products</Link>
                            <Link to="/admin/orders" className="nav-link">Orders</Link>
                        </>
                    )}
                </nav>

                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="cart-button">
                                <span className="cart-icon">🛒</span>
                                {getItemCount() > 0 && (
                                    <span className="cart-badge">{getItemCount()}</span>
                                )}
                            </Link>

                            <div className="user-menu">
                                <span className="user-name">{user?.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
