"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Dữ liệu mẫu cho cài đặt hệ thống
const sampleSettings = {
  general: {
    siteName: "BookStore - Sàn thương mại điện tử sách",
    siteDescription: "Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam",
    adminEmail: "admin@bookstore.com",
    supportEmail: "support@bookstore.com",
    contactPhone: "1900 1234",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "VND",
    currencySymbol: "₫",
    maintenanceMode: false,
  },
  payment: {
    paymentMethods: [
      { id: "cod", name: "Thanh toán khi nhận hàng", enabled: true },
      { id: "bank_transfer", name: "Chuyển khoản ngân hàng", enabled: true },
      { id: "momo", name: "Ví MoMo", enabled: true },
      { id: "zalopay", name: "ZaloPay", enabled: true },
      { id: "vnpay", name: "VNPay", enabled: true },
      { id: "paypal", name: "PayPal", enabled: false },
    ],
    bankAccounts: [
      {
        bank: "Vietcombank",
        accountNumber: "1234567890",
        accountName: "CONG TY TNHH BOOKSTORE",
        branch: "Hồ Chí Minh",
      },
      { bank: "Techcombank", accountNumber: "0987654321", accountName: "CONG TY TNHH BOOKSTORE", branch: "Hà Nội" },
    ],
    paymentFee: 0,
    minOrderValue: 0,
  },
  shipping: {
    shippingMethods: [
      { id: "standard", name: "Giao hàng tiêu chuẩn", enabled: true },
      { id: "express", name: "Giao hàng nhanh", enabled: true },
      { id: "same_day", name: "Giao hàng trong ngày", enabled: true },
    ],
    freeShippingThreshold: 200000,
    defaultShippingFee: 30000,
    shippingPartners: [
      { id: "ghn", name: "Giao hàng nhanh", enabled: true },
      { id: "ghtk", name: "Giao hàng tiết kiệm", enabled: true },
      { id: "viettelpost", name: "Viettel Post", enabled: true },
      { id: "jnt", name: "J&T Express", enabled: false },
    ],
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "noreply@bookstore.com",
    smtpPassword: "********",
    smtpEncryption: "tls",
    emailTemplates: [
      { id: "welcome", name: "Chào mừng thành viên mới", enabled: true },
      { id: "order_confirmation", name: "Xác nhận đơn hàng", enabled: true },
      { id: "shipping_confirmation", name: "Xác nhận giao hàng", enabled: true },
      { id: "order_completed", name: "Đơn hàng hoàn thành", enabled: true },
      { id: "password_reset", name: "Đặt lại mật khẩu", enabled: true },
    ],
  },
  security: {
    loginAttempts: 5,
    lockoutTime: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    twoFactorAuth: false,
    sessionTimeout: 60,
    allowedIPs: [],
    blockedIPs: [],
  },
  commission: {
    commissionRate: 10,
    commissionType: "percentage",
    minCommission: 1000,
    maxCommission: 1000000,
    payoutSchedule: "monthly",
    payoutThreshold: 100000,
  },
}

