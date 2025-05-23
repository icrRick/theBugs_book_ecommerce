package com.thebugs.back_end.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetAllListGenresDTO {
    private Integer id;
    private String name;
    private List<Integer> productIds;
}
