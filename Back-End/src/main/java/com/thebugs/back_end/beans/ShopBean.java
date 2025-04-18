package com.thebugs.back_end.beans;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ShopBean {
    @NotBlank(message = "shop_slug không được để trống")
    @Size(max = 100, message = "Tên người dùng của cửa hàng tối đa 100 ký tự")
    private String shop_slug;

    @NotBlank(message = "Tên cửa hàng không được để trống")
    private String name;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;

    @NotBlank(message = "Số tài khoản không được để trống")
    private String bankOwnerNumber;

    @NotBlank(message = "Tên chủ tài khoản không được để trống")
    private String bankOwnerName;

    @NotBlank(message = "Tên ngân hàng không được để trống")
    private String bankProvideName;
}
