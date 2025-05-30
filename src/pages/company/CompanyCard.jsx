import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowUpRight, Building2, Users } from "lucide-react";
import { motion } from "framer-motion";

const CompanyCard = ({
  id = "1",
  name = "Company Name",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=company",
  industry = "Technology",
  location = "Hà Nội",
  onClick = () => {},
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card
        className="overflow-hidden bg-white border-0 h-full rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
        onClick={() => onClick(id)}
      >        {/* Gradient top bar */}
        <div className="h-2 bg-gradient-to-r from-red-400 to-orange-400 group-hover:from-red-500 group-hover:to-orange-500 transition-colors" />

        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start mb-5">
            {/* Company logo with animated border on hover */}
            <div className="relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center mr-4 border border-red-100 group-hover:border-red-200 transition-colors">
                <img
                  src={avatar}
                  alt={name}
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-red-100">
                <Building2 size={12} className="text-red-600" />
              </div>
            </div>            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-red-700 transition-colors">
                {name}
              </h3>
              <div className="flex items-center mt-1 text-gray-500 text-sm">
                <MapPin size={14} className="mr-1 text-red-500" />
                <span>{location}</span>
              </div>
            </div>

            {/* Arrow icon that appears on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <ArrowUpRight size={16} className="text-red-600" />
              </div>
            </div>
          </div>          {/* Additional info section */}
          
          <div className="mt-auto flex items-center justify-between">
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 font-medium"
            >
              {industry || "Không xác định"}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CompanyCard;
