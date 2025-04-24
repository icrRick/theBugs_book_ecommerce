package com.thebugs.back_end.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductDetailDTO {
        private Integer productId; // ID sản phẩm
        private String productName;
        private String product_code; // Mã sản phẩm
        private Double price; // Giá gốc
        private Double discountedPrice; // Giá sau giảm giá
        private Double discountPercentage; // Phần trăm giảm giá
        private Double weight; // Trọng lượng
        private LocalDate createdAt;
        private String description;
        private Double rate; // Điểm đánh giá trung bình
        private Integer reviewCount; // Số lượng đánh giá
        private Integer soldQuantity; // Số lượng đã bán
        private Integer stockQuantity; // Số lượng còn trong kho
        private String publisher; // Nhà xuất bản
        private List<String> authorNames; // Danh sách tác giả
        private List<String> genres; // Danh sách thể loại
        private List<String> images; // Danh sách tên hình ảnh
        private ShopDTO shop; // Thêm trường shop

        // Constructor cho JPQL
        public ProductDetailDTO(Integer productId, String productName, String product_code, Double price,
                        Double discountedPrice, Double discountPercentage, Double weight, LocalDate createdAt,
                        String description, Double rate, Integer reviewCount, Integer soldQuantity,
                        Integer stockQuantity, String publisher) {
                this.productId = productId;
                this.productName = productName;
                this.product_code = product_code;
                this.price = price;
                this.discountedPrice = discountedPrice;
                this.discountPercentage = discountPercentage;
                this.weight = weight;
                this.createdAt = createdAt;
                this.description = description;
                this.rate = rate;
                this.reviewCount = reviewCount;
                this.soldQuantity = soldQuantity;
                this.stockQuantity = stockQuantity;
                this.publisher = publisher;
        }

        // Lớp lồng ghép ShopDTO
        @Data
        @NoArgsConstructor
        public static class ShopDTO {
                private Integer id;
                private String logo;
                private String name;
                private Boolean verify;

                // Constructor cho JPQL
                public ShopDTO(Integer id, String logo, String name, Boolean verify) {
                        this.id = id;
                        this.logo = logo;
                        this.name = name;
                        this.verify = verify;
                }
        }
}