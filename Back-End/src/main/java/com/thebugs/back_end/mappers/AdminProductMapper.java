package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.AdminProductDTO;
import com.thebugs.back_end.entities.Product;

@Component
public class AdminProductMapper {
    
    public AdminProductDTO toDTO(Product product ){
        if (product == null) {
            return null;
        } 
        AdminProductDTO adminProductDTO=new AdminProductDTO();
        adminProductDTO.setProductId(product.getId());
        adminProductDTO.setProductName(product.getName());
        adminProductDTO.setProductPrice(product.getPrice());
        adminProductDTO.setProductQuantity(product.getQuantity());
        adminProductDTO.setProductWeight(product.getWeight());
        adminProductDTO.setProductCode(product.getProduct_code());
        adminProductDTO.setShopName(product.getShop().getName());
        adminProductDTO.setActive(product.isActive());
        adminProductDTO.setApprove(product.isApprove());
        adminProductDTO.setStatus(product.getStatus());
        return adminProductDTO;
    }
}
