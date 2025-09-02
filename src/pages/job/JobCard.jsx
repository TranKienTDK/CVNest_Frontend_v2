import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  ArrowUpRight,
  Briefcase,
  Clock,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import companyAPI from "@/api/company";

const JobCard = ({
  id = "1",
  title = "Job Title",
  level = "MIDDLE",
  salary = 15000000,
  company = "Company Name",
  companyId = "",
  location = "Hà Nội",
  jobType = "REMOTE",
  contract = "FULL_TIME",
  skills = ["Skill 1", "Skill 2"],
  logo = "https://api.dicebear.com/7.x/avataaars/svg?seed=job",
  onClick = () => {},
  job = null,
}) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const actualCompanyId = job?.companyId || companyId;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (actualCompanyId) {
        try {
          setLoading(true);
          const response = await companyAPI.getDetailCompany(actualCompanyId);
          setCompanyDetails(response.data.data);
        } catch (error) {
          console.error("Error fetching company details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompanyDetails();
  }, [actualCompanyId]);
  const formatJobType = (type) => {
    switch (type) {
      case "REMOTE":
        return "Remote";
      case "IN_OFFICE":
        return "In Office";
      case "HYBRID":
        return "Hybrid";
      default:
        return type;
    }
  };

  const formatContract = (type) => {
    switch (type) {
      case "FULL_TIME":
        return "Full-time";
      case "PART_TIME":
        return "Part-time";
      case "FREELANCE":
        return "Freelance";
      default:
        return type;
    }
  };

  const formatLevel = (lvl) => {
    switch (lvl) {
      case "INTERN":
        return "Intern";
      case "FRESHER":
        return "Fresher";
      case "JUNIOR":
        return "Junior";
      case "MIDDLE":
        return "Middle";
      case "SENIOR":
        return "Senior";
      case "LEADER":
        return "Trưởng nhóm";
      case "DEPARTMENT_LEADER":
        return "Trưởng phòng";
      default:
        return lvl;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >      <Card
        className="overflow-hidden bg-white border-0 h-full rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
        onClick={() => onClick(id)}
      >
        <div className="h-2 bg-gradient-to-r from-red-400 to-orange-400 group-hover:from-red-500 group-hover:to-orange-500 transition-colors" />

        <div className="p-6 flex flex-col h-full">          <div className="flex items-start mb-5">
            <div className="relative">              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center mr-4 border border-red-100 group-hover:border-red-200 transition-colors">
                <img
                  src={companyDetails?.avatar || logo}
                  alt={companyDetails?.name || company}
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center border border-red-100">
                <Briefcase size={12} className="text-red-600" />
              </div>
            </div>

            <div className="flex-1">              <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-red-700 transition-colors">
                {title}
              </h3>
              <div className="flex items-center mt-1 text-gray-500 text-sm">
                <span className="mr-3">{companyDetails?.name || company}</span>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1 text-red-500" />
                  <span>{location}</span>
                </div>
              </div>            </div>            <div className="opacity-0 group-hover:opacity-100 transition-opacity">              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <ArrowUpRight size={16} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="py-3 px-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex flex-wrap gap-y-2 justify-between">
              <div className="flex items-center text-sm text-gray-600">                <Clock size={14} className="mr-2 text-red-500" />
                <span>{formatContract(contract)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase size={14} className="mr-2 text-red-500" />
                <span>{formatJobType(jobType)}</span>
              </div>              <div className="flex items-center text-sm text-gray-600 font-medium text-red-700">
                <DollarSign size={14} className="mr-1 text-red-500" />
                <span>{salary.toLocaleString()} đ</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 font-medium"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200 font-medium"
              >
                +{skills.length - 3}
              </Badge>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 font-medium"
            >
              {formatLevel(level)}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCard;
