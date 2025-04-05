package com.thebugs.back_end.mappers;

import com.thebugs.back_end.beans.Seller_ProductBean;
import com.thebugs.back_end.dto.PublisherDTO;
import com.thebugs.back_end.dto.SellerProductDTO;
import com.thebugs.back_end.entities.Publisher;

public class IrRick_SellerMapper {
    public static PublisherDTO fromPublisherEntityToDTO(Publisher publisher) {
        if (publisher == null) {
            return null;
        }
        return new PublisherDTO(publisher.getId(), publisher.getName());
    }

    public static SellerProductDTO fromProductBeanToDTO(Seller_ProductBean bean) {
        if (bean == null) {
            return null;
        }
        return new SellerProductDTO(null, bean.getName(), bean.getPrice(), bean.getQuantity(), bean.getWeight(),
                bean.getDescription(), true, bean.getShopId(), bean.getPublisher_id(), null,
                bean.getGenres_id(), bean.getAuthors_id());
    }
}
