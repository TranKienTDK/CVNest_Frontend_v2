import React from 'react'
export function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Kết quả đáng kinh ngạc
          </h2>
          <p className="text-lg text-gray-600">
            Hàng nghìn doanh nghiệp đã tin tưởng và sử dụng hệ thống của chúng
            tôi để tìm kiếm nhân tài.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
              5,000+
            </div>
            <p className="text-gray-600">Doanh nghiệp</p>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
              1.2M+
            </div>
            <p className="text-gray-600">Ứng viên</p>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
              85%
            </div>
            <p className="text-gray-600">Tỷ lệ tuyển dụng thành công</p>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
              70%
            </div>
            <p className="text-gray-600">Tiết kiệm thời gian</p>
          </div>
        </div>
        <div className="mt-16 relative overflow-hidden rounded-xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=3387&auto=format&fit=crop"
            alt="Team working together"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-700/80 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Trở thành đối tác của chúng tôi
              </h3>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Tham gia mạng lưới doanh nghiệp và tiếp cận với nguồn nhân lực
                chất lượng cao.
              </p>
              <button className="bg-white text-blue-600 hover:bg-blue-50 py-3 px-8 rounded-md transition-colors font-medium">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}