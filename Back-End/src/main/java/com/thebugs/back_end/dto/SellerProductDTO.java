package com.thebugs.back_end.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.mappers.IrRick_SellerMapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerProductDTO {
        private Integer id;
        private String name;
        private Double price;
        private int quantity;
        private Double weight;
        private String description;
        private Boolean active;
        private Integer shopId;
        private Integer publisher_id;
        private List<ImageDTO> images;
        private List<Integer> genres_id;
        private List<Integer> authors_id;

        public static SellerProductDTO fromEntityToDTO(Product product) {
                if (product == null) {
                        return null;
                }

                return new SellerProductDTO(
                                product.getId(),
                                product.getName(),
                                product.getPrice(),
                                product.getQuantity(),
                                product.getWeight(),
                                product.getDescription(),
                                product.getActive(),
                                product.getShop().getId(),
                                product.getPublisher().getId(),
                                product.getImages() != null ? product.getImages().stream()
                                                .map(image -> new ImageDTO(image.getId(), image.getImageName()))
                                                .collect(Collectors.toList()) : null,
                                product.getProductGenres() != null ? product.getProductGenres().stream()
                                                .map(genre -> genre.getGenre().getId())
                                                .collect(Collectors.toList()) : null,
                                product.getProductAuthors() != null ? product.getProductAuthors().stream()
                                                .map(author -> author.getAuthor().getId())
                                                .collect(Collectors.toList()) : null);

        }
}
