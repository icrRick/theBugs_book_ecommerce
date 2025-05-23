package com.thebugs.back_end.controllers.seller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.seller.Seller_ReportProductService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
@RequestMapping("/seller/report/product")
public class SellerReportProductController {

    @Autowired
    private Seller_ReportProductService seller_ReportProductService;

    @GetMapping("/list")
    public ResponseEntity<ResponseData> getPage(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "all") String active,
            @RequestParam(defaultValue = "1") int page) {
        try {
            Map<String, Object> response = new HashMap<>();
            Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
            ArrayList<Object> items = seller_ReportProductService.findReportProductsByActive(active,
                    authorizationHeader,
                    pageable);
            int count = seller_ReportProductService.totalItems(active, authorizationHeader);
            response.put("arrayList", items);
            response.put("totalItems", count);
            return ResponseEntityUtil.OK("Lấy thông tin thành công", response);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<ResponseData> getDetail(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam Integer id) {
        try {
            return ResponseEntityUtil.OK("Lấy thông tin thành công",
                    seller_ReportProductService.getReportProductDetail(authorizationHeader, id));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }
}
