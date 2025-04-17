package com.thebugs.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class HomeGenreDTO {
    private Integer id;
    private String name;
    private String urlImage;
    private Integer count;

}
