import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  FilterXIcon,
  SlidersHorizontal,
  Briefcase,
  Clock,
  GraduationCap,
  DollarSign,
  Code,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const JobSearchFilters = ({
  title = "",
  setTitle = () => {},
  contract = undefined,
  setContract = () => {},
  jobType = undefined,
  setJobType = () => {},
  level = undefined,
  setLevel = () => {},
  salaryRange = undefined,
  setSalaryRange = () => {},
  skillIds = [],
  setSkillIds = () => {},
  skills = [],
  handleSearch = () => {},
  handleClearSearch = () => {},
}) => {  
  const [skillSearch, setSkillSearch] = useState("");
  const [filteredSkills, setFilteredSkills] = useState(skills);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const skillInputRef = useRef(null);
  const skillDropdownRef = useRef(null);
  
  useEffect(() => {
    if (skillSearch.trim() === "") {
      setFilteredSkills(skills);
    } else {
      const filtered = skills.filter((skill) =>
        skill.name.toLowerCase().includes(skillSearch.toLowerCase())
      );
      setFilteredSkills(filtered);
    }
  }, [skillSearch, skills]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        skillDropdownRef.current &&
        !skillDropdownRef.current.contains(event.target) &&
        skillInputRef.current &&
        !skillInputRef.current.contains(event.target)
      ) {
        setIsSkillDropdownOpen(false);
      }
    };
    
    if (isSkillDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSkillDropdownOpen]);

  const handleSkillToggle = (skillId) => {
    if (skillIds.includes(skillId)) {
      setSkillIds(skillIds.filter((id) => id !== skillId));
    } else {
      setSkillIds([...skillIds, skillId]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >      
      <Card className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-400" />

        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <SlidersHorizontal size={18} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Bộ lọc tìm kiếm việc làm
            </h3>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-start relative z-20">
              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <Search size={14} className="text-red-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Tên công việc
                  </label>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Nhập tên công việc"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all pl-4 pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                    <Search size={12} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/4 space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock size={14} className="text-red-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Loại hợp đồng
                  </label>
                </div>
                <Select onValueChange={setContract} value={contract}>
                  <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all">
                    <SelectValue placeholder="Chọn loại hợp đồng" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                    <SelectItem
                      value="FULL_TIME"
                      className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                          <Clock size={12} className="text-red-600" />
                        </div>
                        Fulltime
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="PART_TIME"
                      className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                          <Clock size={12} className="text-red-600" />
                        </div>
                        Part-time
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="FREELANCE"
                      className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                          <Clock size={12} className="text-red-600" />
                        </div>
                        Freelance
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-1/4 space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <Briefcase size={14} className="text-red-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Loại công việc
                  </label>
                </div>
                <Select onValueChange={setJobType} value={jobType}>
                  <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all">
                    <SelectValue placeholder="Chọn loại công việc" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                    <SelectItem
                      value="IN_OFFICE"
                      className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                          <Briefcase size={12} className="text-red-600" />
                        </div>
                        In Office
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="REMOTE"
                      className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                          <Briefcase size={12} className="text-red-600" />
                        </div>
                        Remote
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="HYBRID"
                      className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                          <Briefcase size={12} className="text-red-600" />
                        </div>
                        Hybrid
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3 relative z-30">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Code size={14} className="text-red-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Kỹ năng
                  </label>
                </div>
                {skillIds.length > 0 && (
                  <span className="text-xs text-gray-500">
                    Đã chọn {skillIds.length} kỹ năng
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="relative" ref={skillInputRef}>
                  <Input
                    placeholder="Nhập để tìm kỹ năng..."
                    className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all pl-4 pr-10"
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setIsSkillDropdownOpen(true);
                    }}
                    onFocus={() => setIsSkillDropdownOpen(true)}
                    onClick={() => setIsSkillDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSkillDropdownOpen(false);
                      }
                    }}
                  />

                  {skillSearch && (
                    <button
                      className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      onClick={() => setSkillSearch("")}
                      type="button"
                    >
                      <X size={12} className="text-gray-600" />
                    </button>
                  )}
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSkillDropdownOpen(!isSkillDropdownOpen);
                    }}
                  >
                    {isSkillDropdownOpen ? (
                      <X size={12} className="text-gray-600" />
                    ) : (
                      <Search size={12} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {skillIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skillIds.map((skillId) => {
                      const skill = skills.find((s) => s.id === skillId);
                      return skill ? (
                        <Badge
                          key={skill.id}
                          variant="default"
                          className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 font-medium py-1 px-3 pr-1 rounded-md flex items-center gap-1"
                        >
                          {skill.name}
                          <button
                            className="w-5 h-5 rounded-full bg-red-200 hover:bg-red-300 flex items-center justify-center transition-colors"
                            onClick={() => handleSkillToggle(skill.id)}
                          >
                            <X size={12} className="text-red-700" />
                          </button>
                        </Badge>
                      ) : null;
                    })}

                    <button
                      onClick={() => setSkillIds([])}
                      className="text-xs text-gray-500 hover:text-red-600 underline"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}
                {isSkillDropdownOpen && (
                  <div
                    ref={skillDropdownRef}
                    className="absolute z-[99999] bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto mt-1 w-full"
                    style={{
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2">
                      {filteredSkills.length === 0 ? (
                        <div className="px-3 py-4 text-center text-gray-500">
                          Không tìm thấy kỹ năng phù hợp
                        </div>
                      ) : (
                        filteredSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              skillIds.includes(skill.id)
                                ? "bg-red-50 text-red-700"
                                : "hover:bg-red-50 hover:text-red-700"
                            }`}
                            onClick={() => handleSkillToggle(skill.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded-sm border ${
                                    skillIds.includes(skill.id)
                                      ? "bg-red-500 border-red-500"
                                      : "border-gray-300"
                                  } flex items-center justify-center`}
                                >
                                  {skillIds.includes(skill.id) && (
                                    <Check size={10} className="text-white" />
                                  )}
                                </div>
                                <span>{skill.name}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-start relative z-20">
              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <GraduationCap size={14} className="text-red-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Cấp bậc
                  </label>
                </div>
                <Select onValueChange={setLevel} value={level}>
                  <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all">
                    <SelectValue placeholder="Chọn cấp bậc" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-lg max-h-[300px] overflow-y-auto">
                    {[
                      { value: "INTERN", label: "Intern" },
                      { value: "FRESHER", label: "Fresher" },
                      { value: "JUNIOR", label: "Junior" },
                      { value: "MIDDLE", label: "Middle" },
                      { value: "SENIOR", label: "Senior" },
                      { value: "LEADER", label: "Trưởng nhóm" },
                      { value: "DEPARTMENT_LEADER", label: "Trưởng phòng" },
                    ].map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                            <GraduationCap
                              size={12}
                              className="text-red-600"
                            />
                          </div>
                          {item.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-1/4 space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <DollarSign size={14} className="text-red-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Mức lương
                  </label>
                </div>
                <Select onValueChange={setSalaryRange} value={salaryRange}>
                  <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all">
                    <SelectValue placeholder="Chọn mức lương" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                    {[
                      "Từ 3.000.000 đ",
                      "Từ 5.000.000 đ",
                      "Từ 10.000.000 đ",
                      "Từ 20.000.000 đ",
                      "Từ 30.000.000 đ",
                      "Từ 50.000.000 đ",
                    ].map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                            <DollarSign size={12} className="text-red-600" />
                          </div>
                          {item}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto md:self-end">
                <Button
                  onClick={handleSearch}
                  className="h-11 px-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-300 flex-1 md:flex-none shadow-md hover:shadow-lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>

                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="h-11 px-6 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-300 flex-1 md:flex-none"
                >
                  <FilterXIcon className="w-4 h-4 mr-2" />
                  Xóa tìm kiếm
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobSearchFilters;
