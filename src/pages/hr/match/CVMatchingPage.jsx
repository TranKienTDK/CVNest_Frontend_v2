import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./TabsComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  Code,
  BookOpen,
  RefreshCw,
  Circle,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Badge component
const Badge = ({ children, className, variant = "default" }) => {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-gray-200 hover:bg-gray-100 text-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none ${variantStyles[variant]} ${className || ""}`}
    >
      {children}
    </span>
  );
};

// Helper function to parse explanation string into key-value pairs
const parseExplanationToDetails = (explanationText) => {
  const details = {};
  if (typeof explanationText !== "string" || !explanationText) {
    return details;
  }

  const sectionRegex = /(\b[A-Z][a-zA-Z\s]+?\b):\s*([\s\S]*?)(?=\b[A-Z][a-zA-Z\s]+?\b:|$)/g;
  let match;

  while ((match = sectionRegex.exec(explanationText)) !== null) {
    const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
    const value = match[2].trim().replace(/\.$/, "");
    details[key] = value;
  }

  if (Object.keys(details).length === 0) {
    const fallbackSections = explanationText.split(";").filter((section) => section.trim());
    fallbackSections.forEach((section) => {
      const colonIndex = section.indexOf(":");
      if (colonIndex > -1) {
        const key = section.substring(0, colonIndex).trim().toLowerCase().replace(/\s+/g, "_");
        const value = section.substring(colonIndex + 1).trim().replace(/\.$/, "");
        if (key && value) {
          details[key] = value;
        }
      }
    });
  }
  return details;
};

const CVMatchingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState([
    { message: "Khởi tạo quá trình đánh giá CV", completed: false },
    { message: "Phân tích yêu cầu công việc từ JD", completed: false },
    { message: "Chuẩn bị xử lý CV của ứng viên", completed: false },
    { message: "Đánh giá mức độ phù hợp của ứng viên", completed: false },
    { message: "Chuẩn bị hiển thị kết quả", completed: false },
  ]);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.job) {
      setSelectedJob(location.state.job);
    }
  }, [location.state]);

  const getMatchLevelFromPercentage = (percentage) => {
    if (isNaN(percentage)) return "medium";
    if (percentage >= 70) return "high";
    if (percentage >= 40) return "medium";
    return "low";
  };

  const parseSkills = (skillsTextEntry) => {
    if (typeof skillsTextEntry !== "string") {
      return [];
    }

    const skills = [];
    const overallMatch = skillsTextEntry.match(/Matched\s*(\d+)\/(\d+)\s*mandatory skills\s*\((\d+)%\)/i);

    if (overallMatch) {
      const matchedCount = parseInt(overallMatch[1]);
      const totalCount = parseInt(overallMatch[2]);

      for (let i = 0; i < matchedCount; i++) {
        skills.push({ name: `Matched Skill ${i + 1}`, match: "high" });
      }
      for (let i = 0; i < totalCount - matchedCount; i++) {
        skills.push({ name: `Missing Skill ${i + 1}`, match: "low" });
      }
    } else {
      const percentageMatch = skillsTextEntry.match(/\((\d+)%\)/);
      if (percentageMatch && percentageMatch[1]) {
        const generalPercentage = parseInt(percentageMatch[1]);
        skills.push({ name: "Overall Skills Match", match: getMatchLevelFromPercentage(generalPercentage) });
      } else {
        skills.push({ name: "Skills (Details in Explanation)", match: "medium" });
      }
    }

    return skills.length > 0 ? skills : [{ name: "Skills (Details in Explanation)", match: "medium" }];
  };

  const getMatchLevel = (text) => {
    if (!text || typeof text !== "string") return "medium";

    try {
      const percentageMatch = text.match(/(\d+)%\)/);
      if (percentageMatch && percentageMatch[1]) {
        return getMatchLevelFromPercentage(parseInt(percentageMatch[1]));
      }
      const textLower = text.toLowerCase();
      if (textLower.includes("high match") || textLower.includes("100%")) return "high";
      if (textLower.includes("low match") || textLower.includes("0%")) return "low";
    } catch (error) {
      console.error("Error getting match level from text:", text, error);
    }
    return "medium";
  };

  const fetchCVMatches = async (jobId) => {
    if (!jobId) return;

    setLoading(true);
    setError(null);
    setLoadingStep(0);
    setLoadingProgress(0);
    setLoadingMessages((prevMessages) =>
      prevMessages.map((msg) => ({ ...msg, completed: false }))
    );

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    let progressInterval = null;

    try {
      await updateLoadingState(0, 10);
      await updateLoadingState(1, 25);

      const apiPromise = axios.post(
        `http://localhost:8000/match-all/${jobId}`,
        {},
        { signal, timeout: 45000 }
      );

      await updateLoadingState(2, 40);
      setLoadingStep(3);

      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => Math.min(85, prev + 1));
      }, 400);

      const response = await apiPromise;
      clearInterval(progressInterval);
      progressInterval = null;

      setLoadingProgress(90);
      await updateLoadingState(4, 100);

      if (response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map((item, index) => {
          if (!item || !item.cv_id) {
            return {
              id: `error-${index}`,
              name: `Candidate Error ${index + 1}`,
              email: "N/A",
              phone: "N/A",
              matchScore: 0,
              explanation: "Invalid data from API.",
              skills: [],
              experience: [],
              education: [],
              explanationDetails: {},
              resumeUrl: "#",
            };
          }

          const explanationText = typeof item.explanation === "string" ? item.explanation : "Không có giải thích chi tiết.";
          const explanationDetails = parseExplanationToDetails(explanationText);

          const skills = explanationDetails.skills ? parseSkills(explanationDetails.skills) : [];
          const experience = explanationDetails.experience
            ? [{ title: "Work Experience Summary", company: "Details in explanation", duration: "Based on CV/JD", match: getMatchLevel(explanationDetails.experience) }]
            : [];
          const education = explanationDetails.education
            ? [{ degree: "Education Summary", institution: "Details in explanation", year: "N/A", match: getMatchLevel(explanationDetails.education) }]
            : [];

          return {
            id: item.cv_id,
            name: `Candidate (CV ID: ${item.cv_id.substring(0, 6)})`,
            email: item.email || `no-email-${index}@example.com`,
            phone: item.phone || "N/A",
            matchScore: typeof item.score === "number" ? parseFloat(item.score.toFixed(1)) : 0,
            explanation: explanationText,
            skills,
            experience,
            education,
            explanationDetails,
            resumeUrl: item.resume_url || "#",
          };
        });

        setCandidates(transformedData);
      } else {
        setError("Định dạng dữ liệu không hợp lệ từ máy chủ.");
        setCandidates([]);
      }
    } catch (err) {
      clearInterval(progressInterval);
      if (err.name !== "AbortError") {
        if (err.code === "ECONNABORTED") {
          setError("Quá thời gian phản hồi từ máy chủ. Vui lòng thử lại.");
        } else if (err.response) {
          setError(`Lỗi từ máy chủ: ${err.response.status} - ${err.response.data.detail || err.message}`);
        } else {
          setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối và thử lại.");
        }
      }
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      if (!abortControllerRef.current?.signal?.aborted) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  };

  const updateLoadingState = async (step, progress) => {
    if (abortControllerRef.current?.signal?.aborted) return;
    setLoadingStep(step);
    setLoadingProgress(progress);
    setLoadingMessages((prevMessages) =>
      prevMessages.map((msg, idx) => ({ ...msg, completed: idx < step }))
    );
    const delays = [800, 1200, 1500, 100, 500];
    return new Promise((resolve) => setTimeout(resolve, delays[step] || 500));
  };

  const cancelMatching = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError("Quá trình đánh giá CV đã bị hủy.");
    }
  };

  const startMatching = () => {
    if (selectedJob && selectedJob.id) {
      setCandidates([]);
      setError(null);
      fetchCVMatches(selectedJob.id);
    } else {
      setError("Vui lòng chọn một công việc để bắt đầu đánh giá.");
    }
  };

  const filteredCandidates = candidates
    .filter((candidate) => {
      if (!candidate) return false;
      const nameMatch = candidate.name && candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = nameMatch || emailMatch;
      const score = typeof candidate.matchScore === "number" ? candidate.matchScore : 0;
      const matchesScoreFilter =
        filterScore === "all" ||
        (filterScore === "high" && score >= 85) ||
        (filterScore === "medium" && score >= 70 && score < 85) ||
        (filterScore === "low" && score < 70);
      return matchesSearch && matchesScoreFilter;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      const scoreA = typeof a.matchScore === 0;
      const scoreB = typeof b.matchScore === "number" ? b.matchScore : 0;
      if (sortBy === "score") {
        return sortOrder === "desc" ? scoreB - scoreA : scoreA - scoreB;
      } else {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return sortOrder === "desc" ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      }
    });

  const toggleExpand = (id) => {
    setExpandedCandidate(expandedCandidate === id ? null : id);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const getMatchBadge = (match) => {
    const matchLower = typeof match === "string" ? match.toLowerCase() : "medium";
    switch (matchLower) {
      case "high":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Phù hợp cao</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Phù hợp TB</Badge>;
      case "low":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Phù hợp thấp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Chưa rõ</Badge>;
    }
  };

  const getExplanationIcon = (key) => {
    const normalizedKey = typeof key === "string" ? key.toLowerCase().replace(/\s+/g, "_") : "";
    const iconMap = {
      skills: <Code className="h-5 w-5 text-blue-500" />,
      experience: <Briefcase className="h-5 w-5 text-amber-500" />,
      education: <GraduationCap className="h-5 w-5 text-indigo-500" />,
      certifications: <Award className="h-5 w-5 text-yellow-500" />,
      languages: <Languages className="h-5 w-5 text-green-500" />,
      projects: <BookOpen className="h-5 w-5 text-purple-500" />,
      default: <FileText className="h-5 w-5 text-gray-500" />,
    };
    if (normalizedKey.includes("skill")) return iconMap.skills;
    if (normalizedKey.includes("experi")) return iconMap.experience;
    if (normalizedKey.includes("educat")) return iconMap.education;
    if (normalizedKey.includes("certif")) return iconMap.certifications;
    if (normalizedKey.includes("lang")) return iconMap.languages;
    if (normalizedKey.includes("proj")) return iconMap.projects;
    return iconMap[normalizedKey] || iconMap.default;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-black tracking-normal leading-tight"
          >
            Đánh giá độ phù hợp CV-JD
          </motion.h1>
          <p className="mt-2 text-lg text-gray-600">Tìm kiếm và đánh giá ứng viên phù hợp với vị trí công việc đã chọn.</p>
        </div>

        <Card className="mb-8 shadow-lg border-0 overflow-hidden rounded-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
              <Briefcase className="h-6 w-6 text-blue-600" />
              Công việc đang đánh giá
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedJob ? (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                    {selectedJob.contract && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        {selectedJob.contract}
                      </div>
                    )}
                    {selectedJob.level && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        {selectedJob.level}
                      </div>
                    )}
                    {selectedJob.jobType && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {selectedJob.jobType}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  {loading ? (
                    <Button disabled variant="outline" className="w-full md:w-auto">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Đang xử lý...
                    </Button>
                  ) : (
                    <Button
                      onClick={startMatching}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      {candidates.length > 0 ? "Đánh giá lại" : "Bắt đầu đánh giá"}
                    </Button>
                  )}
                  <p className="text-sm text-gray-500 text-center md:text-right">
                    Thời gian xử lý: ~15-30 giây
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
                <p className="text-gray-600 mb-4">
                  Chưa chọn công việc để đánh giá. Vui lòng chọn một công việc từ{" "}
                  <Button
                    variant="link"
                    className="p-0 text-blue-600 hover:text-blue-800"
                    onClick={() => navigate("/hr/jobs")}
                  >
                    Quản lý tin tuyển dụng
                  </Button>
                  .
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700"
          >
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </motion.div>
        )}

        {loading && (
          <LoadingAnimation
            step={loadingStep}
            progress={loadingProgress}
            messages={loadingMessages}
            onCancel={cancelMatching}
          />
        )}

        {candidates.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Tìm theo tên CV ID hoặc email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filterScore} onValueChange={setFilterScore}>
                  <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 rounded-lg shadow-sm">
                    <SelectValue placeholder="Lọc theo điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả điểm</SelectItem>
                    <SelectItem value="high">Phù hợp cao (85+)</SelectItem>
                    <SelectItem value="medium">Phù hợp TB (70-84)</SelectItem>
                    <SelectItem value="low">Phù hợp thấp (&lt;70)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="w-full md:w-48 bg-white border-gray-200 rounded-lg shadow-sm">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Điểm phù hợp</SelectItem>
                    <SelectItem value="name">Tên (CV ID)</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSortOrder}
                  className="bg-white border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  {sortOrder === "desc" ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronUp className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="mb-6 text-sm text-gray-600">
              Hiển thị <span className="font-medium">{filteredCandidates.length}</span> ứng viên
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {filteredCandidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl border-l-4"
                      style={{ borderLeftColor: getScoreBorderColor(candidate.matchScore) }}
                    >
                      <CardHeader className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-semibold text-gray-900">{candidate.name}</CardTitle>
                            <CardDescription className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
                              <span className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4 text-gray-500" />
                                {candidate.email}
                              </span>
                              <span className="hidden sm:inline mx-2 text-gray-400">|</span>
                              <span className="flex items-center gap-1.5">
                                <Phone className="h-4 w-4 text-gray-500" />
                                {candidate.phone}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="text-center">
                            <div className="radial-progress text-xl font-bold" style={{
                              "--value": typeof candidate.matchScore === "number" ? Math.round(candidate.matchScore) : 0,
                              "--size": "4.5rem",
                              "--thickness": "4px",
                              color: getScoreColor(candidate.matchScore),
                            }}>
                              <span className={getScoreTextColor(candidate.matchScore)}>
                                {typeof candidate.matchScore === "number" ? Math.round(candidate.matchScore) : 0}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Độ phù hợp</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                          <p className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-3">{typeof candidate.explanation === "string" ? candidate.explanation : "Không có giải thích."}</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(candidate.skills) && candidate.skills.length > 0 ? (
                            <>
                              {candidate.skills.slice(0, 4).map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100"
                                >
                                  {skill?.name || "Kỹ năng"}
                                  <span className={`w-2 h-2 rounded-full ${getMatchColor(skill?.match || "medium")}`}></span>
                                </Badge>
                              ))}
                              {candidate.skills.length > 4 && (
                                <Badge variant="outline" className="bg-gray-50 hover:bg-gray-100">
                                  +{candidate.skills.length - 4}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-gray-500">Chưa có phân tích kỹ năng.</div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(candidate.id)}
                            className="w-full sm:w-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          >
                            {expandedCandidate === candidate.id ? "Thu gọn" : "Xem chi tiết"}
                            {expandedCandidate === candidate.id ? (
                              <ChevronUp className="ml-1.5 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1.5 h-4 w-4" />
                            )}
                          </Button>
                          <div className="flex gap-3 w-full sm:w-auto">
                            <Dialog.Root>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 sm:flex-none bg-white border-gray-200 hover:bg-gray-50 rounded-lg"
                                >
                                  <Eye className="mr-1.5 h-4 w-4" />
                                  Xem CV
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-semibold">CV của {candidate.name}</DialogTitle>
                                  <DialogDescription>Điểm số phù hợp: {candidate.matchScore}%</DialogDescription>
                                </DialogHeader>
                                <ResumePreview resumeUrl={candidate.resumeUrl} candidateName={candidate.name} />
                              </DialogContent>
                            </Dialog.Root>
                            <Button
                              size="sm"
                              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                              <Mail className="mr-1.5 h-4 w-4" />
                              Liên hệ
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <AnimatePresence>
                        {expandedCandidate === candidate.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="border-t border-gray-100 pt-6 pb-8 bg-gray-50">
                              <Tabs defaultValue="evaluation" key={`tabs-${candidate.id}`}>
                                <TabsList className="mb-6 bg-white rounded-lg shadow-sm p-1">
                                  <TabsTrigger
                                    value="evaluation"
                                    className="px-4 py-2 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                  >
                                    Chi tiết đánh giá
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="skills"
                                    className="px-4 py-2 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                  >
                                    Kỹ năng
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="experience"
                                    className="px-4 py-2 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                  >
                                    Kinh nghiệm
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="education"
                                    className="px-4 py-2 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                  >
                                    Học vấn
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent value="evaluation" className="space-y-6">
                                  <div className="p-4 bg-white rounded-lg shadow-sm">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg mb-3 text-gray-900">
                                      <FileText className="h-5 w-5 text-blue-500" />
                                      Giải thích đầy đủ
                                    </h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">
                                      {typeof candidate.explanation === "string" ? candidate.explanation : "Không có giải thích."}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold flex items-center gap-2 text-lg mb-3 text-gray-900">
                                      <FileText className="h-5 w-5 text-blue-500" />
                                      Phân tích chi tiết
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {candidate.explanationDetails &&
                                        Object.keys(candidate.explanationDetails).length > 0 ? (
                                        Object.entries(candidate.explanationDetails)
                                          .filter(([key, value]) => key && typeof value === "string" && value.length > 0)
                                          .map(([key, value], idx) => (
                                            <div
                                              key={idx}
                                              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                              <div className="flex items-start gap-3">
                                                <div className="rounded-full p-2 bg-gray-100 text-gray-600">
                                                  {getExplanationIcon(key)}
                                                </div>
                                                <div>
                                                  <div className="font-medium text-gray-900 capitalize">
                                                    {key.replace(/_/g, " ")}
                                                  </div>
                                                  <p className="text-sm text-gray-600">{value}</p>
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                      ) : (
                                        <div className="col-span-2 p-6 bg-white rounded-lg shadow-sm text-center text-gray-500">
                                          Không có phân tích chi tiết.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="skills" className="space-y-6">
                                  <h3 className="font-semibold flex items-center gap-2 text-lg text-gray-900">
                                    <Code className="h-5 w-5 text-blue-500" />
                                    Đánh giá kỹ năng
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Array.isArray(candidate.skills) && candidate.skills.length > 0 ? (
                                      candidate.skills.map((skill, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                          <div className="font-medium text-gray-900">{skill?.name || "Kỹ năng"}</div>
                                          {getMatchBadge(skill?.match || "medium")}
                                        </div>
                                      ))
                                    ) : (
                                      <div className="col-span-2 p-6 bg-white rounded-lg shadow-sm text-center text-gray-500">
                                        Không có thông tin kỹ năng.
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                                <TabsContent value="experience" className="space-y-6">
                                  <h3 className="font-semibold flex items-center gap-2 text-lg text-gray-900">
                                    <Briefcase className="h-5 w-5 text-amber-500" />
                                    Đánh giá kinh nghiệm
                                  </h3>
                                  <div className="space-y-4">
                                    {Array.isArray(candidate.experience) && candidate.experience.length > 0 ? (
                                      candidate.experience.map((exp, index) => (
                                        <div
                                          key={index}
                                          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h4 className="font-medium text-gray-900">{exp?.title || "Kinh nghiệm"}</h4>
                                              <p className="text-sm text-gray-600">
                                                {exp?.company || "N/A"} {exp?.duration && `• ${exp.duration}`}
                                              </p>
                                            </div>
                                            {getMatchBadge(exp?.match || "medium")}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-6 bg-white rounded-lg shadow-sm text-center text-gray-500">
                                        Không có thông tin kinh nghiệm.
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                                <TabsContent value="education" className="space-y-6">
                                  <h3 className="font-semibold flex items-center gap-2 text-lg text-gray-900">
                                    <GraduationCap className="h-5 w-5 text-indigo-500" />
                                    Đánh giá học vấn
                                  </h3>
                                  <div className="space-y-4">
                                    {Array.isArray(candidate.education) && candidate.education.length > 0 ? (
                                      candidate.education.map((edu, index) => (
                                        <div
                                          key={index}
                                          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h4 className="font-medium text-gray-900">{edu?.degree || "Học vấn"}</h4>
                                              <p className="text-sm text-gray-600">
                                                {edu?.institution || "N/A"} {edu?.year && `• ${edu.year}`}
                                              </p>
                                            </div>
                                            {getMatchBadge(edu?.match || "medium")}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="p-6 bg-white rounded-lg shadow-sm text-center text-gray-500">
                                        Không có thông tin học vấn.
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredCandidates.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 bg-white rounded-2xl shadow-sm text-center text-gray-600"
              >
                Không tìm thấy ứng viên phù hợp với bộ lọc hiện tại.
              </motion.div>
            )}
          </motion.div>
        )}

        {!candidates.length && !loading && !error && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-16 bg-white rounded-2xl shadow-sm text-center"
          >
            <FileSearchOutlined className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Chưa có kết quả đánh giá</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Nhấn nút "Bắt đầu đánh giá" để hệ thống tự động phân tích và đánh giá CV.
            </p>
          </motion.div>
        )}

        {!candidates.length && loading && loadingStep < 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-3">
                <div className="h-8 w-36 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-36 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <CandidateSkeleton key={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const CandidateSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white shadow-md rounded-2xl border-l-4 border-l-gray-200 animate-pulse">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="flex gap-3">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingAnimation = ({ step, progress, messages, onCancel }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 bg-white rounded-2xl shadow-lg max-w-lg mx-auto"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
        <span className="text-lg font-semibold text-gray-900">Đang xử lý {progress}%</span>
        <span className="text-sm text-gray-500">({elapsedTime}s)</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="space-y-3 mb-6">
        {messages.map((item, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg ${step === index
              ? "bg-blue-50 border border-blue-200"
              : item.completed
                ? "bg-gray-50"
                : "bg-gray-50 opacity-50"
              }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : step === index ? (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}
            <span className={step === index ? "font-medium text-gray-900" : "text-gray-600"}>{item.message}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 rounded-lg"
        >
          <XCircle className="h-4 w-4 text-red-500" />
          Hủy quá trình
        </Button>
        <p className="text-sm text-gray-500">Thời gian xử lý: ~15-20 giây</p>
      </div>
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-700 flex items-center justify-center gap-2"
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Đang đánh giá mức độ phù hợp...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

const DialogTrigger = Dialog.Trigger;
const DialogContent = React.forwardRef(({ children, className, ...props }, ref) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200" />
    <Dialog.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] bg-white p-8 rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 ${className || ""}`}
      {...props}
    >
      {children}
      <Dialog.Close className="absolute right-6 top-6 rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors">
        <XCircle className="h-5 w-5 text-gray-600" />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-2 text-left ${className || ""}`} {...props} />
);

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={`text-2xl font-semibold text-gray-900 ${className || ""}`}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={`text-sm text-gray-600 ${className || ""}`}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

function getScoreColor(score) {
  if (typeof score !== "number" || isNaN(score)) return "#f59e0b";
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}

function getScoreTextColor(score) {
  if (typeof score !== "number" || isNaN(score)) return "text-amber-600";
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
}

function getScoreBorderColor(score) {
  if (typeof score !== "number" || isNaN(score)) return "#f59e0b";
  if (score >= 85) return "#10b981";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}

function getMatchColor(match) {
  const matchLower = typeof match === "string" ? match.toLowerCase() : "medium";
  switch (matchLower) {
    case "high":
      return "bg-green-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-red-500";
    default:
      return "bg-amber-500";
  }
}

function FileSearchOutlined({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <circle cx="11.5" cy="14.5" r="2.5"></circle>
      <path d="M13.25 16.25L15 18"></path>
      <path d="M6 9h12"></path>
    </svg>
  );
}

const ResumePreview = ({ resumeUrl, candidateName }) => {
  const [previewLoading, setPreviewLoading] = useState(true);

  return (
    <div className="mt-6 relative">
      {previewLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10"
        >
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Đang tải bản xem trước CV...</p>
        </motion.div>
      )}
      <iframe
        src={resumeUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=resume"}
        className="w-full h-[70vh] border border-gray-200 rounded-lg"
        title={`CV của ${candidateName}`}
        onLoad={() => setPreviewLoading(false)}
      />
    </div>
  );
};

const style = document.createElement("style");
style.textContent = `
  .radial-progress {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    border-radius: 9999px;
  }
  .radial-progress::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: conic-gradient(var(--color) calc(var(--value) * 1%), #e5e7eb 0);
    mask: radial-gradient(farthest-side, transparent calc(100% - var(--thickness)), #fff 0);
  }
`;
document.head.appendChild(style);

export default CVMatchingPage;