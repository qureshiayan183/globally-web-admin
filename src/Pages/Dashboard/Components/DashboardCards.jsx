import contact from "../../../assets/icons/contact-us.png";
import person from "../../../assets/icons/person.svg";
import quote from "../../../assets/icons/quote.png";

export default function DashboardCards() {
  const data = {
    totalEmployees: 17,
    totalContacts: 90,
    totalQuotes: 30,
  };

  const cards = [
    {
      value: data.totalEmployees,
      title: "Total Employees",
      icon: person,
      circleColor: "bg-purple-400 dark:bg-purple-500/20",
      borderColor: "border border-purple-300 dark:border-purple-500/30",
    },
    {
      value: data.totalContacts,
      title: "Total Contacts",
      icon: contact,
      circleColor: "bg-blue-400 dark:bg-blue-500/20",
      borderColor: "border border-blue-300 dark:border-blue-500/30",
    },
    {
      value: data.totalQuotes,
      title: "Total Quotes",
      icon: quote,
      circleColor: "bg-yellow-400 dark:bg-yellow-500/20",
      borderColor: "border border-yellow-300 dark:border-yellow-500/30",
    },
  ];

  return (
    <div className="p-4 transition-all mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`
    group rounded-xl p-6 flex flex-col justify-between
    bg-white text-gray-800 shadow-sm
    dark:bg-[#1C2535] dark:text-white
    transition-all duration-300 hover:shadow-md
    ${card.borderColor}
  `}
          >
            {/* Number */}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </p>

            {/* Title */}
            <p className="text-lg font-semibold mt-2 text-gray-600 dark:text-gray-300">
              {card.title}
            </p>

            {/* Icon */}
            <div className="mt-6">
              <div
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center
                  transition-all duration-300 group-hover:scale-110
                  ${card.circleColor}
                `}
              >
                <img
                  src={card.icon}
                  alt={card.title}
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
