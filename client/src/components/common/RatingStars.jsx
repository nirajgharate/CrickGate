import { FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { HiStar } from "react-icons/hi";

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <HiStar key={i} className="text-yellow-400" />;
        } else if (i === fullStars && hasHalfStar) {
          return <FaStarHalfAlt key={i} className="text-yellow-400" />;
        } else {
          return <FaRegStar key={i} className="text-yellow-400" />;
        }
      })}
    </div>
  );
};
export default RatingStars;