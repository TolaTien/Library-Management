import { useEffect } from 'react';
import CardBody from './components/Cardbody';
import Footer from './components/Footer';
import Header from './components/Header';
import { requestGetAllProduct } from './config/request';
import { useState } from 'react';
// Import file CSS riêng
import './App.css'; 

function App() {
    const [dataProduct, setDataProduct] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetAllProduct();
            setDataProduct(res.data);
        };
        fetchData();
    }, []);

    return (
        // BEM: main-page-layout
        <div className="main-page-layout">
            <header>
                <Header />
            </header>

            {/* BEM: main-page__product-grid */}
            <main className="main-page__product-grid">
                {dataProduct?.map((item) => (
                    <CardBody key={item.id} data={item} />
                ))}
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default App;