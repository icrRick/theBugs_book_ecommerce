package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.RegisterSellerService;
import com.thebugs.back_end.utils.ColorUtil;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/users")
public class RegisterSellerController {
    @Autowired
    RegisterSellerService g_RegisterSellerService;

    @GetMapping("/me")
    public ResponseEntity<ResponseData> getMethodName(
            @RequestHeader("Authorization") String authorizationHeader) {
        ColorUtil.print(ColorUtil.RED, "Start getUSER");
        int statusCode = 200;
        UserDTO user = g_RegisterSellerService.getUserByToken(authorizationHeader);
        ResponseData responseData = new ResponseData();
        if (user == null) {
            statusCode = 400;
            responseData.setStatus(false);
            responseData.setMessage("Lấy thông tin người dùng thất bại.");
        } else {
            responseData.setStatus(true);
            responseData.setMessage("Lấy thông tin người dùng thành công.");
            responseData.setData(user);
        }
        return ResponseEntity.status(HttpStatus.valueOf(statusCode)).body(responseData);
    }

    @PostMapping("/id-recognition")
    public ResponseEntity<ResponseData> idRecognition(
            @RequestHeader("Authorization") @RequestParam List<MultipartFile> images) {
        ColorUtil.print(ColorUtil.RED, "IDRECO Bắt đầu nhận diện");
        Map<String, Object> result = g_RegisterSellerService.idRecognition(images);
        ResponseData responseData = new ResponseData();
        responseData.setMessage((String) result.get("message"));
        Object data = result.get("data");
        if (data != null) {
            responseData.setStatus(true);
            responseData.setData(data);
        }
        ColorUtil.print(ColorUtil.RED, "Kết thúc nhận diện");
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

    @PostMapping("/face-match")
    public ResponseEntity<ResponseData> faceMatch(@RequestHeader("Authorization") @RequestParam MultipartFile image,
            @RequestParam(required = false) MultipartFile video) {
        ColorUtil.print(ColorUtil.RED, "IDRECO Bắt đầu nhận diện face");
        ColorUtil.print(ColorUtil.RED, video.getOriginalFilename());
        Map<String, Object> result = g_RegisterSellerService.faceMatch(image, video);
        ResponseData responseData = new ResponseData();
        responseData.setMessage((String) result.get("message"));
        Object data = result.get("data");
        if (data != null) {
            responseData.setStatus(true);
            responseData.setData(data);
        }
        ColorUtil.print(ColorUtil.RED, "Kết thúc nhận diện face");
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

    
    @PostMapping("register-seller")
    public ResponseEntity<ResponseData> registerUser(@RequestParam String a) {
        
        return null;
    }




}
