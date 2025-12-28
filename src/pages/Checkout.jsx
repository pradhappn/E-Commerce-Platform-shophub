import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const { cart, calculateTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await ordersAPI.create({
                shippingAddress: formData,
                paymentInfo: {
                    method: 'stripe',
                    transactionId: 'test_' + Date.now()
                }
            });

            alert('Order placed successfully!');
            await clearCart();
            navigate('/products');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                {error && <div className="error-message">{error}</div>}

                <div className="checkout-content">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <h2>Shipping Information</h2>

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className="input"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                className="input"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="input"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    className="input"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                className="input"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading || cart.items.length === 0}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>

                    <div className="order-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-items">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="summary-item">
                                    <span>{item.product.name} x {item.quantity}</span>
                                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
