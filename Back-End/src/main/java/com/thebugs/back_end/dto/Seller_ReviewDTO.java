package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Seller_ReviewDTO {
    private Integer id;
    private double rate;
    private String content;
    private String reply;
    private Date created_at;
    private Date reply_at;
    private Date updated_at;

    private String customerFullName;
    private String customerAvatar;

    private String productCode;
    private String productName;
    private String productImage;


}
