import libraryCover from "../assets/images/library-cover-page.jpg"
import './Coverpage.css'; // Đảm bảo import file CSS của bạn

export const Coverpage = () => {
    return (
        <div className="cover-page-container">
            <div className="cover-page-text">
                <h1>Chào Mừng Bạn Đến Với Thư Viện Quốc Gia</h1>
            </div>
            <div className="cover-page-img-container"> 
                    <img src={libraryCover} alt="coverpage" />
            </div>
        </div>
    )
}