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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.ReportRejectBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.AdminReportProductService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
@RequestMapping("/admin/report/product")
public class AdminReportProductController {
    @Autowired
    private AdminReportProductService adminReportProductService;

    @GetMapping("/list")
    public ResponseEntity<ResponseData> getPage(@RequestParam(defaultValue = "all") String active,
            @RequestParam(defaultValue = "1") int page) {
        try {
            Map<String, Object> response = new HashMap<>();
            Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
            ArrayList<Object> items = adminReportProductService.findReportProductsByActive(active, pageable);
            int count = adminReportProductService.totalItems(active);
            response.put("arrayList", items);
            response.put("totalItems", count);
            return ResponseEntityUtil.OK("Lấy thông tin thành công", response);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<ResponseData> getDetail(@RequestParam(required = true) Integer id) {
        try {
            return ResponseEntityUtil.OK("Lấy thông tin thành công", adminReportProductService.getReportProduct(id));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @PostMapping("/approve")
    public ResponseEntity<ResponseData> postApproveReportProduct(@RequestParam(required = false) Integer id) {
        try {
            boolean checkApprove = adminReportProductService.approve(id);
            if (checkApprove) {
                return ResponseEntityUtil.OK("Duyệt báo cáo sản phẩm thành công", null);
            }
            return ResponseEntityUtil.badRequest("Lỗi khi duyệt mã: " + id);

        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<ResponseData> postRejctReportProduct(@RequestBody ReportRejectBean reportRejectBean) {
        try {
            boolean checkApprove = adminReportProductService.reject(reportRejectBean.getId(),
                    reportRejectBean.getReasons());
            if (checkApprove) {
                return ResponseEntityUtil.OK("Từ chối  báo cáo sản phẩm thành công", null);
            }
            return ResponseEntityUtil.badRequest("Lỗi khi từ chỗi mã: " + reportRejectBean.getId());
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }
}
