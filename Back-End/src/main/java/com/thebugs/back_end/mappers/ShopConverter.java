package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.beans.ShopBean;
import com.thebugs.back_end.entities.Shop;

@Component
public class ShopConverter {
    public Shop beanToEntity(ShopBean bean) {
        Shop shop = new Shop();
        shop.setName(bean.getName());
        shop.setAccoutName(bean.getBankOwnerName());
        shop.setAccoutNumber(bean.getBankOwnerNumber());
        shop.setBankName(bean.getBankProvideName());
        shop.setShop_slug(bean.getShop_slug());
        shop.setDescription(bean.getDescription());
        shop.setActive(true);
        shop.setApprove(false);
        shop.setStatus(true);
        return shop;
    }
}
