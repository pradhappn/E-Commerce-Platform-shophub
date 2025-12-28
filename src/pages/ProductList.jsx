import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';

    useEffect(() => {
        fetchProducts();
    }, [category, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (category !== 'all') params.category = category;
            if (search) params.search = search;

            const response = await productsAPI.getAll(params);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (newCategory) => {
        setSearchParams({ category: newCategory, search });
    };

    const handleSearch = (e) => {
        setSearchParams({ category, search: e.target.value });
    };

    const categories = ['all', 'Electronics', 'Clothing', 'Accessories', 'Home', 'Books', 'Sports'];

    return (
        <div className="products-page">
            <div className="container">
                <div className="products-header">
                    <h1 className="page-title">Our Products</h1>

                    <div className="search-bar">
                        <input
                            type="text"
                            className="input search-input"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearch}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                <div className="category-filter">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-btn ${category === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <h2>No products found</h2>
                        <p>Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
