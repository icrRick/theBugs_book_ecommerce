package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.FillterShopPageBean;
import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ShopPageService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/shop")
public class ShopPageController {
    @Autowired
    private ShopPageService shopPageService;

    @GetMapping("/detail")
    public ResponseEntity<ResponseData> getShopPage(@RequestParam(required = false) String shopSlug) {
        try {
            return ResponseEntityUtil.OK("Lấy thông tin thành công",
                    shopPageService.getShopDetailByShopSlug(shopSlug));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @PostMapping("/filter")
    public ResponseEntity<ResponseData> getFilteredShopPage(@RequestParam(required = false) String shopSlug , @RequestBody(required = false) FillterShopPageBean fillterShopPageBean,
            @RequestParam(defaultValue = "1") int page) {
        try {
            Map<String, Object> response = new HashMap<>();
            Pageable pageable = PageRequest.of(page - 1, 12, Sort.by(Sort.Order.desc("id")));
         
            List<Object> products = shopPageService.filterProductByShop(shopSlug, fillterShopPageBean, pageable);
        
            int count = shopPageService.totalItems(shopSlug, fillterShopPageBean);
            response.put("arrayList", products);
            response.put("totalItems", count);
        
            return ResponseEntityUtil.OK("Lấy thông tin thành công",
            response);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

}
