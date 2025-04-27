package com.thebugs.back_end.controllers.super_admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.AdminDashboardService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
public class AdminDashboardController {
    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/admin/dashboard")
    public ResponseEntity<ResponseData> getDashboard() {
        try {
            return ResponseEntityUtil.OK("Lấy thông tin thành công", adminDashboardService.getDashboard());
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
        }
    }

}
