import { useEffect, useState, useMemo } from 'react';
import CardBody from './components/Cardbody';
import Footer from './components/Footer';
import Header from './components/Header';
import { requestGetAllProduct } from './config/request';
import { Coverpage } from './components/CoverPage';
import './App.css';

function App() {
    const [dataProduct, setDataProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [availableCategory, setAvailableCategory] = useState([]);
    
    const [filterState, setFilterState] = useState({
        category: 'all', // Đã đồng nhất tên khóa
        language: 'all',
    });

    const extractLanguages = (products) => {
        if (!products || products.length === 0) return [];
        
        const languages = new Set();
        products.forEach(p => {
            if (p.language) {
                languages.add(p.language.trim()); 
            }
        });
        return Array.from(languages).sort();
    };
    
    // Lọc theo thể loại và thêm return
    const extractCategory = (products) => {
        if (!products || products.length === 0) return [];

        const categories = new Set();
        products.forEach(p => {
            // Giả định thuộc tính là 'categories'
            if (p.category) { 
                categories.add(p.category.trim());
            }
        }) 
        //  THÊM LỆNH RETURN
        return Array.from(categories).sort();
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await requestGetAllProduct(); 
                const products = res.data.metadata || res.data || [];
                
                setDataProduct(products);
                setAvailableLanguages(extractLanguages(products));
                // Phải chạy hàm đã sửa
                setAvailableCategory(extractCategory(products)); 
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setDataProduct([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        if (name === 'category' || name === 'language') {
            // Đảm bảo cả hai giá trị lọc đều được chuyển về chữ thường
            processedValue = value.toLowerCase(); 
        }

        setFilterState(prev => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    // Logic Lọc Sách đã sửa
    const filteredProducts = useMemo(() => {
        if (!dataProduct || dataProduct.length === 0) return [];
        
        const { category, language } = filterState;

        const isFilteringActive = category !== 'all' || language !== 'all';
        
        if (!isFilteringActive) {
            return dataProduct;
        }

        return dataProduct.filter(product => {
            
            // 1. Lọc theo Thể loại (sử dụng product.categories)
            const matchesCategory = category === 'all' || 
                product.category?.toLowerCase() === category;
            
            // 2. Lọc theo Ngôn ngữ
            const matchesLanguage = language === 'all' || 
                product.language?.toLowerCase() === language;
            
            return matchesCategory && matchesLanguage;
        });
    }, [dataProduct, filterState]);

    return (
        <div className="main-page-layout">
            <header>
                <Header />
            </header>
            <div>
                <Coverpage />
            </div>

            <div className='main-page__infor-container'>
                
                {/* KHUNG BỘ LỌC BẮT ĐẦU */}
                <div className='main-page__filter'>
                    
                    {/* Phần tử lọc theo Thể loại */}
                    <div className="filter-group">
                        <label htmlFor="cover-type-select" className="filter-label">Thể loại:</label>
                        <select
                            id="cover-type-select"
                            name="category" 
                            value={filterState.category} 
                            onChange={handleChange}
                            className="filter-select"
                        >
                            <option value="all">Tất cả</option>
                            {availableCategory.map(cat => (
                                <option key={cat} value={cat.toLowerCase()}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Phần tử lọc theo Ngôn ngữ */}
                    <div className="filter-group">
                        <label htmlFor="language-select" className="filter-label">Ngôn ngữ:</label>
                        <select
                            id="language-select"
                            name="language" 
                            value={filterState.language}
                            onChange={handleChange}
                            className="filter-select"
                        >
                            <option value="all">Tất cả</option>
                            {availableLanguages.map(lang => (
                                <option key={lang} value={lang.toLowerCase()}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* KHUNG BỘ LỌC KẾT THÚC */}
                
                <main className="main-page__product-grid">
                    {loading ? (
                        <p className="main-page__loading-text">Đang tải sách...</p>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <CardBody key={item.id} data={item} />
                        ))
                    ) : (
                        <p className="main-page__no-results">Không tìm thấy sách nào phù hợp.</p>
                    )}
                </main>
            </div>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default App;