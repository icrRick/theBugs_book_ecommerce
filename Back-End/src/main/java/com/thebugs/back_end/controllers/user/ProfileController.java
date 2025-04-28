package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.beans.ProfileBean;
import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.UserService;
import com.thebugs.back_end.utils.CloudinaryUpload;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class ProfileController {

        @Autowired
        private UserService userService;

        @GetMapping("/auth/profile")
        public ResponseEntity<ResponseData> getProfile(@RequestHeader("Authorization") String authorizationHeader) {
                ResponseData responseData = new ResponseData();
                try {
                        UserDTO userDTO = userService.getUserDTO(authorizationHeader);
                        responseData.setStatus(true);
                        System.out.println("thông tin " + userDTO);
                        responseData.setMessage("Lấy thông tin người dùng thành công");
                        responseData.setData(userDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/auth/profile")
        public ResponseEntity<ResponseData> saveProfile(@RequestBody ProfileBean profileBean,
                        @RequestHeader("Authorization") String authorizationHeader) {
                ResponseData responseData = new ResponseData();
                try {
                        User user = userService.getUserToken(authorizationHeader);
                        user.setFullName(profileBean.getFullName());
                        user.setPhone(profileBean.getPhone());
                        user.setEmail(profileBean.getEmail());
                        user.setCccd(profileBean.getCccd());
                        user.setGender(profileBean.getGender());
                        user.setDob(profileBean.getDob());
                        user.setAddress(profileBean.getAddress());
                        UserDTO userDTO = userService.updateUser(user);
                        responseData.setStatus(true);
                        responseData.setMessage("Cập nhật thành công");
                        responseData.setData(userDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }

        @PostMapping("/auth/upload-avatar")
        public ResponseEntity<ResponseData> uploadAvatar(@RequestPart("avatar") MultipartFile avatar,
                        @RequestHeader("Authorization") String authorizationHeader) {

                try {
                        String urlImage = null;

                        if (avatar != null && !avatar.isEmpty()) {
                                System.out.println("Image: " + avatar.getOriginalFilename());
                                urlImage = CloudinaryUpload.uploadImage(avatar);
                        } else {
                                System.out.println("No image provided");
                        }

                        if (userService.uploadAvatar(authorizationHeader, urlImage)) {
                                return ResponseEntityUtil.OK("Cập nhật ảnh thành công", null);
                        } else {
                                return ResponseEntityUtil.badRequest("Cập nhật ảnh không thành công");
                        }

                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest("Lỗi " + e.getMessage());
                }

        }

}
