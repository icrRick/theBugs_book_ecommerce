package com.thebugs.back_end.beans;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReviewBean {
    private Integer orderItemId;
    @NotBlank(message = "Nội dung đánh giá không được để trống")
    @Size(min = 3, message = "Nội dung đánh giá phải có ít nhất 3 ký tự")
    private String content;
    @Min(value = 1, message = "Điểm đánh giá tối thiểu là 1")
    @Max(value = 5, message = "Điểm đánh giá tối đa là 5")
    private Double rating;

}
