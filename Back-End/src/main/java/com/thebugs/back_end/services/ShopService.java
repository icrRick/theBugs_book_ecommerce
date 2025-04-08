package com.thebugs.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.repository.ShopJPA;

@Service
public class ShopService {

    @Autowired
    private ShopJPA shopJPA;


    public Shop getShopById(Integer shopId) {
        if (shopId == null) {
            throw new IllegalArgumentException("shopId không được null");
        }
        return shopJPA.findById(shopId).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy shopId: " + shopId));
    }

}
