
const SellerInfoStep = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
      <p className="text-gray-600 mb-6">
        Vui lòng cung cấp thông tin cá nhân chính xác để chúng tôi có thể xác minh danh tính của bạn.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Họ tên */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập họ và tên"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0912345678"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Ngày sinh */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dob ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
        </div>

        {/* Giới tính */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Giới tính <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin giấy tờ tùy thân</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loại giấy tờ */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Loại giấy tờ <span className="text-red-500">*</span>
            </label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.idType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="cccd">Căn cước công dân</option>
              <option value="cmnd">Chứng minh nhân dân</option>
              <option value="passport">Hộ chiếu</option>
            </select>
            {errors.idType && <p className="text-red-500 text-sm mt-1">{errors.idType}</p>}
          </div>

          {/* Số giấy tờ */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Số CCCD/CMND/Hộ chiếu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.idNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập số giấy tờ"
            />
            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
          </div>

          {/* Ngày cấp */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Ngày cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="idIssueDate"
              value={formData.idIssueDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.idIssueDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.idIssueDate && <p className="text-red-500 text-sm mt-1">{errors.idIssueDate}</p>}
          </div>

          {/* Nơi cấp */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nơi cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="idIssuedBy"
              value={formData.idIssuedBy}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.idIssuedBy ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Cục Cảnh sát ĐKQL Cư trú và DLQG về dân cư"
            />
            {errors.idIssuedBy && <p className="text-red-500 text-sm mt-1">{errors.idIssuedBy}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin tài khoản ngân hàng</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên ngân hàng */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tên ngân hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bankName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ví dụ: Vietcombank, Techcombank..."
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          {/* Số tài khoản */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Số tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bankAccount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập số tài khoản ngân hàng"
            />
            {errors.bankAccount && <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>}
          </div>

          {/* Tên chủ tài khoản */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Tên chủ tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankAccountName"
              value={formData.bankAccountName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bankAccountName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên chủ tài khoản"
            />
            {errors.bankAccountName && <p className="text-red-500 text-sm mt-1">{errors.bankAccountName}</p>}
            <p className="text-gray-500 text-sm mt-1">Lưu ý: Tên chủ tài khoản phải trùng với tên đăng ký</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerInfoStep;

