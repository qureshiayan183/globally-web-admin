const NoData = ({
    title = "No Data Found",
    subtitle = "There is nothing to display right now.",
    isTable = false, // naya prop
}) => {
    return (
        <div
            className={`${isTable
                ? "inline-block text-center"
                : "flex flex-col items-center justify-center py-6 gap-2"
                }`}
        >

            <svg
                width="60"
                height="60"
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
            >
                <circle cx="150" cy="150" r="120" fill="#F5F6FA" />
                <rect x="95" y="110" width="110" height="80" rx="10" fill="white" stroke="#C4C7D1" strokeWidth="3" />
                <line x1="110" y1="130" x2="190" y2="130" stroke="#D0D3DB" strokeWidth="6" strokeLinecap="round" />
                <line x1="110" y1="155" x2="170" y2="155" stroke="#D0D3DB" strokeWidth="6" strokeLinecap="round" />
                <line x1="110" y1="180" x2="160" y2="180" stroke="#D0D3DB" strokeWidth="6" strokeLinecap="round" />
                <circle cx="150" cy="230" r="18" fill="#FFD166" />
                <path d="M142 228 L148 236 L160 224" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </svg>

            <h3 className="text-sm font-semibold text-gray-600">
                {title}
            </h3>

            <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                {subtitle}
            </p>
        </div>
    );
};

export default NoData;
