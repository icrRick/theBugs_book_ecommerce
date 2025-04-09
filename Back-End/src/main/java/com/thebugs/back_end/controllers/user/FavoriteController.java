package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/user/favorite")
public class FavoriteController {

        @GetMapping("/list")
        public ResponseEntity<ResponseData> getListFavorite(@RequestParam String param) {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        responseData.setData(null);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/add")
        public ResponseEntity<ResponseData> addFavorite(@RequestParam String param) {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        responseData.setData(null);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> deleteFavorite(@RequestParam String param) {
                ResponseData responseData = new ResponseData();
                try {
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        responseData.setData(null);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

}
