package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ProductDetailDTO;
import com.thebugs.back_end.dto.ProductDetailDTO.ShopDTO;
import com.thebugs.back_end.dto.RelatedProductDTO;
import com.thebugs.back_end.repository.ProductJPA;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductDetailService {

    @Autowired
    private ProductJPA productJPA;

    public ProductDetailDTO getProductDetailById(Integer productId) {
        ProductDetailDTO productDetail = productJPA.findProductDetailById(productId);
        if (productDetail == null) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + productId);
        }

        ShopDTO shop = productJPA.findShopByProductId(productId);
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
        }

        return relatedProducts.stream()
                .limit(5)
                .collect(Collectors.toList());
    }
}