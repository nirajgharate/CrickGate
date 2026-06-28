import { motion } from 'framer-motion';
export const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 focus:outline-none";

  const variants = {
    primary: "bg-[#326B0F] text-white hover:bg-green-800",
    secondary: "bg-[#DEFFE0] text-[#326B0F] hover:bg-green-100",
    outline: "border-2 border-[#326B0F] text-[#326B0F] hover:bg-[#326B0F] hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
