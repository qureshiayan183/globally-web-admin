import NoData from "../../../utils/DataNotFound";
import formatDate from "../../../utils/formateDate";

export default function AllContacts() {
  const profiles = [
    {
      _id: "1",
      name: "Sana",
      price: "5000",
      isDisable: false,
      date: new Date(),
      image: [
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      ],
    },
    {
      _id: "2",
      name: "Aisha",
      price: "4500",
      isDisable: true,
      date: new Date(),
      image: [
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      ],
    },
    {
      _id: "3",
      name: "Ritu",
      price: "6000",
      isDisable: false,
      date: new Date(),
      image: [
        "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      {/* LEFT BOX */}
      <div
        className="lg:col-span-2 bg-white dark:bg-[#1E2738]
        text-gray-800 dark:text-white rounded-2xl p-4 
        border border-pink-300 dark:border-pink-600/50 shadow-xl"
      >
        <div
          className="flex flex-col sm:flex-row 
          sm:justify-between sm:items-center 
          gap-3 sm:gap-0 mb-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold">All Contacts</h2>

          <button
            className="bg-pink-500 hover:bg-pink-600 text-white 
            px-5 py-2 rounded-lg font-medium shadow
            w-full sm:w-auto"
          >
            View More
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto custom-scrollbar mt-4 whitespace-nowrap">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr
                className="border-b border-gray-300 dark:border-gray-600
                text-gray-600 dark:text-gray-300"
              >
                <th className="py-3 px-4 min-w-[20px]">#</th>
                <th className="py-3 px-4 min-w-[70px]">Image</th>
                <th className="py-3 px-4 min-w-[70px]">Name</th>
                <th className="py-3 px-4 min-w-[80px]">Price</th>
                <th className="py-3 px-4 min-w-[100px]">Status</th>
                <th className="py-3 px-4 min-w-[120px]">Date</th>
                <th className="py-3 px-4 min-w-[150px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    <NoData title="No Models Found!" />
                  </td>
                </tr>
              ) : (
                profiles.map((m, index) => (
                  <tr
                    key={m._id}
                    className="border-b border-gray-200 dark:border-gray-700
                    hover:bg-gray-100 dark:hover:bg-gray-700/40 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>

                    <td className="py-3 px-4">
                      <img
                        src={m.image[0]}
                        className="w-10 h-10 rounded-full object-cover shadow"
                        alt=""
                      />
                    </td>

                    <td className="py-3 px-4 font-medium">{m.name}</td>
                    <td className="py-3 px-4">{m.price}</td>

                    <td className="py-3 px-4">
                      {m.isDisable === false ? (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium
                          bg-emerald-100 text-emerald-700
                          dark:bg-emerald-700 dark:text-emerald-100"
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium
                          bg-yellow-100 text-yellow-700
                          dark:bg-yellow-600 dark:text-yellow-100"
                        >
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">{formatDate(m.date)}</td>

                    <td className="py-3 px-4 flex gap-2">
                      <button
                        className="px-4 py-1 rounded-lg text-sm font-medium
                        bg-yellow-100 text-yellow-700 hover:bg-yellow-200
                        dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-400"
                      >
                        Edit
                      </button>

                      <button
                        className="px-4 py-1 rounded-lg text-sm font-medium
                        bg-red-100 text-red-700 hover:bg-red-200
                        dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
                      >
                        {m.isDisable ? "Activate" : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