const SystemSettings = () => {
  const [settings, setSettings] = useState(sampleSettings)
  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy cài đặt hệ thống ở đây
    setLoading(true)
    setTimeout(() => {
      setSettings(sampleSettings)
      setLoading(false)
    }, 500)
  }, [])

  const handleInputChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  const handleNestedInputChange = (section, nestedSection, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [nestedSection]: {
          ...settings[section][nestedSection],
          [field]: value,
        },
      },
    })
  }

  const handleArrayItemChange = (section, arrayName, index, field, value) => {
    const newArray = [...settings[section][arrayName]]
    newArray[index] = { ...newArray[index], [field]: value }

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [arrayName]: newArray,
      },
    })
  }

  const handleSaveSettings = () => {
    setSaveLoading(true)
    // Trong thực tế, bạn sẽ gọi API để lưu cài đặt hệ thống ở đây
    setTimeout(() => {
      toast.success("Lưu cài đặt hệ thống thành công!")
      setSaveLoading(false)
    }, 1000)
  }

  const renderGeneralSettings = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên trang web</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.siteName}
              onChange={(e) => handleInputChange("general", "siteName", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả trang web</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.siteDescription}
              onChange={(e) => handleInputChange("general", "siteDescription", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email quản trị</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.adminEmail}
              onChange={(e) => handleInputChange("general", "adminEmail", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email hỗ trợ</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.supportEmail}
              onChange={(e) => handleInputChange("general", "supportEmail", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại liên hệ</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.contactPhone}
              onChange={(e) => handleInputChange("general", "contactPhone", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Múi giờ</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.timezone}
              onChange={(e) => handleInputChange("general", "timezone", e.target.value)}
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
              <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Định dạng ngày</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.dateFormat}
              onChange={(e) => handleInputChange("general", "dateFormat", e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Định dạng thời gian</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.timeFormat}
              onChange={(e) => handleInputChange("general", "timeFormat", e.target.value)}
            >
              <option value="24h">24h</option>
              <option value="12h">12h (AM/PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tiền tệ</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.general.currency}
              onChange={(e) => handleInputChange("general", "currency", e.target.value)}
            >
              <option value="VND">VND (Việt Nam Đồng)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={settings.general.maintenanceMode}
            onChange={(e) => handleInputChange("general", "maintenanceMode", e.target.checked)}
          />
          <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
            Bật chế độ bảo trì
          </label>
        </div>
      </div>
    )
  }

  const renderPaymentSettings = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Phương thức thanh toán</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {settings.payment.paymentMethods.map((method, index) => (
              <div
                key={method.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`payment-${method.id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={method.enabled}
                    onChange={(e) =>
                      handleArrayItemChange("payment", "paymentMethods", index, "enabled", e.target.checked)
                    }
                  />
                  <label htmlFor={`payment-${method.id}`} className="ml-2 block text-sm text-gray-700">
                    {method.name}
                  </label>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">Cấu hình</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Tài khoản ngân hàng</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {settings.payment.bankAccounts.map((account, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngân hàng</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={account.bank}
                      onChange={(e) => handleArrayItemChange("payment", "bankAccounts", index, "bank", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chi nhánh</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={account.branch}
                      onChange={(e) =>
                        handleArrayItemChange("payment", "bankAccounts", index, "branch", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={account.accountNumber}
                      onChange={(e) =>
                        handleArrayItemChange("payment", "bankAccounts", index, "accountNumber", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài khoản</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={account.accountName}
                      onChange={(e) =>
                        handleArrayItemChange("payment", "bankAccounts", index, "accountName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button className="text-sm text-red-600 hover:text-red-800">Xóa</button>
                </div>
              </div>
            ))}
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              Thêm tài khoản ngân hàng
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí thanh toán (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.payment.paymentFee}
              onChange={(e) => handleInputChange("payment", "paymentFee", Number.parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị đơn hàng tối thiểu (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.payment.minOrderValue}
              onChange={(e) => handleInputChange("payment", "minOrderValue", Number.parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderShippingSettings = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Phương thức vận chuyển</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {settings.shipping.shippingMethods.map((method, index) => (
              <div
                key={method.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`shipping-${method.id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={method.enabled}
                    onChange={(e) =>
                      handleArrayItemChange("shipping", "shippingMethods", index, "enabled", e.target.checked)
                    }
                  />
                  <label htmlFor={`shipping-${method.id}`} className="ml-2 block text-sm text-gray-700">
                    {method.name}
                  </label>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">Cấu hình</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Đối tác vận chuyển</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {settings.shipping.shippingPartners.map((partner, index) => (
              <div
                key={partner.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`partner-${partner.id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={partner.enabled}
                    onChange={(e) =>
                      handleArrayItemChange("shipping", "shippingPartners", index, "enabled", e.target.checked)
                    }
                  />
                  <label htmlFor={`partner-${partner.id}`} className="ml-2 block text-sm text-gray-700">
                    {partner.name}
                  </label>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">Cấu hình API</button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngưỡng miễn phí vận chuyển (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.shipping.freeShippingThreshold}
              onChange={(e) => handleInputChange("shipping", "freeShippingThreshold", Number.parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí vận chuyển mặc định (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.shipping.defaultShippingFee}
              onChange={(e) => handleInputChange("shipping", "defaultShippingFee", Number.parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderEmailSettings = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.email.smtpHost}
              onChange={(e) => handleInputChange("email", "smtpHost", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.email.smtpPort}
              onChange={(e) => handleInputChange("email", "smtpPort", Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.email.smtpUsername}
              onChange={(e) => handleInputChange("email", "smtpUsername", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.email.smtpPassword}
              onChange={(e) => handleInputChange("email", "smtpPassword", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Encryption</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.email.smtpEncryption}
            onChange={(e) => handleInputChange("email", "smtpEncryption", e.target.value)}
          >
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
            <option value="none">None</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Mẫu email</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {settings.email.emailTemplates.map((template, index) => (
              <div
                key={template.id}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`template-${template.id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={template.enabled}
                    onChange={(e) =>
                      handleArrayItemChange("email", "emailTemplates", index, "enabled", e.target.checked)
                    }
                  />
                  <label htmlFor={`template-${template.id}`} className="ml-2 block text-sm text-gray-700">
                    {template.name}
                  </label>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800">Chỉnh sửa</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
            Gửi email kiểm tra
          </button>
        </div>
      </div>
    )
  }

  const renderSecuritySettings = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lần đăng nhập sai tối đa</label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.security.loginAttempts}
              onChange={(e) => handleInputChange("security", "loginAttempts", Number.parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian khóa tài khoản (phút)</label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.security.lockoutTime}
              onChange={(e) => handleInputChange("security", "lockoutTime", Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Chính sách mật khẩu</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ dài tối thiểu</label>
                <input
                  type="number"
                  min="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.security.passwordPolicy.minLength}
                  onChange={(e) =>
                    handleNestedInputChange("security", "passwordPolicy", "minLength", Number.parseInt(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireUppercase"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.security.passwordPolicy.requireUppercase}
                    onChange={(e) =>
                      handleNestedInputChange("security", "passwordPolicy", "requireUppercase", e.target.checked)
                    }
                  />
                  <label htmlFor="requireUppercase" className="ml-2 block text-sm text-gray-700">
                    Yêu cầu chữ hoa
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireLowercase"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.security.passwordPolicy.requireLowercase}
                    onChange={(e) =>
                      handleNestedInputChange("security", "passwordPolicy", "requireLowercase", e.target.checked)
                    }
                  />
                  <label htmlFor="requireLowercase" className="ml-2 block text-sm text-gray-700">
                    Yêu cầu chữ thường
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireNumbers"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.security.passwordPolicy.requireNumbers}
                    onChange={(e) =>
                      handleNestedInputChange("security", "passwordPolicy", "requireNumbers", e.target.checked)
                    }
                  />
                  <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-700">
                    Yêu cầu số
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireSpecialChars"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={settings.security.passwordPolicy.requireSpecialChars}
                    onChange={(e) =>
                      handleNestedInputChange("security", "passwordPolicy", "requireSpecialChars", e.target.checked)
                    }
                  />
                  <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-700">
                    Yêu cầu ký tự đặc biệt
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian hết hạn phiên (phút)</label>
            <input
              type="number"
              min="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center pt-7">
            <input
              type="checkbox"
              id="twoFactorAuth"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleInputChange("security", "twoFactorAuth", e.target.checked)}
            />
            <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
              Bật xác thực hai yếu tố
            </label>
          </div>
        </div>
      </div>
    )
  }

  const renderCommissionSettings = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tỷ lệ hoa hồng (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.commission.commissionRate}
              onChange={(e) => handleInputChange("commission", "commissionRate", Number.parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại hoa hồng</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.commission.commissionType}
              onChange={(e) => handleInputChange("commission", "commissionType", e.target.value)}
            >
              <option value="percentage">Phần trăm</option>
              <option value="fixed">Cố định</option>
              <option value="tiered">Theo bậc</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hoa hồng tối thiểu (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.commission.minCommission}
              onChange={(e) => handleInputChange("commission", "minCommission", Number.parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hoa hồng tối đa (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.commission.maxCommission}
              onChange={(e) => handleInputChange("commission", "maxCommission", Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lịch thanh toán</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.commission.payoutSchedule}
              onChange={(e) => handleInputChange("commission", "payoutSchedule", e.target.value)}
            >
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="biweekly">Hai tuần một lần</option>
              <option value="monthly">Hàng tháng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngưỡng thanh toán (VNĐ)</label>
            <input
              type="number"
              min="0"
              step="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.commission.payoutThreshold}
              onChange={(e) => handleInputChange("commission", "payoutThreshold", Number.parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center mt-4 md:mt-0"
          onClick={handleSaveSettings}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang lưu...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lưu cài đặt
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "general" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("general")}
            >
              Tổng quan
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "payment" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("payment")}
            >
              Thanh toán
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "shipping" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("shipping")}
            >
              Vận chuyển
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "email" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("email")}
            >
              Email
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "security" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("security")}
            >
              Bảo mật
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "commission" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("commission")}
            >
              Hoa hồng
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <>
              {activeTab === "general" && renderGeneralSettings()}
              {activeTab === "payment" && renderPaymentSettings()}
              {activeTab === "shipping" && renderShippingSettings()}
              {activeTab === "email" && renderEmailSettings()}
              {activeTab === "security" && renderSecuritySettings()}
              {activeTab === "commission" && renderCommissionSettings()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings

