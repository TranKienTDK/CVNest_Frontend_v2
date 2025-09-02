import React from "react";
import { motion } from "framer-motion";
import logo from "../../../assets/CVNest_logo.jpg";

const BrandingPanel = ({
  title = "CVNest",
  subtitle = "Hành trình sự nghiệp của bạn bắt đầu tại đây",
  testimonial = "CVNest đã giúp tôi có được công việc mơ ước chỉ trong vài tuần. Nền tảng rất trực quan và đội ngũ hỗ trợ vô cùng nhiệt tình trong suốt quá trình tìm việc.",
  testimonialAuthor = "Eric Johnson, Kỹ sư phần mềm",
}) => {
  return (
    <motion.div
      className="relative h-full w-full bg-gradient-to-br from-[#205781] via-[#4F959D] to-[#164563] flex flex-col justify-between p-8 lg:p-12 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut",
          delay: 2,
        }}
      />      <div>
        <motion.div
          className="mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={logo} 
              alt="CVNest Logo" 
              className="w-16 h-16 rounded-full object-contain bg-white p-1"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {title}
            </h1>
          </div>
          <motion.div
            className="h-1 w-20 bg-white/80 mt-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-white/90 max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        className="mt-auto max-w-md bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <svg
          className="w-10 h-10 text-white/40 mb-4"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
        <p className="text-white/90 italic mb-4">{testimonial}</p>
        <p className="text-white/70 font-medium">{testimonialAuthor}</p>
      </motion.div>      <motion.div
        className="absolute bottom-4 left-8 lg:left-12 text-white/50 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        © {new Date().getFullYear()} CVNest. Tất cả các quyền được bảo lưu.
      </motion.div>
    </motion.div>
  );
};

export default BrandingPanel;
