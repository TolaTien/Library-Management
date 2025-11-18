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
    
    const [filterState, setFilterState] = useState({
        keyword: '',
        coverType: 'all', 
        language: 'all', // Đã chuyển mặc định về 'all' (chữ thường)
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await requestGetAllProduct(); 
                const products = res.data.metadata || res.data || [];
                
                setDataProduct(products);
                setAvailableLanguages(extractLanguages(products));
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
        if (name === 'coverType' || name === 'language') {
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
        
        const { keyword, coverType, language } = filterState;

        // KIỂM TRA ĐIỀU KIỆN LỌC ĐÃ ĐƯỢC KÍCH HOẠT CHƯA
        const isFilteringActive = keyword !== '' || coverType !== 'all' || language !== 'all';
        
        // Nếu không có bộ lọc nào được áp dụng, trả về toàn bộ dữ liệu gốc
        if (!isFilteringActive) {
            return dataProduct;
        }

        return dataProduct.filter(product => {
            
            // 1. Lọc theo Loại bìa
            const matchesCoverType = coverType === 'all' || 
                product.covertType?.toLowerCase() === coverType;
            
            // 2. Lọc theo Ngôn ngữ
            const matchesLanguage = language === 'all' || 
                product.language?.toLowerCase() === language;
            
            return  matchesCoverType && matchesLanguage;
        });
    }, [dataProduct, filterState]); // Chạy lại khi data gốc hoặc state lọc thay đổi

    return (
        // BEM: main-page-layout
        <div className="main-page-layout">
            <header>
                <Header />
            </header>
            <div>
                <Coverpage />
            </div>

            {/* BEM: main-page__infor-container */}
            <div className='main-page__infor-container'>
                
                {/* KHUNG BỘ LỌC BẮT ĐẦU */}
                <div className='main-page__filter'>
                    

                    {/* Phần tử lọc theo Loại bìa */}
                    <div className="filter-group">
                        <label htmlFor="cover-type-select" className="filter-label">Loại bìa:</label>
                        <select
                            id="cover-type-select"
                            name="coverType"
                            value={filterState.coverType}
                            onChange={handleChange}
                            className="filter-select"
                        >
                            <option value="all">Tất cả</option>
                            <option value="hard">Bìa cứng</option>
                            <option value="soft">Bìa mềm</option>
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
                            {/* Mapping động từ danh sách ngôn ngữ có sẵn */}
                            {availableLanguages.map(lang => (
                                <option key={lang} value={lang.toLowerCase()}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* KHUNG BỘ LỌC KẾT THÚC */}
                
                {/* BEM: main-page__product-grid */}
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