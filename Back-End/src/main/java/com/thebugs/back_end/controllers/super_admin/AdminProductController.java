package com.thebugs.back_end.controllers.super_admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.RejectBean;
import com.thebugs.back_end.dto.AdminProductDTO;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.AdminProductService;
import com.thebugs.back_end.utils.ResponseEntityUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/admin/product")
public class AdminProductController {

    @Autowired
    private AdminProductService adminProductService;


    @GetMapping("/list")
    public ResponseEntity<ResponseData> getPage(@RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page) {
        try {
            Map<String, Object> response = new HashMap<>();
            Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
            ArrayList<AdminProductDTO> items = adminProductService.getProductByKeywordWithPagination(keyword, pageable);
            int count = adminProductService.totalItems(keyword);
            response.put("arrayList", items);
            response.put("totalItems", count);
            return ResponseEntityUtil.OK("Lấy thông tin thành công", response);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @GetMapping("/productDetail")
    public ResponseEntity<ResponseData> getProductDetail(@RequestParam(required = false) String productCode) {
        try {

            Object items = adminProductService.getProductDetail(productCode);
            return ResponseEntityUtil.OK("Lấy thông tin thành công", items);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @PostMapping("/approve")
    public ResponseEntity<ResponseData> postApproveProduct(@RequestParam(required = false) String productCode) {
        try {
            boolean checkApprove = adminProductService.approve(productCode);
            if (checkApprove) {
                return ResponseEntityUtil.OK("Duyệt sản phẩm thành công", null);
            }
            return ResponseEntityUtil.badRequest("Lỗi khi duyệt mã: " + productCode);

        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<ResponseData> postRejectProduct(@RequestBody RejectBean rejectBean) {
        try {
            boolean checkApprove = adminProductService.reject(rejectBean.getRejectCode(), rejectBean.getReasons());
            if (checkApprove) {
                return ResponseEntityUtil.OK("Từ chối sản phẩm thành công", null);
            }
            return ResponseEntityUtil.badRequest("Lỗi khi từ chỗi mã: " + rejectBean.getRejectCode());

        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

}
