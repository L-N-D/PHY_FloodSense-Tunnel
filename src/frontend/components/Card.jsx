export default function Card({ title, children, className = '' }) {
    return (
        <div
            className={`rounded-lg border p-6 ${className}`}
            style={{ background: '#5A5A5A', borderColor: '#6B6B6B' }}
        >
            {title && <h3 className="text-lg font-semibold mb-4" style={{ color: '#FFFFFF' }}>{title}</h3>}
            {children}
        </div>
    );
}
