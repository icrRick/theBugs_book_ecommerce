package com.thebugs.back_end.dto;

import java.util.List;

import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.Publisher;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PublisherDTO {
        private Integer id;
        private String name;
}
