package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.Data;

@Data
public class ReviewDTO {
    private Integer id;
    private Date date;
    private double rating;
    private String content;
    private String reply;
    private Date replyAt;
    private Child_UserReviewDTO user;
    private Child_ShopReviewDTO shop;

    public ReviewDTO(Integer id, Date date, Double rating, String content, String reply,
            Date replyAt, String userReviewName, String userReviewAvatar, String shopReviewName,
            String shopReviewLogo, Boolean shopReivewVerify) {
        this.shop = new Child_ShopReviewDTO(shopReviewName, shopReviewLogo, shopReivewVerify);
        this.user = new Child_UserReviewDTO(userReviewName, userReviewAvatar);
        this.id = id;
        this.date = date;
        this.rating = rating;
        this.content = content;
        this.reply = reply;
        this.replyAt = replyAt;
    }
}