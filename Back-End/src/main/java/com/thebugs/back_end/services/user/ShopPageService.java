package com.thebugs.back_end.services.user;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.beans.FillterShopPageBean;
import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.mappers.ProItemMapper;
import com.thebugs.back_end.mappers.ShopPageMapper;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.ShopJPA;

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

    public List<Object> filterProductByShop(String shopSlug, FillterShopPageBean fillterShopPageBean,
            Pageable pageable) {
        if (fillterShopPageBean.getGenresIntegers() != null && fillterShopPageBean.getGenresIntegers().isEmpty()) {
            fillterShopPageBean.setGenresIntegers(null);
        }
        if (fillterShopPageBean.getAuthorsIntegers() != null && fillterShopPageBean.getAuthorsIntegers().isEmpty()) {
            fillterShopPageBean.setAuthorsIntegers(null);
        }
        LocalDate filterDate = null;
        if ("newest".equals(fillterShopPageBean.getSortType())) {
            filterDate = LocalDate.now().minusDays(30); // Tính ngày 30 ngày trước
        }
        if (fillterShopPageBean.getProductName() == null) {
            fillterShopPageBean.setProductName(""); // Nếu productName null, đặt thành chuỗi rỗng để tránh lỗi trong
                                                    // query
        }
  

        Page<Product> proPage = productJPA.filterProductsWithSort(shopSlug, fillterShopPageBean.getProductName(),
                fillterShopPageBean.getGenresIntegers(), fillterShopPageBean.getAuthorsIntegers(),
                fillterShopPageBean.getMinPrice(), fillterShopPageBean.getMaxPrice(), fillterShopPageBean.getSortType(),
                filterDate, pageable);
        return proPage.getContent()
                .stream()
                .map(product -> proItemMapper.toDTO(product))
                .collect(Collectors.toList());
    }

    public int totalItems(String shopSlug, FillterShopPageBean fillterShopPageBean) {
        LocalDate filterDate = null;
        if ("newest".equals(fillterShopPageBean.getSortType())) {
            filterDate = LocalDate.now().minusDays(30); // Tính ngày 30 ngày trước
        }
        return productJPA.countFilteredProducts(shopSlug, fillterShopPageBean.getProductName(),
                fillterShopPageBean.getGenresIntegers(), fillterShopPageBean.getAuthorsIntegers(),
                fillterShopPageBean.getMinPrice(), fillterShopPageBean.getMaxPrice(),
                fillterShopPageBean.getSortType(), filterDate);
    }

}
