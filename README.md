# 📚 theBugs - Book E-Commerce Platform

> 🎓 **Graduation Project** - A specialized e-commerce platform for buying and selling books with seller identity verification (eKYC), intelligent product, and order management.

---

## 🧾 Overview

**theBugs** is a specialized e-commerce platform designed for **book trading**, where users can easily search, order, and sellers can list their products after undergoing identity verification (face + ID card). 

This project simulates a real-world system with features like verification, role-based access control, order management, and revenue reporting.

---

## ⚙️ Technology Stack

| Component       | Technology                          |
|------------------|-------------------------------------|
| **Backend**      | Spring Boot, Spring Security, Hibernate (JPA), MySQL |
| **Frontend**     | ReactJS, TailwindCSS               |
| **eKYC**         | [FPT.AI eKYC API](https://fpt.ai/vision/ekyc) |
| **Others**       | Lombok, Git, Docker, GitHub Actions |

---

## 🔑 Key Features

### 👥 **For Users**
- Register / Login
- Browse books and search by categories
- Add books to cart and place orders
- Track order status
- Write reviews and rate books

### 🛍️ **For Sellers**
- **4-Step Registration Process**:
  1. Create an account
  2. Verify identity (face + ID card) via FPT.AI eKYC
  3. Add store information
  4. Update address and bank account details
- **Manage Books**
- **Manage Orders**
- **Manage Store**
- **Promotions Management**
- **Analytics**
  - View sales reports
  - Track best-selling products

### 🔧 **For Admins**
- Manage users and sellers
- Approve seller verification requests
- Oversee categories, books, and orders across the platform
- Generate system-wide reports

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### 1. Prerequisites
Ensure the following are installed on your system:
- **Java 11+**
- **Maven**
- **MySQL**
- **Node.js** (for the frontend)

### 2. Clone the Repository
Clone the project to your local machine:
```bash
git clone https://github.com/icrRick/theBugs_book_ecommerce.git
cd theBugs_book_ecommerce
```

### 3. Configure the Database
Set up a MySQL database and update the connection details in the `application.properties` file:
```properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/thebugs_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 4. Build and Run the Backend
Build and start the backend server:
```bash
./mvnw clean install
./mvnw spring-boot:run
```

The backend will be accessible at `http://localhost:8080`.

### 5. Run the Frontend
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm start
```

The frontend will be accessible at `http://localhost:3000`.

---

## 📊 Roadmap

- [ ] Add more payment gateway options
- [ ] Enhance seller analytics with real-time data
- [ ] Integrate AI-based book recommendations
- [ ] Improve mobile responsiveness for frontend

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## ✨ Acknowledgments

- **[FPT.AI](https://fpt.ai/)** for providing the eKYC API
- Special thanks to our mentors, teammates, and the open-source community for their support.
