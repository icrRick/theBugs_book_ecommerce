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
        private Boolean hasFlashSale; // Sản phẩm có tham gia flash sale hay không
        private Integer flashSaleQuantity; // Tổng số lượng trong flash sale
        private Integer flashSaleSold; // Số lượng đã bán trong flash sale

        // Constructor cho JPQL
        public ProductDetailDTO(Integer productId, String productName, String product_code, Double price,
                        Double discountedPrice, Double discountPercentage, Double weight, LocalDate createdAt,
                        String description, Double rate, Integer reviewCount, Integer soldQuantity,
                        Integer stockQuantity, String publisher, Boolean hasFlashSale, Integer flashSaleQuantity,
                        Integer flashSaleSold) {
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
                this.hasFlashSale = hasFlashSale;
                this.flashSaleQuantity = flashSaleQuantity;
                this.flashSaleSold = flashSaleSold;
        }

        // Lớp lồng ghép ShopDTO
        @Data
        @NoArgsConstructor
        public static class ShopDTO {
                private Integer id;
                private String logo;
                private String name;
                private Boolean verify;
                private Double shopRating; // Điểm đánh giá trung bình của shop
                private Integer shopRatingCount; // Số lượng đánh giá của shop
                private Integer productsCount; // Số lượng sản phẩm của shop
                private String shop_slug; // Mã định danh duy nhất của shop trong URL

                // Constructor cho JPQL
                public ShopDTO(Integer id, String logo, String name, Boolean verify, Double shopRating,
                                Integer shopRatingCount, Integer productsCount, String shop_slug) {
                        this.id = id;
                        this.logo = logo;
                        this.name = name;
                        this.verify = verify;
                        this.shopRating = shopRating;
                        this.shopRatingCount = shopRatingCount;
                        this.productsCount = productsCount;
                        this.shop_slug = shop_slug;
                }

                public ShopDTO(Integer id, String logo, String name, Boolean verify) {
                        this.id = id;
                        this.logo = logo;
                        this.name = name;
                        this.verify = verify;
                }
        }
}