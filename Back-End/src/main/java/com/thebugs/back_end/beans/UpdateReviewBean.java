package com.thebugs.back_end.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateReviewBean {
    private Integer orderItemId;
    private Integer id;
    private String content;
    private Double rating;
}
