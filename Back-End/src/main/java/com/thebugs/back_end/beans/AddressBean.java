package com.thebugs.back_end.beans;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class AddressBean {
        private Integer id;
        @NotBlank(message = "Họ tên không được bỏ trống")
        private String fullName;
        @NotBlank(message = "Số điện thoại không được bỏ trống")
        private String phone;
        @NotNull(message = "Tỉnh/Thành phố không được bỏ trống")
        private Integer provinceId;
        @NotNull(message = "Quận huyện không được bỏ trống")
        private Integer districtId;
        @NotNull(message = "Phường xã không được bỏ trống")
        private Integer wardId;
        @NotBlank(message = "Địa chỉ không được bỏ trống")
        private String street;
}
