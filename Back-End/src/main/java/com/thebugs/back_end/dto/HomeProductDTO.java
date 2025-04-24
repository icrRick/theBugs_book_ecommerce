package com.thebugs.back_end.dto;

import java.util.List;

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
        private Double promotionValue; // Giá trị khuyến mãi (phần trăm giảm giá)
        private Boolean isNew; // Sản phẩm mới (dựa trên createdAt)
        private Double discountPrice; // Giá sau giảm giá
        private String productCode; // Mã sản phẩm
        private List<String> authorNames; // Danh sách tác giả

        // Constructor với 10 tham số, khớp với truy vấn JPQL
        public HomeProductDTO(Integer productId, String productName, Double price, String imageName,
                        Double rate, Double promotionValue, Boolean isNew, Double discountPrice,
                        String productCode, List<String> authorNames) {
                this.productId = productId;
                this.productName = productName;
                this.price = price;
                this.imageName = imageName;
                this.rate = rate;
                this.promotionValue = promotionValue;
                this.isNew = isNew;
                this.discountPrice = discountPrice;
                this.productCode = productCode;
                this.authorNames = authorNames;
        }
}
