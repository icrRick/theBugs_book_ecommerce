package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.CartItemService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/user/cart")
public class CartController {

    @Autowired
    private CartItemService cartItemService;

    @GetMapping("/getCartItems")
    public ResponseEntity<ResponseData> getCartItems(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            return ResponseEntityUtil.OK("Lấy danh sách sản phẩm trong giỏ hàng thành công!",
                    cartItemService.getCartItems(authorizationHeader));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng! " + e.getMessage());
        }
    }

    @PostMapping("/saveCartItem")
    public ResponseEntity<ResponseData> saveCartItem(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam Integer productId, @RequestParam Integer quantity) {
        ResponseData responseData = new ResponseData();
        try {
            boolean check = cartItemService.saveCartItem(authorizationHeader, productId, quantity);
            if (check == false) {
                responseData.setStatus(false);
                responseData.setMessage("Lỗi khi thêm sản phẩm vào giỏ hàng! ");
                responseData.setData(null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
            }
            responseData.setStatus(true);
            responseData.setMessage("Them thành công!");
            responseData.setData(null);
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setStatus(false);
            responseData.setMessage("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng! " + e.getMessage());
            responseData.setData(null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }

    @PostMapping("/saveCartItemProductCode")
    public ResponseEntity<ResponseData> saveCartItem1(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam String productCode, @RequestParam Integer quantity) {

        try {
            boolean check = cartItemService.saveCartItemProductCode(authorizationHeader, productCode, quantity);
            if (check == false) {
                return ResponseEntityUtil.badRequest("Lỗi ");
            }

            return ResponseEntityUtil.OK("Thêm vào giỏ hàng thành công", null);
        } catch (Exception e) {

            return ResponseEntityUtil.badRequest(e.getMessage());
        }
    }

    @PostMapping("/deleteCartItem")
    public ResponseEntity<ResponseData> deleteCartItem(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam Integer productId) {
        ResponseData responseData = new ResponseData();
        try {
            boolean check = cartItemService.deleteCartItem(authorizationHeader, productId);
            if (check == false) {
                responseData.setStatus(false);
                responseData.setMessage("Xoa that bai! ");
                responseData.setData(null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
            }
            responseData.setStatus(true);
            responseData.setMessage("xoa thành công!");
            responseData.setData(null);
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setStatus(false);
            responseData.setMessage("Lỗi! " + e.getMessage());
            responseData.setData(null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }

    @PostMapping("/repurchaseCartItem")
    public ResponseEntity<ResponseData> repurchaseCartItem(@RequestParam Integer orderId) {
        try {
            boolean check = cartItemService.repurchaseCartItem(orderId);
            if (check == false) {
                return ResponseEntityUtil.badRequest("Lỗi ");
            }
            return ResponseEntityUtil.OK("Thêm vào giỏ hàng thành công", null);
        } catch (Exception e) {
          
            return ResponseEntityUtil.badRequest("Lỗi! " + e.getMessage());
        }
    }

}
