package com.thebugs.back_end.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.Favorite;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.FavoriteService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/user/favorite")
public class FavoriteController {
        @Autowired
        private FavoriteService favoriteService;
        
        @GetMapping("/list")
        public ResponseEntity<ResponseData> getListFavorite(@RequestHeader("Authorization") String authorizationHeader) {
                ResponseData responseData = new ResponseData();
                try {
                        List<ProItemDTO> listFavorite = favoriteService.getListFavorite(authorizationHeader);
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        responseData.setData(listFavorite);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/add-and-remove")
        public ResponseEntity<ResponseData> addAndRemoveFavorite(@RequestHeader("Authorization") String authorizationHeader,  @RequestParam Integer productId) {
                ResponseData responseData = new ResponseData();
                try {
                        Favorite favorite = favoriteService.addAndRemoveFavorite(authorizationHeader, productId);
                        if (favorite != null) {
                                responseData.setStatus(true);
                                responseData.setMessage("Thêm yêu thích thành công");
                                responseData.setData(null);
                        } else {
                                responseData.setStatus(true);
                                responseData.setMessage("Xóa yêu thích thành công");
                                responseData.setData(null);
                        }

                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }


}
