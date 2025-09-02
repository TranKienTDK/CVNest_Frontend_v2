import React from "react";
import { motion } from "framer-motion";

const BannerCompany = ({
  title = "Khám phá các công ty hàng đầu",
  description = "Tìm kiếm và kết nối với các công ty hàng đầu trong nhiều lĩnh vực khác nhau.",
}) => {  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 mb-8">
      {/* 3D Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated geometric shapes */}        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-300/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-40 h-40 bg-red-200/20 rounded-full blur-lg"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 py-16 px-8 md:py-24 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text content */}
          <motion.div
            className="md:w-1/2 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Khám phá ngay hôm nay
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl opacity-90 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <button className="px-8 py-3 bg-white text-red-700 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 group-hover:rotate-12 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Tìm kiếm ngay
              </button>

              <button className="px-8 py-3 border-2 border-white/50 text-white rounded-full font-medium hover:bg-white/10 transition-all flex items-center gap-2">
                Tìm hiểu thêm
              </button>
            </motion.div>
          </motion.div>

          {/* 3D illustration */}
          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Abstract 3D elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Animated rings */}
                  <motion.div
                    className="absolute inset-0 border-4 border-white/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-4 border-4 border-white/30 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-8 border-4 border-white/40 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Center element */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-2xl rotate-45 flex items-center justify-center shadow-lg">
                      <div className="-rotate-45">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating elements */}                  <motion.div
                    className="absolute top-0 -right-8 w-12 h-12 bg-rose-400/30 backdrop-blur-md rounded-lg"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-10 left-10 w-16 h-16 bg-red-400/30 backdrop-blur-md rounded-full"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                  <motion.div
                    className="absolute top-10 -left-10 w-10 h-10 bg-orange-400/30 backdrop-blur-md rounded-lg rotate-12"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[70px]"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default BannerCompany;
