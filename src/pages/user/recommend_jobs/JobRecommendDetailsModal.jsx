import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  User,
  FileText,
  Target,
} from "lucide-react";

const JobRecommendDetailsModal = ({ isOpen, onClose, recommendDetails, loading }) => {
  if (!isOpen) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreText = (score) => {
    if (score >= 80) return "Rất phù hợp";
    if (score >= 60) return "Phù hợp";
    if (score >= 40) return "Tương đối phù hợp";
    return "Ít phù hợp";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 overflow-hidden"
      >
        <Card className="bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Chi tiết đánh giá việc làm
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Phân tích độ phù hợp giữa CV và công việc
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang phân tích độ phù hợp...</p>
                </div>
              </div>
            ) : recommendDetails ? (
              <div className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreColor(recommendDetails.overallScore)} border-4 border-current/20 mb-4`}>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {Math.round(recommendDetails.overallScore)}
                      </div>
                      <div className="text-xs font-medium">điểm</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {getScoreText(recommendDetails.overallScore)}
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Dựa trên phân tích so sánh giữa kỹ năng trong CV của bạn và yêu cầu công việc
                  </p>
                </div>

                {/* Skills Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Matched Skills */}
                  <Card className="p-6 border-green-200 bg-green-50/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">
                          Kỹ năng phù hợp
                        </h4>
                        <p className="text-sm text-green-700">
                          {recommendDetails.matchedSkills?.length || 0} kỹ năng
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recommendDetails.matchedSkills?.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  {/* Missing Skills */}
                  <Card className="p-6 border-orange-200 bg-orange-50/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-900">
                          Kỹ năng cần bổ sung
                        </h4>
                        <p className="text-sm text-orange-700">
                          {recommendDetails.missingSkills?.length || 0} kỹ năng
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recommendDetails.missingSkills?.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Recommendation Reason */}
                <Card className="p-6 border-blue-200 bg-blue-50/30">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Phân tích chi tiết
                      </h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {recommendDetails.recommendationReason}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Ngày phân tích</p>
                      <p className="font-medium text-gray-900">
                        {new Date(recommendDetails.createdDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">CV ID</p>
                      <p className="font-medium text-gray-900 text-xs">
                        {recommendDetails.cvId?.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Star className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Mức độ khuyến nghị</p>
                      <p className="font-medium text-gray-900">
                        {recommendDetails.overallScore >= 70 ? "Cao" : 
                         recommendDetails.overallScore >= 50 ? "Trung bình" : "Thấp"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không thể tải dữ liệu
                  </h3>
                  <p className="text-gray-600">
                    Đã xảy ra lỗi khi phân tích độ phù hợp
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {recommendDetails && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Phân tích được tạo tự động dựa trên AI
                </p>
                <Button onClick={onClose} variant="outline">
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default JobRecommendDetailsModal;
