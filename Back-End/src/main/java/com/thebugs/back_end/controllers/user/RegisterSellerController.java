package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.beans.AddressBean;
import com.thebugs.back_end.beans.ShopBean;
import com.thebugs.back_end.beans.UserRegisterBean;
import com.thebugs.back_end.dto.AddressDTO;
import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_District_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Province_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Ward_DTO;
import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.repository.UserJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.AddressService;
import com.thebugs.back_end.services.user.LoginService;
import com.thebugs.back_end.services.user.RegisterSellerService;
import com.thebugs.back_end.services.user.RegisterService;
import com.thebugs.back_end.services.user.UserService;
import com.thebugs.back_end.utils.ColorUtil;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
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
    RegisterSellerService g_RegisterSellerService;
    @Autowired
    RegisterService g_RegisterService;
    @Autowired
    LoginService g_LoginService;

    @Autowired
    AddressService g_AddressService;
    @Autowired
    UserJPA g_UserJPA;

    @Autowired
    UserService g_UserService;

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
        Map<String, Object> result = g_RegisterSellerService.idRecognition(images);
        ResponseData responseData = new ResponseData();
        responseData.setMessage((String) result.get("message"));
        Object data = result.get("data");
        if (data != null) {
            responseData.setStatus(true);
            responseData.setData(data);
        }
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

    @PostMapping("/face-match")
    public ResponseEntity<ResponseData> faceMatch(@RequestHeader("Authorization") @RequestParam MultipartFile image,
            @RequestParam(required = false) MultipartFile video) {
        ColorUtil.print(ColorUtil.RED, video.getOriginalFilename());
        Map<String, Object> result = g_RegisterSellerService.faceMatch(image, video);
        ResponseData responseData = new ResponseData();
        responseData.setMessage((String) result.get("message"));
        Object data = result.get("data");
        responseData.setStatus((boolean) result.get("status"));
        if (data != null) {
            responseData.setData(data);
        }
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

    @PostMapping("/register-seller")
    public ResponseEntity<ResponseData> registerSeller(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("shopInfor") ShopBean bean,
            @RequestPart(value = "logo") MultipartFile logo,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
        ColorUtil.print(ColorUtil.BLUE, "START REGISTER SELLER");
        HashMap<String, Object> result = g_RegisterSellerService.createSeller(authorizationHeader, bean, logo);
        ResponseData responseData = new ResponseData();
        responseData.setStatus((boolean) result.get("status"));
        responseData.setMessage((String) result.get("message"));
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

    @GetMapping("/get-province-infor")
    public ResponseEntity<GHN_Province_DTO> getProvinceInfor() {
        GHN_Province_DTO result = g_RegisterSellerService.getProvinceInfor();
        return ResponseEntity.status(HttpStatus.valueOf(result.getCode())).body(result);
    }

    @GetMapping("/get-district-infor")
    public ResponseEntity<GHN_District_DTO> getDistrictInfor(@RequestParam int provinceID) {
        GHN_District_DTO result = g_RegisterSellerService.getDistrictInfor(provinceID);
        return ResponseEntity.status(HttpStatus.valueOf(result.getCode())).body(result);
    }

    @GetMapping("/get-ward-infor")
    public ResponseEntity<GHN_Ward_DTO> getWardInfor(@RequestParam int districtID) {
        GHN_Ward_DTO result = g_RegisterSellerService.getWardInfor(districtID);
        return ResponseEntity.status(HttpStatus.valueOf(result.getCode())).body(result);
    }

    @PostMapping("/register-add-address")
    public ResponseEntity<ResponseData> saveAddress(@RequestHeader("Authorization") String authorizationHeader,
            @RequestBody @Valid AddressBean addressBean, BindingResult result) {
        ResponseData responseData = new ResponseData();
        try {
            if (result.hasErrors()) {
                String errorMessages = result.getAllErrors().stream()
                        .map(DefaultMessageSourceResolvable::getDefaultMessage)
                        .collect(Collectors.joining(", "));
                responseData.setStatus(false);
                responseData.setMessage(errorMessages);
                responseData.setData(null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(responseData);
            }
            Address address = new Address();
            User user = g_UserService.getUserToken(authorizationHeader);
            address.setId(addressBean.getId() != null ? addressBean.getId() : null);
            address.setFullName(user.getShop().getShop_slug());
            address.setPhone(user.getPhone());
            address.setProvinceId(addressBean.getProvinceId());
            address.setDistrictId(addressBean.getDistrictId());
            address.setWardId(addressBean.getWardId());
            address.setStreet(addressBean.getStreet());
            address.setIsShop("Địa chỉ shop");
            address.setUser(user);
            AddressDTO addressDTO = g_AddressService.saveAddress(address);
            responseData.setStatus(true);
            responseData.setMessage(
                    addressBean.getId() != null ? "Cập nhật thành công" : "Thêm mới thành công");
            responseData.setData(addressDTO);
            return ResponseEntity.ok(responseData);

        } catch (Exception e) {
            responseData.setStatus(false);
            responseData.setMessage("Lỗi " + e.getMessage());
            responseData.setData(null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseData> registerUser(
            @RequestBody(required = false) @Valid UserRegisterBean registerBean,
            BindingResult result) {
        ColorUtil.print(ColorUtil.RED, "StartRegister");
        ResponseData responseData = new ResponseData();
        try {
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
            String jwt = g_RegisterSellerService.registerAndLoginUser(registerBean);
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            responseData.setStatus(true);
            responseData.setMessage("Đăng ký thành công");
            responseData.setData(response);
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setStatus(false);
            responseData.setMessage("Lỗi: " + e.getMessage());
            responseData.setData(null);
            return ResponseEntity.status(401).body(responseData);
        }
    }

}
