package com.thebugs.back_end.controllers.seller;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.resp.ResponseDataPagination;
import com.thebugs.back_end.services.seller.OrderSellerService;

@RestController
@RequestMapping("/seller/order")
public class OrderSellerManagerController {

    @Autowired
    OrderSellerService orderSellerService;

    private ResponseEntity<ResponseData> createResponse(HttpStatus status,
            boolean success, String message,
            Object data) {
        ResponseData responseData = new ResponseData(success, message, data);
        return ResponseEntity.status(status).body(responseData);
    }

    @GetMapping("")
    public ResponseEntity<ResponseData> getSearchListOrderByCreateAT(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) Date startDate,
            @RequestParam(required = false) Date endDate,
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) Integer statusOrder,
            @RequestParam(defaultValue = "1") int page) {
        try {

            Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
            ResponseDataPagination responseDataPagination = new ResponseDataPagination();
            responseDataPagination.setObjects(
                    orderSellerService.findOrders(authorizationHeader, startDate, endDate, statusOrder, userName,
                            pageable));
            responseDataPagination.setTotalItems(
                    orderSellerService.countOrders(authorizationHeader, startDate, endDate, statusOrder, userName));
            String message = (startDate == null && endDate == null && statusOrder == null
                    && (userName == null || userName.isEmpty()))
                            ? "Load danh sách thành công"
                            : "Tìm kiếm thành công";
            return createResponse(HttpStatus.OK, true, message, responseDataPagination);
        } catch (Exception e) {
            return createResponse(HttpStatus.BAD_REQUEST, false, "Đã xảy ra lỗi: " + e.getMessage(), null);
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
