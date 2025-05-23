package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ProductDetailDTO;
import com.thebugs.back_end.dto.ProductDetailDTO.ShopDTO;
import com.thebugs.back_end.dto.RelatedProductDTO;
import com.thebugs.back_end.dto.ReviewDTO;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.ReviewJPA;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductDetailService {

    @Autowired
    private ProductJPA productJPA;

    @Autowired
    private ReviewJPA reviewJPA;

    public ProductDetailDTO getProductDetailById(Integer productId) {
        ProductDetailDTO productDetail = productJPA.findProductDetailById(productId);
        if (productDetail == null) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + productId);
        }

        ShopDTO shop = productJPA.findShopDetailsByProductIdWithRatings(productId);
        if (shop == null) {
            throw new IllegalArgumentException("Không tìm thấy shop cho sản phẩm với ID: " + productId);
        }
        productDetail.setShop(shop);

        List<String> authorNames = productJPA.findAuthorNamesByProductId(productId);
        productDetail.setAuthorNames(authorNames);

        List<String> genres = productJPA.findGenreNamesByProductId(productId);
        productDetail.setGenres(genres);

        List<String> images = productJPA.findImageNamesByProductId(productId);
        productDetail.setImages(images);

        return productDetail;
    }

    public List<RelatedProductDTO> getRelatedProducts(String productCode) {
        List<RelatedProductDTO> relatedProducts = productJPA.findRelatedProducts(productCode);

        for (RelatedProductDTO dto : relatedProducts) {
            List<String> authorNames = productJPA.findAuthorNamesByProductId(dto.getId());
            dto.setAuthorNames(authorNames);

            List<String> images = productJPA.findImageNamesByProductId(dto.getId());
            dto.setImages(images); // ✅ bổ sung phần lấy ảnh
        }

        return relatedProducts.stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getReviewsByProductId(Integer productId) {
        List<ReviewDTO> reviews = reviewJPA.findReviewsByProductId(productId);

        if (reviews == null || reviews.isEmpty()) {
            return List.of();
        }
        return reviews;
    }
}