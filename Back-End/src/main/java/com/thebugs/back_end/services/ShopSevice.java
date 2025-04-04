package com.thebugs.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ShopDetailDTO;
import com.thebugs.back_end.repository.ShopJPA;

@Service
public class ShopSevice {

        @Autowired
        private ShopJPA shopJPA;

        public ShopDetailDTO getShopDetail(Integer shopId) {
                if (shopId == null) {
                        throw new IllegalArgumentException("ShopId không được null");
                }
                return shopJPA.getShopDetail(shopId).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy"));
        }
}
