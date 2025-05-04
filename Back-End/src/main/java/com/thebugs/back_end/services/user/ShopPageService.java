package com.thebugs.back_end.services.user;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.beans.FilterShopPageBean;
import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.mappers.ProItemMapper;
import com.thebugs.back_end.mappers.ShopPageMapper;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.utils.Format;

@Service
public class ShopPageService {

    @Autowired
    private ShopJPA shopJPA;

    @Autowired
    private ProductJPA productJPA;

    @Autowired
    private ShopPageMapper shopPageMapper;

    @Autowired
    private ProItemMapper proItemMapper;

    public Shop getShopByShopSlug(String shopSlug) {
        return shopJPA._getShopByShopSlug(shopSlug)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy shop: " + shopSlug));
    }

    public Object getShopDetailByShopSlug(String shopSlug) {
        return shopPageMapper.toDTO(getShopByShopSlug(shopSlug));
    }

    public List<Object> filterProductByShop(String shopSlug, FilterShopPageBean filterShopPageBean, Pageable pageable) {

        if (filterShopPageBean.getGenresIntegers() == null || filterShopPageBean.getGenresIntegers().isEmpty()) {
            filterShopPageBean.setGenresIntegers(null);
        }

        if (filterShopPageBean.getAuthorsIntegers() == null || filterShopPageBean.getAuthorsIntegers().isEmpty()) {
            filterShopPageBean.setAuthorsIntegers(null);
        }
        if (filterShopPageBean.getSortType() == null) {
            filterShopPageBean.setSortType("price_desc");
        }

        LocalDate filterDate = null;
        if ("newest".equals(filterShopPageBean.getSortType())) {
            filterDate = LocalDate.now().minusDays(30);
        }

        Page<Product> proPage = productJPA.filterProductsWithSort(
                shopSlug,
                filterShopPageBean.getProductName(),
                filterShopPageBean.getGenresIntegers(),
                filterShopPageBean.getAuthorsIntegers(),
                filterShopPageBean.getMinPrice(),
                filterShopPageBean.getMaxPrice(),
                filterDate,
                filterShopPageBean.getSortType(),
                pageable);

        return proPage.getContent()
                .stream()
                .map(product -> proItemMapper.toDTO(product)) 
                .collect(Collectors.toList()); 
    }

    public int totalItems(String shopSlug, FilterShopPageBean fillterShopPageBean) {
        LocalDate filterDate = null;
        if ("newest".equals(fillterShopPageBean.getSortType())) {
            filterDate = LocalDate.now().minusDays(30);
        }
        return productJPA.countFilteredProducts(shopSlug, fillterShopPageBean.getProductName(),
                fillterShopPageBean.getGenresIntegers(), fillterShopPageBean.getAuthorsIntegers(),
                fillterShopPageBean.getMinPrice(), fillterShopPageBean.getMaxPrice(),
                fillterShopPageBean.getSortType(), filterDate);
    }

    public List<Object> getList(String shopSlug) {
        List<Product> products = productJPA.getAllByShop(shopSlug);
    
         Date today = Format.formatDateS(new Date());
    
        return products.stream()
                .filter(product -> product.getPromotionProducts() != null && !product.getPromotionProducts().isEmpty()) 
                .filter(product -> product.getPromotionProducts().stream()
                        .anyMatch(promotion -> {
                            Date startDate = promotion.getPromotion().getStartDate();
                            Date endDate = promotion.getPromotion().getExpireDate();
                            return (startDate == null || !today.before(startDate)) 
                                    && (endDate == null || !today.after(endDate)); 
                        })
                ) 
                .map(product -> proItemMapper.toDTO(product)) 
                .collect(Collectors.toList());
    }
    

}
