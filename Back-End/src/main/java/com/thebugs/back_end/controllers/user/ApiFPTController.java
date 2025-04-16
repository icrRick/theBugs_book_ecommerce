package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.beans.RecognitionBean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.ApiFPTService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
public class ApiFPTController {

    @Autowired
    private ApiFPTService apiFPTService;

    @PostMapping("/api-ghn/recognition")
    public ResponseEntity<ResponseData> getRecognition(@RequestParam("image") MultipartFile image) {
        try {
            return ResponseEntityUtil.OK("Lấy dữ liệu thành công", apiFPTService.getRecognition(image));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

    @PostMapping("/api-ghn/liveness")
    public ResponseEntity<ResponseData> getLiveness(@RequestParam("cmnd") MultipartFile image,@RequestParam("video") MultipartFile video
            ) {
        try {
            return ResponseEntityUtil.OK("Lấy dữ liệu thành công", apiFPTService.getLiveness(image,video));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }
}
