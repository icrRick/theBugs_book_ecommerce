package com.thebugs.back_end.controllers.seller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.RevenueShopService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
@RequestMapping("/seller/revenue/shop")
public class RevenueShopController {
    @Autowired
    private RevenueShopService revenueShopService;

    @GetMapping("/list")
    public ResponseEntity<ResponseData> revenue(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "1") int page) {
        try {
            Map<String, Object> map = new HashMap<>();
            Pageable pageable = PageRequest.of(page - 1, 10);
            map.put("arrayList", revenueShopService.getShopRevenue(startDate, endDate,authorizationHeader, pageable));
            map.put("totalItems", revenueShopService.total(startDate, endDate,authorizationHeader));
            map.put("totalRevenue", revenueShopService.getTotalRevenue(startDate, endDate,authorizationHeader));
            return ResponseEntityUtil.OK("Load thành công", map);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

}
