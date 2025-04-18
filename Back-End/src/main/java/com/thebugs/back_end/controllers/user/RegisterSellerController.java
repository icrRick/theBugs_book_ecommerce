package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.beans.AddressBean;
import com.thebugs.back_end.beans.ShopBean;
import com.thebugs.back_end.beans.UserRegisterBean;
import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_District_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Province_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Ward_DTO;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.repository.UserJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.RegisterSellerService;
import com.thebugs.back_end.utils.ColorUtil;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/users")
public class RegisterSellerController {
    @Autowired
    private RegisterSellerService g_RegisterSellerService;
    @Autowired
    private UserJPA g_UserJPA;

    @Autowired
    private ShopJPA g_ShopJPA;

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
            @RequestParam List<MultipartFile> images) {
        ResponseData responseData = g_RegisterSellerService.idRecognition(images);
        return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
    }

    @PostMapping("/face-match")
    public ResponseEntity<ResponseData> faceMatch(@RequestHeader("Authorization") @RequestParam MultipartFile image,
            @RequestParam(required = false) MultipartFile video) {
        ColorUtil.print(ColorUtil.RED, video.getOriginalFilename());
        ResponseData responseData = g_RegisterSellerService.faceMatch(image, video);
        return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
    }

    @GetMapping("/get-province-infor")
    public ResponseEntity<GHN_Province_DTO> getProvinceInfor() {
        GHN_Province_DTO result = g_RegisterSellerService.getProvinceInfo();
        return ResponseEntity.status(HttpStatus.valueOf(result.getCode())).body(result);
    }

    @GetMapping("/get-district-infor")
    public ResponseEntity<GHN_District_DTO> getDistrictInfor(@RequestParam int provinceID) {
        GHN_District_DTO result = g_RegisterSellerService.getDistrictInfor(provinceID);
        ColorUtil.print(ColorUtil.RED, "WEBCLIENTResponseOK: ");
        return ResponseEntity.status(HttpStatus.valueOf(result.getCode())).body(result);
    }

    @GetMapping("/get-ward-infor")
    public ResponseEntity<GHN_Ward_DTO> getWardInfor(@RequestParam int districtID) {
        GHN_Ward_DTO result = g_RegisterSellerService.getWardInfor(districtID);
        return ResponseEntity.status(HttpStatus.valueOf(result.getCode())).body(result);
    }

    @PostMapping("/register-seller")
    public ResponseEntity<ResponseData> registerSeller(
            @RequestPart("shopInfor") ShopBean shopBean,
            @RequestPart("addressInfor") AddressBean addressBean,
            @RequestPart("accountInfor") UserRegisterBean registerBean,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
                System.out.println("SUCCESS DATA");
        ResponseData result = g_RegisterSellerService.createSeller(shopBean, addressBean, registerBean, logo,
                banner);
        return ResponseEntity.status(HttpStatus.valueOf(result.getStatusCode())).body(result);
    }

    @PostMapping("/validate-register-user")
    public ResponseEntity<ResponseData> validateRegisterUser(
            @RequestBody @Valid UserRegisterBean registerBean,
            BindingResult result) {
        ResponseData responseData = new ResponseData();
        Map<String, String> errorMap = new HashMap<>();

        if (g_UserJPA.findByEmailExist(null, registerBean.getEmail()).isPresent()) {
            errorMap.put("email", "Email này đã được sử dụng");
        }
        if (!registerBean.getPassword().equals(registerBean.getConfirmPassword())) {
            errorMap.put("confirmPassword", "Mật khẩu xác nhận không khớp");
        }
        if (result.hasErrors()) {
            for (FieldError fieldError : result.getFieldErrors()) {
                errorMap.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
            }
        }

        if (!errorMap.isEmpty()) {
            responseData.setStatus(false);
            responseData.setMessage("Yêu cầu nhập đúng các trường dữ liệu");
            responseData.setData(errorMap);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
        responseData.setStatus(true);
        responseData.setMessage("OK");
        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/validate-register-seller")
    public ResponseEntity<ResponseData> validateRegisterSeller(
            @RequestPart("shopInfor") @Valid ShopBean bean,
            BindingResult result,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
        ColorUtil.print(ColorUtil.BLUE, "START REGISTER SELLER");
        Map<String, String> errorMap = new HashMap<>();
        if (result.hasErrors()) {
            for (FieldError fieldError : result.getFieldErrors()) {
                errorMap.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
            }
        }
        if (g_ShopJPA.existsByShopSlug(bean.getShop_slug())) {
            errorMap.put("shop_slug", "Tên đường đẫn cửa hàng đã tồn tại");
        }
        ResponseData responseData = new ResponseData();
        if (!errorMap.isEmpty()) {
            responseData.setStatus(false);
            responseData.setMessage("Yêu cầu nhập đúng các trường dữ liệu");
            responseData.setData(errorMap);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
        responseData.setStatus(true);
        responseData.setMessage("OK");
        return ResponseEntity.ok(responseData);
    }
}
