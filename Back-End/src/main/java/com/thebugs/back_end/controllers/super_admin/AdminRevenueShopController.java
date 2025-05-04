package com.thebugs.back_end.controllers.super_admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.AdminRevenueShopService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/admin/revenue/shop")
public class AdminRevenueShopController {

    @Autowired
    private AdminRevenueShopService adminRevenueShopService;

    @GetMapping("/list")
    public ResponseEntity<ResponseData> revenue(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "1") int page) {
        try {
            Map<String, Object> map = new HashMap<>();
            Pageable pageable = PageRequest.of(page - 1, 10);
            map.put("arrayList",  adminRevenueShopService.getShopRevenue(startDate, endDate, pageable));
            map.put("totalItems", adminRevenueShopService.total(startDate, endDate));
            map.put("totalRevenue", adminRevenueShopService.getTotalRevenue(startDate, endDate));
            return ResponseEntityUtil.OK("Load thành công", map);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    

}
