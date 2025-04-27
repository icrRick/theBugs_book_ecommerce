package com.thebugs.back_end.beans;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FillterShopPageBean {
    private String productName;
    private List<Integer> genresIntegers;
    private List<Integer> authorsIntegers;
    private Double minPrice;
    private Double maxPrice;   
    private String sortType;
   }
