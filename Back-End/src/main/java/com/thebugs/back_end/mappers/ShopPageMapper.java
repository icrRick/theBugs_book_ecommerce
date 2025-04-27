package com.thebugs.back_end.mappers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ProductGenre;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.services.super_admin.AuthorService;
import com.thebugs.back_end.services.super_admin.GenreService;
import com.thebugs.back_end.services.user.AddressService;
import com.thebugs.back_end.services.user.ApiGHNService;
import com.thebugs.back_end.services.user.ReviewService;
import com.thebugs.back_end.utils.ReplaceName;

@Component
public class ShopPageMapper {

    @Autowired
    private AddressService addressService;
    @Autowired
    private ApiGHNService apiGHNService;

    @Autowired
    private GenreService genreService;

    @Autowired
    private AuthorService authorService;

    @Autowired
    private ReviewService reviewService;

    public Object toDTO(Shop shop) {
        Map<String, Object> map = new HashMap<>();
        Address address = addressService.getAddressShopId(shop.getId());
        map.put("id", shop.getId());
        map.put("shopName", shop.getName());
        map.put("shopRating", Math.round(reviewService.getAverageRateByShopId(shop.getId()) * 10.0) / 10.0);
        map.put("shopRatingCount", reviewService.countReviewByShopId(shop.getId()));
        map.put("shopAddress",
                address != null
                        ? address.getStreet() + ", "
                                + apiGHNService.getWardName(address.getDistrictId(),
                                        String.valueOf(address.getWardId()))
                                + ", " + apiGHNService.getDistrictName(address.getProvinceId(), address.getDistrictId())
                                + ", " + apiGHNService.getProvinceName(address.getProvinceId())
                        : null);

        map.put("shopBanner",
                shop.getBanner() != null ? shop.getBanner() : ReplaceName.generatePlaceholderUrl(shop.getName()));
        map.put("shopCreatAt", shop.getCreateAt());
        map.put("shopImage",
                shop.getImage() != null ? shop.getImage() : ReplaceName.generatePlaceholderUrl(shop.getName()));
        map.put("shopDescription", shop.getDescription());
        map.put("shopSlug", shop.getShop_slug());
        map.put("verify", shop.getUser().getVerify());
        map.put("productsCount", shop.getProducts().size());
      
        map.put("genres", genreService.findDistinctGenresByShopSlug(shop.getShop_slug()));
        map.put("authors", authorService.findDistinctAuthorsByShopSlug(shop.getShop_slug()));

        return map;
    }

}
