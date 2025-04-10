package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.repository.ProductJPA;

@Service
public class ProductService {
    
    @Autowired
    private ProductJPA productJPA;

    public ProItemDTO getProItemDTO(Integer productId) {
        return productJPA.getProItemDTO(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy productId: " + productId));
    }
    public Product getProductById(Integer productId) {
        return productJPA.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy productId: " + productId));
    }
    
    public Product updateProductQuantity(Integer productId, Integer quantity) {
        Product product=getProductById(productId);
        if (product.getQuantity() < quantity) {
            throw new IllegalArgumentException("Số lượng sản phẩm không đủ");
        }
        product.setQuantity(product.getQuantity() - quantity);
        return productJPA.save(product);
    }
    
}
