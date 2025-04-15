package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ApiGHNService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
public class ApiGHNController {
    @Autowired
    private ApiGHNService apiGHNService;

    @PostMapping("/api-ghn")
    public ResponseEntity<ResponseData> getProvinces(){
        try {
            return ResponseEntityUtil.OK("Lấy dữ liệu thành công", apiGHNService.getProvinces());
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

    @PostMapping("/api-ghn/distrit")
    public ResponseEntity<ResponseData> getDistrit(@RequestParam Integer provinceId){
        try {
            return ResponseEntityUtil.OK("Lấy dữ liệu thành công", apiGHNService.getDistricts(provinceId));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

    @PostMapping("/api-ghn/ward")
    public ResponseEntity<ResponseData> getWard(@RequestParam Integer districtId){
        try {
            return ResponseEntityUtil.OK("Lấy dữ liệu thành công", apiGHNService.getWards(districtId));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

}
