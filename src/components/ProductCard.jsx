import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = async () => {
        const result = await addToCart(product._id, 1);
        if (result.success) {
            // Optional: Show success notification
            console.log('Added to cart!');
        }
    };

    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`} className="product-image-link">
                <div className="product-image-wrapper">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                </div>
            </Link>

            <div className="product-info">
                <Link to={`/products/${product._id}`} className="product-name-link">
                    <h3 className="product-name">{product.name}</h3>
                </Link>

                <p className="product-price">${product.price.toFixed(2)}</p>

                {product.ratings && (
                    <div className="product-rating">
                        <span className="stars">{'★'.repeat(Math.round(product.ratings.average))}</span>
                        <span className="rating-text">({product.ratings.count})</span>
                    </div>
                )}

                <div className="product-actions">
                    <button
                        className="btn btn-primary add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    <button className="btn btn-secondary cart-icon-btn">
                        🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
