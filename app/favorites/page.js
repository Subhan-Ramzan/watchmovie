// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const FavoritePage = () => {
//   const router = useRouter();
//   const [favorites, setFavorites] = useState([]);

//   // Load favorites from localStorage when the page loads
//   useEffect(() => {
//     const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
//     setFavorites(storedFavorites);
//   }, []);

//   const removeFavorite = (color) => {
//     const updatedFavorites = favorites.filter((fav) => fav !== color);
//     setFavorites(updatedFavorites);
//     localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Update localStorage
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-4">Your Favorite Boxes</h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//         {favorites.length === 0 ? (
//           <div className="text-center text-xl">No favorites yet!</div>
//         ) : (
//           favorites.map((color, index) => (
//             <div
//               key={index}
//               className={`w-20 h-20 rounded-lg ${color} relative`}
//             >
//               <button
//                 onClick={() => removeFavorite(color)}
//                 className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1"
//               >
//                 X
//               </button>
//               <div className="w-full h-full flex items-center justify-center text-white font-semibold">
//                 ★
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       <button
//         onClick={() => router.push("/divbox")}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
//       >
//         Go back to Boxes
//       </button>
//     </div>
//   );
// };

// export default FavoritePage;

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function FavoritePage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session) return;

      try {
        const response = await axios.get("/api/favorite");
        setFavorites(response.data.favorites || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [session]);

  const removeFavorite = async (color) => {
    const updatedFavorites = favorites.filter((fav) => fav !== color);
    setFavorites(updatedFavorites);

    try {
      await axios.post("/api/favorite", { colors: updatedFavorites });
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Favorite Boxes</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {favorites.length === 0 ? (
          <p>No favorites yet!</p>
        ) : (
          favorites.map((color, index) => (
            <div key={index} className={`w-20 h-20 rounded-lg ${color}`}>
              <button
                onClick={() => removeFavorite(color)}
                className="text-white bg-red-500 rounded-full p-1"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
