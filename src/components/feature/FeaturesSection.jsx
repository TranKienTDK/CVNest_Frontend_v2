import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import {
  Users as UsersIcon,
  FileText as FileTextIcon,
  Briefcase as BriefcaseIcon,
  LineChart as LineChartIcon,
  MessageSquare as MessageSquareIcon,
  Calendar as CalendarIcon,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
export function FeaturesSection() {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <UsersIcon size={24} className="text-blue-600" />,
      title: 'Quản lý ứng viên',
      description:
        'Dễ dàng tìm kiếm, lọc và theo dõi tiến trình của từng ứng viên trong quy trình tuyển dụng.',
      route: ROUTES.HR_APPLICATIONS
    },
    {
      icon: <FileTextIcon size={24} className="text-blue-600" />,
      title: 'Đánh giá CV',
      description:
        'Công cụ thông minh giúp đánh giá nhanh chóng và chính xác các CV dựa trên yêu cầu công việc.',
      route: ROUTES.CV_EVALUATE
    },
    {
      icon: <BriefcaseIcon size={24} className="text-blue-600" />,
      title: 'Quản lý tin tuyển dụng',
      description:
        'Tạo và quản lý tin tuyển dụng chuyên nghiệp, thu hút ứng viên tiềm năng.',
      route: ROUTES.HR_JOBS
    },    {
      icon: <LineChartIcon size={24} className="text-blue-600" />,
      title: 'Báo cáo & Phân tích',
      description:
        'Theo dõi hiệu quả tuyển dụng với các báo cáo chi tiết và biểu đồ trực quan.',
      route: ROUTES.HR_APPLICATIONS,
    },
    {
      icon: <MessageSquareIcon size={24} className="text-blue-600" />,
      title: 'Giao tiếp đa kênh',
      description:
        'Tương tác với ứng viên qua email, tin nhắn và cuộc gọi ngay trong hệ thống.',
      route: ROUTES.HR_APPLICATIONS,
    },
    {
      icon: <CalendarIcon size={24} className="text-blue-600" />,
      title: 'Lịch phỏng vấn',
      description:
        'Quản lý lịch phỏng vấn và tự động gửi thông báo cho các bên liên quan.',
      route: ROUTES.HR_APPLICATIONS,
    },
  ]
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tối ưu quy trình tuyển dụng
          </h2>
          <p className="text-lg text-gray-600">
            Hệ thống cung cấp đầy đủ công cụ giúp nhà tuyển dụng tìm kiếm, đánh
            giá và tuyển dụng nhân tài hiệu quả.
          </p>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => feature.route && navigate(feature.route)}
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}</div>
        <div className="mt-16 text-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition-colors font-medium"
            onClick={() => navigate(ROUTES.HR_JOBS)}
          >
            Khám phá tất cả tính năng
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}