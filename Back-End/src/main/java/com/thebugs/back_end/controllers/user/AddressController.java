package com.thebugs.back_end.controllers.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.AddressBean;
import com.thebugs.back_end.dto.AddressDTO;
import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.AddressService;
import com.thebugs.back_end.services.user.UserService;

import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/user/address")
public class AddressController {

        private final AddressService addressService;
        private final UserService userService;

        public AddressController(AddressService addressService, UserService userService) {
                this.addressService = addressService;
                this.userService = userService;
        }

        @GetMapping("/list")
        public ResponseEntity<ResponseData> getListAddressByUser(
                        @RequestHeader("Authorization") String authorizationHeader) {
                ResponseData responseData = new ResponseData();
                try {
                        User user = userService.getUserToken(authorizationHeader);
                        ArrayList<AddressDTO> addressDTOs = addressService.getListAddressByUser(user);
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        responseData.setData(addressDTOs);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }

        @PostMapping("/save")
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
                        User user = userService.getUserToken(authorizationHeader);
                        address.setId(addressBean.getId() != null ? addressBean.getId() : null);
                        address.setFullName(addressBean.getFullName());
                        address.setPhone(addressBean.getPhone());
                        address.setProvinceId(addressBean.getProvinceId());
                        address.setDistrictId(addressBean.getDistrictId());
                        address.setWardId(addressBean.getWardId());
                        address.setStreet(addressBean.getStreet());
                        address.setUser(user);
                        AddressDTO addressDTO = addressService.saveAddress(address);
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

        @GetMapping("/detail")
        public ResponseEntity<ResponseData> getAddressInfo(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestParam Integer addressId) {
                ResponseData responseData = new ResponseData();
                try {
                        User user = userService.getUserToken(authorizationHeader);
                        AddressDTO addressDTO = addressService.getAddressDTOById(addressId,
                                        user.getId());
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy thông tin địa chỉ thành công");
                        responseData.setData(addressDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> deleteAddress(@RequestHeader("Authorization") String authorizationHeader,
                        @RequestParam Integer id) {
                ResponseData responseData = new ResponseData();
                try {
                        User user = userService.getUserToken(authorizationHeader);
                        boolean check = addressService.deleteAddress(user.getAddresses(), id);
                        if (check) {
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

        @GetMapping("/default")
        public ResponseEntity<ResponseData> getAddressDefault(
                        @RequestHeader("Authorization") String authorizationHeader,
                        @RequestParam(required = false) Integer addressId) {
                ResponseData responseData = new ResponseData();
                try {
                        AddressDTO addressDTO = addressService.getDefault(addressId, authorizationHeader);
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy địa chỉ thành công");
                        responseData.setData(addressDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }
        @GetMapping("/defaultShopAddress")
        public ResponseEntity<ResponseData> defaultShopAddress(
                        @RequestParam Integer shopId) {
                ResponseData responseData = new ResponseData();
                try {
                        AddressDTO addressDTO = addressService.getAddressShopId(shopId);
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy địa chỉ shop thành công");
                        responseData.setData(addressDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

}
