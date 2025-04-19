# 📚 theBugs - Book E-Commerce Platform

> 🎓 Dự án tốt nghiệp - Sàn thương mại điện tử mua bán sách trực tuyến, có xác minh danh tính người bán (eKYC), quản lý đơn hàng và sản phẩm thông minh.

---

## 🧾 Giới thiệu

**theBugs** là một nền tảng thương mại điện tử chuyên biệt dành cho việc **mua bán sách**, nơi người dùng có thể dễ dàng tìm kiếm, đặt mua và người bán có thể đăng bán sản phẩm sau khi được xác minh danh tính (khuôn mặt + CCCD).

Dự án giúp mô phỏng một hệ thống thực tế với quy trình xác minh, phân quyền, quản lý đơn hàng và báo cáo doanh thu.

---

## ⚙️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|-----------|-----------|
| Backend   | Spring Boot, Spring Security, Hibernate (JPA), MySQL |
| Frontend  | AngularJS / Thymeleaf |
| Xác minh eKYC | [FPT.AI eKYC API](https://fpt.ai/vision/ekyc) |
| Khác      | Lombok, Git, Docker (tùy chọn), GitHub Actions |

---

## 🔑 Chức năng nổi bật

### 👥 Người dùng
- Đăng ký / Đăng nhập
- Duyệt sách, tìm kiếm theo danh mục
- Thêm vào giỏ hàng và đặt mua
- Theo dõi đơn hàng
- ..........

### 🛍️ Người bán
- Đăng ký 4 bước:
  1. Tạo tài khoản
  2. Xác minh khuôn mặt + CCCD (qua FPT.AI eKYC)
  3. Thêm thông tin cửa hàng
  4. Cập nhật địa chỉ + tài khoản ngân hàng
- Quản lý sách
  + CRUD
  + Xem sách bị báo cáo.
  + Xem đánh giá và phản hồi
- Quản lý đơn hàng
  + Xem đơn hàng
  + Xác nhận đơn hàng
- Quản lý cửa hàng
  + Xem/ sửa thông tin cửa hàng
  + Xem báo cáo bị tố cáo
- Quản lý khuyến mãi
  + Quản lý voucher: CRUD
  + Quản lý khuyến mãi sản phẩm: CRUD
- Xem thống kê doanh thu, sản phẩm

### 🔧 Quản trị viên
- Quản lý người dùng và người bán
- Duyệt yêu cầu xác minh người bán
- Quản lý danh mục, sách, đơn hàng toàn hệ thống

---

## 🚀 Hướng dẫn chạy dự án

### 1. Clone và cấu hình

```bash
git clone https://github.com/icrRick/theBugs_book_ecommerce.git
cd theBugs_book_ecommerce

# Build project
./mvnw clean install

# Run application
./mvnw spring-boot:run
