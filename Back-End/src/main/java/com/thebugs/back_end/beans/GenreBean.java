package com.thebugs.back_end.beans;

import java.io.Serializable;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GenreBean implements Serializable{

        @NotBlank(message = "Tên thể loại không được bỏ trống")
        @Pattern(regexp = "^[^\\d]+$", message = "Tên thể loại không được chứa ký tự số")
        private String name;
        private MultipartFile image;
}
