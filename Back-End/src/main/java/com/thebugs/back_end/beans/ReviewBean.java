package com.thebugs.back_end.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReviewBean {
    private Integer orderItemId;
    private String content;
    private Double rating;

}
