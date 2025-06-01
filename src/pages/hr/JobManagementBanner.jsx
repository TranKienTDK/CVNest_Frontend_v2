import React from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const JobManagementBanner = ({ onCreateNew }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 mb-8">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-teal-600/20 to-transparent"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>

      <div className="relative z-10 py-12 px-8 md:py-16 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            className="md:w-1/2 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4 border border-white/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                Quản lý tuyển dụng
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
                Quản lý việc làm thông minh
              </span>
            </motion.h1>

            <motion.p
              className="text-lg opacity-90 mb-6 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Tạo và quản lý các vị trí tuyển dụng, theo dõi ứng viên và đánh
              giá CV phù hợp với nhu cầu của công ty bạn một cách hiệu quả.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Button
                className="bg-white text-teal-700 hover:bg-white/90 font-medium px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={onCreateNew}
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Tạo việc làm mới
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-72 h-72">
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <path
                        d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                        fill="rgba(255,255,255,0.1)"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    className="absolute inset-4 border-2 border-white/20 rounded-full"
                    animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: { duration: 8, repeat: Infinity },
                    }}
                  />
                  <motion.div
                    className="absolute inset-12 border-2 border-white/30 rounded-full"
                    animate={{ rotate: -360, scale: [1, 0.95, 1] }}
                    transition={{
                      rotate: {
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: { duration: 10, repeat: Infinity },
                    }}
                  />

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-400/80 to-cyan-500/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
                      <Briefcase className="h-12 w-12 text-white drop-shadow-md" />
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute top-0 -right-8 w-14 h-14 bg-cyan-400/30 backdrop-blur-md rounded-lg shadow-lg"
                    animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white/80" />
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-10 left-10 w-16 h-16 bg-emerald-400/30 backdrop-blur-md rounded-full shadow-lg"
                    animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="h-7 w-7 text-white/80" />
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute top-10 -left-10 w-12 h-12 bg-teal-400/30 backdrop-blur-md rounded-lg rotate-12 shadow-lg"
                    animate={{ y: [0, -10, 0], rotate: [12, 0, 12] }}
                    transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Search className="h-5 w-5 text-white/80" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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

export default JobManagementBanner;
