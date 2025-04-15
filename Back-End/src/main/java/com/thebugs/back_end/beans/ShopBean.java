package com.thebugs.back_end.beans;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ShopBean {
    private Integer id;
    private String shop_slug;
    private String name;
    private String description;
    private String accoutNumber;
    private String accoutName;
    private String bankName;
    private MultipartFile image;

}
