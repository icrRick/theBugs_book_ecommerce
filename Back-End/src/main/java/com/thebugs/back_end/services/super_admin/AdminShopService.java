package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.AdminShopMapper;
import com.thebugs.back_end.repository.RoleJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.repository.UserJPA;

import com.thebugs.back_end.utils.EmailUtil;

@Service
public class AdminShopService {

    @Autowired
    private ShopJPA shopJPA;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private AdminShopMapper adminShopMapper;

    @Autowired 
    private RoleJPA roleJPA;

    @Autowired
    private UserJPA userJPA;

    public ArrayList<Object> getProductByKeywordWithPagination(String keyword, Pageable pageable) {
        Page<Shop> page;
        if (keyword == null || keyword.isEmpty()) {
            page = shopJPA.findAll(pageable);
        } else {
            page = shopJPA.findByName(keyword, pageable);
        }
        return page.stream()
                .map(adminShopMapper::toShopDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int totalItems(String keyword) {
        return shopJPA.countfindByName(keyword);
    }

    public Shop getShopByShopSlug(String shopSlug) {
        return shopJPA.getShopByShopSlug(shopSlug)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy shopSlug: " + shopSlug));
    }

    public Object getShopDetailByShopSlug(String shopSlug) {
        Shop shop = getShopByShopSlug(shopSlug);
        return adminShopMapper.toShopDetail(shop);
    }

    public boolean approve(String shopSlug) {
        Shop shop = getShopByShopSlug(shopSlug);
        String emailShop = shop.getUser().getEmail();
        boolean checksendEmail = emailUtil.sendEmailApprove(emailShop,"Cửa hàng", shopSlug);
        boolean checkUpdateApprove = updateApprove(shop, true);
        User u=shop.getUser();
        u.setRole(roleJPA.findById(2).get());
        userJPA.save(u);
        return checksendEmail && checkUpdateApprove;
    }

    public boolean reject(String shopSlug, List<String> reasons) {
        Shop shop = getShopByShopSlug(shopSlug);
        String emailShop = shop.getUser().getEmail();
        boolean checksendEmail = emailUtil.sendEmailReject(emailShop,"Cửa hàng", shopSlug, reasons);
        boolean checkUpdateApprove = updateApprove(shop, false);
        return checksendEmail && checkUpdateApprove;
    }

    public boolean updateApprove(Shop shop, boolean approve) {
        try {
            shop.setApprove(approve);
            shopJPA.save(shop);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
