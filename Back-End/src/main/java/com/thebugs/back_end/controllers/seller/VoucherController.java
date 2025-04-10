package com.thebugs.back_end.controllers.seller;

import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.VoucherBean;
import com.thebugs.back_end.dto.VoucherDTO;
import com.thebugs.back_end.entities.Voucher;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.seller.VoucherService;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/seller/voucher")
public class VoucherController {

        @Autowired
        private VoucherService voucherService;

        @GetMapping("/list")
        public ResponseEntity<ResponseData> getList(
                        @RequestHeader("Authorization") String authorizationHeader,
                        @RequestParam(value = "startDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
                        @RequestParam(value = "expireDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date expireDate,
                        @RequestParam(defaultValue = "1") int page) throws ParseException {
                ResponseData responseData = new ResponseData();
                try {

                        Pageable pageable = PageRequest.of(page - 1, 9, Sort.by(Sort.Order.desc("id")));

                        ArrayList<VoucherDTO> promotions = voucherService.findByShopAndDateRange(
                                        authorizationHeader, startDate, expireDate, pageable);
                        int total = voucherService.total(authorizationHeader, startDate, expireDate);
                        Map<String, Object> response = Map.of(
                                        "arrayList", promotions,
                                        "totalItems", total);
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy danh sách thành công");
                        responseData.setData(response);
                        return ResponseEntity.ok(responseData);
                } catch (IllegalArgumentException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);

                }

        }

        @PostMapping("/add")
        public ResponseEntity<ResponseData> addVoucher(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody VoucherBean voucherBean) {
                ResponseData responseData = new ResponseData();
                try {
                        Voucher voucher = new Voucher();
                        voucher.setCodeVoucher(voucherBean.getCodeVoucher().toUpperCase());
                        voucher.setQuantity(voucherBean.getQuantity());
                        voucher.setCreateAt(new Date());
                        voucher.setStartDate(voucherBean.getStartDate());
                        voucher.setExpireDate(voucherBean.getExpireDate());
                        voucher.setMaxDiscount(voucherBean.getMaxDiscount());
                        voucher.setMinTotalOrder(voucherBean.getMinTotalOrder());
                        voucher.setDiscountPercentage(voucherBean.getDiscountPercentage());
                        voucher.setDescription(voucherBean.getDescription());
                        voucher.setActive(voucherBean.getActive());
                        VoucherDTO voucherDTO = voucherService.saveVoucher(authorizationHeader, voucher);
                        responseData.setStatus(true);
                        responseData.setMessage("Thêm thành công");
                        responseData.setData(voucherDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/update")
        public ResponseEntity<ResponseData> updateVoucher(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestBody VoucherBean voucherBean) {
                ResponseData responseData = new ResponseData();
                try {
                        Voucher voucher = voucherService.getVoucherById(voucherBean.getId());
                        voucher.setCodeVoucher(voucherBean.getCodeVoucher().toUpperCase());
                        voucher.setQuantity(voucherBean.getQuantity());
                        voucher.setStartDate(voucherBean.getStartDate());
                        voucher.setExpireDate(voucherBean.getExpireDate());
                        voucher.setMaxDiscount(voucherBean.getMaxDiscount());
                        voucher.setMinTotalOrder(voucherBean.getMinTotalOrder());
                        voucher.setDiscountPercentage(voucherBean.getDiscountPercentage());
                        voucher.setDescription(voucherBean.getDescription());
                        voucher.setActive(voucherBean.getActive());
                        VoucherDTO voucherDTO = voucherService.saveVoucher(authorizationHeader, voucher);
                        responseData.setStatus(true);
                        responseData.setMessage("Cập nhật thành công");
                        responseData.setData(voucherDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> deleteVoucher(@RequestParam Integer id) {
                ResponseData responseData = new ResponseData();
                try {
                        boolean delete = voucherService.deleteVoucher(id);
                        if (delete) {
                                responseData.setStatus(true);
                                responseData.setMessage("Xóa thành công");
                                responseData.setData(null);
                                return ResponseEntity.ok(responseData);
                        } else {
                                responseData.setStatus(false);
                                responseData.setMessage("Xóa thất bại");
                                responseData.setData(null);
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                        }

                     
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @GetMapping("/getvoucherId")
        public ResponseEntity<ResponseData> getVoucher(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestParam Integer id) {
                ResponseData responseData = new ResponseData();
                try {
                        VoucherDTO voucherDTO = voucherService.getVoucherIdByShopId(id, authorizationHeader);
                        if (voucherDTO != null) {
                                responseData.setStatus(true);
                                responseData.setMessage("Lấy thành công thành công");
                                responseData.setData(voucherDTO);
                        } else {
                                responseData.setStatus(false);
                                responseData.setMessage("Lấy thông tin thất bại thất bại");
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
