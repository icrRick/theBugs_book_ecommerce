package com.thebugs.back_end.controllers.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.UserReportProductService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
@RequestMapping("/user/report/product")
public class UserReportProductController {
  
    @Autowired
    private UserReportProductService userReportProductService;

    @GetMapping("/list")
    public ResponseEntity<ResponseData> getPage(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "all") String active,
            @RequestParam(defaultValue = "1") int page) {
        try {
            Map<String, Object> response = new HashMap<>();
            Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
            ArrayList<Object> items = userReportProductService.findReportProductsByActive(active, authorizationHeader,
                    pageable);
            int count = userReportProductService.countByActive(active, authorizationHeader);
            response.put("arrayList", items);
            response.put("totalItems", count);
            return ResponseEntityUtil.OK("Lấy thông tin thành công", response);
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }
    @GetMapping("/detail")
    public ResponseEntity<ResponseData> getDetail(@RequestParam Integer id) {
        try {
            return ResponseEntityUtil.OK("Lấy thông tin thành công",userReportProductService.getReportProduct(id));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<ResponseData> postAdd(@RequestHeader("Authorization") String authorizationHeader,
    @RequestParam String note, @RequestParam String productCode ,@RequestParam List<MultipartFile> images) {
        try {
            return userReportProductService.addReportProduct(productCode, note, authorizationHeader, images)
                        ? ResponseEntityUtil.OK("Lưu thành công", null)
                        : ResponseEntityUtil.badRequest("Lưu thất bại");
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

}
