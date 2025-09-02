import React from 'react'
import { Link } from 'react-router-dom'
import cvnestLogo from '../../assets/CVNest_logo.jpg'
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Linkedin as LinkedinIcon,
  Youtube as YoutubeIcon,
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={cvnestLogo} alt="CVNest Logo" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold text-white">
                CV<span className="text-blue-400">Nest</span>
              </h1>
            </div>
            <p className="mb-4 text-gray-400">
              Hệ thống hỗ trợ tạo CV và tìm kiếm việc làm hàng đầu Việt Nam, kết
              nối doanh nghiệp với nhân tài.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors"
              >
                <TwitterIcon size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Doanh nghiệp
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/hr-jobs" className="hover:text-blue-400 transition-colors">
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/hr-applications" className="hover:text-blue-400 transition-colors">
                  Tìm kiếm ứng viên
                </Link>
              </li>
              <li>
                <Link to="/hr-applications" className="hover:text-blue-400 transition-colors">
                  Quản lý tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/hr-applications" className="hover:text-blue-400 transition-colors">
                  Báo cáo & Phân tích
                </Link>
              </li>
              <li>
                <Link to="/hr-home" className="hover:text-blue-400 transition-colors">
                  Giải pháp doanh nghiệp
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Ứng viên</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/my-cv" className="hover:text-blue-400 transition-colors">
                  Tạo CV online
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link to="/my-cv" className="hover:text-blue-400 transition-colors">
                  Cải thiện hồ sơ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-400 transition-colors">
                  Khóa học kỹ năng
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-400 transition-colors">
                  Cẩm nang nghề nghiệp
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-blue-400 transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-400 transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} CVNest. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-blue-400 transition-colors text-sm"
            >
              Chính sách bảo mật
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-blue-400 transition-colors text-sm"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              to="/sitemap"
              className="text-gray-500 hover:text-blue-400 transition-colors text-sm"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;