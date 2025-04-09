package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.Data;

@Data
public class ReviewDTO {
    private Integer id;
    private String content;
    private String reviewerName;
    private String avatar;
    private Integer rate;
    private Date createdAt;

    public ReviewDTO(Integer id, String content, String reviewerName, String avatar, Integer rate, Date createdAt) {
        this.id = id;
        this.content = content;
        this.reviewerName = reviewerName;
        this.avatar = avatar;
        this.rate = rate;
        this.createdAt = createdAt;
    }

}
