package com.thebugs.back_end.controllers.seller;

import java.sql.Date;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.OrderStatusBean;
import com.thebugs.back_end.dto.OrderDTO;

import com.thebugs.back_end.mappers.AuthorMapper;
import com.thebugs.back_end.mappers.OrderMapper;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.resp.ResponseDataPagination;
import com.thebugs.back_end.services.seller.OrderSellerService;
import com.thebugs.back_end.services.user.UserService;

@RestController
@RequestMapping("/seller/order")
public class OrderSellerManagerController {

    @Autowired
    OrderSellerService orderSellerService;
    @Autowired
    OrderSellerService orderSellerService1;
    @Autowired
    UserService userService;
    @Autowired
    OrderMapper orderMapper;
    @Autowired
    AuthorMapper authorMapper;

    private ResponseEntity<ResponseData> createResponse(HttpStatus status,
            boolean success, String message,
            Object data) {
        ResponseData responseData = new ResponseData(success, message, data);
        return ResponseEntity.status(status).body(responseData);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseData> getAllListOrder(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            ResponseDataPagination responseDataPagination = new ResponseDataPagination();
            responseDataPagination.setObjects(orderSellerService.getAllOrders(page, size, authorizationHeader));
            responseDataPagination.setTotalItems(orderSellerService.getTotalItems(authorizationHeader));
            return createResponse(HttpStatus.OK, true, "Load danh sach thanh cong",
                    responseDataPagination);
        } catch (Exception e) {
            return createResponse(HttpStatus.BAD_REQUEST, false, "Da xay ra loi" +
                    e.getMessage(), null);
        }

    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ResponseData> showDetailOrder(@PathVariable int orderId,
            @RequestHeader("Authorization") String authorizationHeader) {
        ResponseData responseData = new ResponseData();
        try {

            responseData.setStatus(true);
            responseData.setMessage("Lấy thông tin chi tiết đơn hàng thành công");
            responseData.setData(orderSellerService.getOrderDetail(orderId, authorizationHeader));
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setStatus(false);
            responseData.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseData> getSearchListOrderByCreateAT(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) String startDate, // Đổi thành String
            @RequestParam(required = false) String endDate, // Đổi thành String
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) Integer statusOrder,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date start = startDate != null ? new java.sql.Date(sdf.parse(startDate).getTime()) : null;
            Date end = endDate != null ? new java.sql.Date(sdf.parse(endDate).getTime() + 86399999) : null;
            ResponseDataPagination responseDataPagination = new ResponseDataPagination();
            responseDataPagination.setObjects(
                    orderSellerService.searchSellerOrder(authorizationHeader, start, end, statusOrder, userName,
                            page, size));
            responseDataPagination.setTotalItems(
                    orderSellerService.getTotalItemsBySearch(authorizationHeader, start, end, statusOrder, userName));
            return createResponse(HttpStatus.OK, true, "Tìm kiếm thành công", responseDataPagination);
        } catch (Exception e) {
            return createResponse(HttpStatus.BAD_REQUEST, false, "Đã xảy ra lỗi: " + e.getMessage(), null);
        }
    }

    @PutMapping("/update/{orderId}")
    public ResponseEntity<ResponseData> updateOrderStatus(@PathVariable int orderId,
            @RequestBody OrderStatusBean orderStatusBean,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {

            OrderDTO updateOrderStatus = orderSellerService.updateStatusOrder(authorizationHeader, orderId,
                    orderStatusBean.getOrderStatus(),
                    orderStatusBean.getCancelReason());

            return ResponseEntity.ok()
                    .body(new ResponseData(true, "Cập nhật trạng thái thành công", updateOrderStatus));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseData(false, ex.getMessage(), null));
        }
    }

}
