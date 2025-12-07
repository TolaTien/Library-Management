import './CustomCard.css'; 
const CustomCard = (props) => {
const { title, extra, bordered = true, children, className = '', style ,headStyle, bodyStyle,...restProps } = props;

  // Ghép class mặc định và class truyền từ ngoài vào
const containerClass = `custom-card-wrapper ${bordered ? 'custom-card-bordered' : ''} ${className}`;

return (
    <div className={containerClass} style={style} {...restProps}>
      {/* Chỉ render Header nếu có title hoặc extra */}
    {(title || extra) && (
        <div className="custom-card-head" style={headStyle}>
        <div className="custom-card-head-wrapper">
            {title && <div className="custom-card-head-title">{title}</div>}
            {extra && <div className="custom-card-extra">{extra}</div>}
        </div>
        </div>
    )}
        <div className="custom-card-body" style={bodyStyle}>
            {children}
        </div>
    </div>
);
};

export default CustomCard;