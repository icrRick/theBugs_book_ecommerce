package com.thebugs.back_end.mappers;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.services.user.AddressService;
import com.thebugs.back_end.services.user.ApiGHNService;
import com.thebugs.back_end.utils.ReplaceName;

@Component
public class AdminShopMapper {
    @Autowired
    private AddressService addressService;
    @Autowired
    private ApiGHNService apiGHNService;

    public Object toDTO(Product product) {
        String shopName = product.getShop().getName();
        String image = product.getShop().getImage();
        boolean verify = product.getShop().getUser().getVerify();
        Map<String, Object> map = new HashMap<>();
        map.put("shopName", shopName);
        map.put("shopImage", image != null ? image : ReplaceName.generatePlaceholderUrl(shopName));
        map.put("shopSlug", product.getShop().getShop_slug());
        map.put("verify", verify);
        return map;
    }

    public Object toShopDTO(Shop shop) {
        Map<String, Object> map = new HashMap<>();
        boolean verify = shop.getUser().getVerify();
        String userFullName = shop.getUser().getFullName();
        map.put("id", shop.getId());
        map.put("userFullName", userFullName);
        map.put("verify", verify);
        map.put("shopName", shop.getName());
        map.put("shopCreatAt", shop.getCreateAt());
        map.put("shopSlug", shop.getShop_slug());
        map.put("active", shop.isActive());
        map.put("approve", shop.getApprove());
        map.put("status", shop.getStatus());
        return map;
    }

    public Object toShopDetail(Shop shop) {
        Map<String, Object> map = new HashMap<>();
    
        User user = shop.getUser();
        if (user != null) {
            map.put("email", user.getEmail());
            map.put("phone", user.getPhone());
            map.put("avatar", user.getAvatar()); 
            map.put("userFullName", user.getFullName());
            map.put("gender", user.getGender());
            map.put("cccd", user.getCccd());
            map.put("verify", user.getVerify());
            map.put("dob", user.getDob());
            map.put("userActive", user.isActive()); 
            map.put("address", user.getAddress());
            map.put("avatar", user.getAvatar() != null ? user.getAvatar() : ReplaceName.generatePlaceholderUrl(user.getFullName()));
        }
    
        map.put("shopId", shop.getId());
        map.put("shopName", shop.getName());
        map.put("shopSlug", shop.getShop_slug());
        map.put("description", shop.getDescription());
        map.put("bankOwnerNumber", shop.getBankOwnerNumber());
        map.put("bankOwnerName", shop.getBankOwnerName());
        map.put("bankProvideName", shop.getBankProvideName());
        map.put("totalPayout", 0);
        map.put("shopCreatAt", shop.getCreateAt());
        map.put("image", shop.getImage());
        map.put("banner", shop.getBanner());

        map.put("shopActive", shop.isActive()); 
        map.put("approve", shop.getApprove());
        map.put("status", shop.getStatus());
    
        Address address = addressService.getAddressShopId(shop.getId());
        if (address != null) {
            map.put("addressFullName", address.getFullName());
            map.put("addressPhone", address.getPhone());
            map.put("addressShop",address.getStreet()+", "
            + apiGHNService.getWardName(address.getDistrictId(), String.valueOf(address.getWardId()))   
            + ", " + apiGHNService.getDistrictName(address.getProvinceId(), address.getDistrictId())
            + ", " + apiGHNService.getProvinceName(address.getProvinceId()));
        }
    
        return map;
    }
}    