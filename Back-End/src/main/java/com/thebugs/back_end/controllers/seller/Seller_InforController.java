package com.thebugs.back_end.controllers.seller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.beans.ShopInfor_Bean;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.seller.Seller_ImageService;
import com.thebugs.back_end.services.seller.Seller_ShopInforService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;

@RestController
@RequestMapping("/api/seller")
public class Seller_InforController {
  @Autowired
  private Seller_ShopInforService g_ShopInforService;
  @Autowired
  private Seller_ShopInforService g_SellerInforService;

  @GetMapping("/me")
  public ResponseEntity<ResponseData> getSellerInfor(@RequestHeader("Authorization") String authorizationHeader) {
    System.out.println("Controller Seller_InforController: ");
    ResponseData responseData = g_SellerInforService.getShopInfor(authorizationHeader);
    return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
  }

  @PutMapping("/store")
  public ResponseEntity<?> updateStore(
      @RequestHeader("Authorization") String authorizationHeader,
      @RequestPart("shopInfo") ShopInfor_Bean shopInfo,
      @RequestPart(value = "logo", required = false) MultipartFile logo,
      @RequestPart(value = "banner", required = false) MultipartFile banner) {
    // xử lý ở đây
    ResponseData responseData = g_ShopInforService.updateShopInfor(authorizationHeader, shopInfo, logo, banner);
    return ResponseEntity.status(HttpStatus.valueOf(responseData.getStatusCode())).body(responseData);
  }
}
