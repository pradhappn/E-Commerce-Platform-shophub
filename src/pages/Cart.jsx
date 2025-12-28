import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, calculateTotal, loading } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateQuantity(productId, newQuantity);
    };

    const handleRemove = async (productId) => {
        await removeFromCart(productId);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                {cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started!</p>
                        <button onClick={() => navigate('/products')} className="btn btn-primary">
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="cart-item">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="cart-item-image"
                                    />

                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.product.name}</h3>
                                        <p className="cart-item-price">${item.product.price.toFixed(2)}</p>
                                    </div>

                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.product._id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>$0.00</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <button className="btn btn-primary btn-full" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>

                            <div className="payment-methods">
                                <span>💳</span>
                                <span>💰</span>
                                <span>🔒</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
