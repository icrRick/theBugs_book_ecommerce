# 📚 theBugs – Book E-Commerce Platform

> 🎓 **Graduation Project** – Nền tảng thương mại điện tử chuyên biệt cho việc mua bán sách, tích hợp xác minh danh tính người bán (eKYC), quản lý sản phẩm và đơn hàng thông minh.

---

## 🧭 Tổng quan

**theBugs** là một nền tảng thương mại điện tử chuyên biệt cho việc giao dịch sách, nơi người dùng có thể dễ dàng tìm kiếm, đặt hàng và người bán có thể đăng bán sản phẩm sau khi hoàn tất xác minh danh tính (khuôn mặt + CMND/CCCD).

Dự án mô phỏng một hệ thống thực tế với các tính năng như xác minh, phân quyền truy cập dựa trên vai trò, quản lý đơn hàng và báo cáo doanh thu.

---

## ⚙️ Công nghệ sử dụng

| Thành phần      | Công nghệ                               |
|-----------------|------------------------------------------|
| **Backend**     | Spring Boot, Spring Security, Hibernate (JPA), MySQL |
| **Frontend**    | ReactJS, TailwindCSS                     |
| **eKYC**        | [FPT.AI eKYC API](https://fpt.ai)        |
| **Khác**        | Lombok, Git, Docker, GitHub Actions      |

---

## 🌟 Tính năng chính

### 👤 Dành cho người dùng

- Đăng ký / Đăng nhập
- Duyệt và tìm kiếm sách
- Đặt hàng và theo dõi đơn hàng
- Quản lý thông tin cá nhân

### 🛍️ Dành cho người bán

- Đăng ký tài khoản người bán
- Xác minh danh tính qua eKYC (khuôn mặt + CMND/CCCD)
- Quản lý sản phẩm: thêm, sửa, xóa
- Xem và xử lý đơn hàng
- Xem báo cáo doanh thu

### 🛡️ Dành cho quản trị viên

- Quản lý người dùng và người bán
- Duyệt và xác minh người bán
- Quản lý danh mục sách
- Xem báo cáo tổng quan

