package com.thebugs.back_end.beans;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Seller_ProductBean {
    private Integer id;
    private String product_code;
    private List<Integer> oldImage;

    @NotBlank(message = "Tên sản phẩm không được bỏ trống")
    private String name;

    @NotNull(message = "Giá sản phẩm không được bỏ trống")
    @Min(value = 1, message = "Giá sản phẩm phải lớn hơn hoặc bằng 0")
    private Double price;

    @NotNull(message = "Số lượng sản phẩm không được bỏ trống")
    @Min(value = 1, message = "Số lượng sản phẩm phải lớn hơn hoặc bằng 0")
    private int quantity;

    @NotNull(message = "Trọng lượng sản phẩm không được bỏ trống")
    @Min(value = 1, message = "Trọng lượng sản phẩm phải lớn hơn hoặc bằng 0")
    private Double weight;

    @NotBlank(message = "Mô tả sản phẩm không được bỏ trống")
    private String description;

    private Integer shopId;

    @NotNull(message = "Publisher ID không được bỏ trống")
    private Integer publisher_id;

    @Size(min = 1, message = "Danh sách hình ảnh không được bỏ trống")
    private List<MultipartFile> images;

    @Size(min = 1, message = "Danh sách thể loại không được bỏ trống")
    private List<Integer> genres_id;

    @Size(min = 1, message = "Danh sách tác giả không được bỏ trống")
    private List<Integer> authors_id;

    private Boolean active;
    

    @Override
    public String toString() {
        return "Seller_ProductBean{" +
                "name='" + name + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", weight=" + weight +
                ", description='" + description + '\'' +
                ", shopId=" + shopId +
                ", publisher=" + publisher_id +
                ", images=" + (images != null ? images.size() : 0) + " images" +
                ", genres=" + genres_id +
                ", authors=" + authors_id +
                '}';
    }
}
