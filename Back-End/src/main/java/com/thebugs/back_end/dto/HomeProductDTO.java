package com.thebugs.back_end.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class HomeProductDTO {
        private Integer productId; // ID sản phẩm
        private String productName; // Tên sản phẩm
        private Double price; // Giá gốc
        private String imageName; // Tên hình ảnh (hình ảnh chính)
        private Double rate; // Điểm đánh giá trung bình
        private Long reviewCount; // Số lượng đánh giá
        private Double promotionValue; // Giá trị khuyến mãi (phần trăm giảm giá)
        private Boolean isNew; // Sản phẩm mới (dựa trên createdAt)
        private Double discountPrice; // Giá sau giảm giá
        private String product_code; // Mã sản phẩm
        private Boolean hasFlashSale; // Trạng thái flash sale

        // Constructor với 11 tham số
        public HomeProductDTO(Integer productId, String productName, Double price, String imageName,
                        Double rate, Long reviewCount, Double promotionValue, Boolean isNew,
                        Double discountPrice, String product_code, Boolean hasFlashSale) {
                this.productId = productId;
                this.productName = productName;
                this.price = price;
                this.imageName = imageName;
                this.rate = rate;
                this.reviewCount = reviewCount;
                this.promotionValue = promotionValue;
                this.isNew = isNew;
                this.discountPrice = discountPrice;
                this.product_code = product_code;
                this.hasFlashSale = hasFlashSale;
        }
}