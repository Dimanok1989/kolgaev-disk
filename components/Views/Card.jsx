const Card = ({ content, children, className }) => (
    <div className={`mb-5 px-10 py-5 bg-white rounded-lg border-slate-200 border relative ${className && className}`}>
        {content ?? children}
    </div>
)

export default Card;