import Link from "next/link"; // Use Next.js Link for routing
 
const Room = ({ room, fromdate, todate }) => {
  return (
    <Link href={`/room/${room._id}`} passHref>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer h-full flex flex-col justify-center transition-transform transform hover:scale-105 duration-300">
        {/* Room Image */}
        <div className="relative">
          <img
            src={room.imgurls[0]}
            alt={room.name}
            className="h-64 w-full object-cover transition-transform transform hover:scale-105 duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 text-center">
            <h2 className="text-2xl font-extrabold">{room.name}</h2>
          </div>
        </div>
 
        {/* Room Details */}
        <div className="p-6 space-y-4 flex-grow">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[#a08448] font-semibold">Max People</span>
            <span className="text-gray-700">{room.maxpeople}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[#a08448] font-semibold">Price</span>
            <span className="text-gray-700">{room.rentperday} THB</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[#a08448] font-semibold">Room Type</span>
            <span className="text-gray-700">{room.roomtype}</span>
          </div>
        </div>
 
        {/* Centered Book Now Button */}
        <div className="flex justify-center items-center py-4">
          {fromdate && todate && (
            <Link href={`/booking/${room._id}/${fromdate}/${todate}`} passHref>
              <span className="text-center bg-[#a08448] hover:bg-[#8c7240] text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                Book Now
              </span>
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
};
 
export default Room;
 