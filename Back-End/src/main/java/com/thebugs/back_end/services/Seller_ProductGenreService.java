package com.thebugs.back_end.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ProductGenre;
import com.thebugs.back_end.repository.GenreJPA;
import com.thebugs.back_end.repository.ProductGenreJPA;

@Service
public class Seller_ProductGenreService {
    @Autowired
    private ProductGenreJPA g_ProductGenreJPA;
    @Autowired
    private GenreJPA g_GenreJPA;

    public List<ProductGenre> createProductGenres(List<Integer> genres_id, Product product) {
        List<ProductGenre> productGenres = new ArrayList();
        for (Integer genre_id : genres_id) {
            ProductGenre productGenre = new ProductGenre();
            productGenre.setId(genre_id);
            productGenre.setProduct(product);
            productGenres.add(productGenre);
        }
        return g_ProductGenreJPA.saveAll(productGenres);
    }

    public List<ProductGenre> getProductGenres(List<Integer> genres_id, Product product) {
        List<ProductGenre> productGenres = genres_id.stream()
                .map(genre_id -> {
                    ProductGenre productGenre = new ProductGenre();
                    Genre genre = g_GenreJPA.findById(genre_id).orElse(null);
                    // productGenre.setProduct(product);
                    productGenre.setGenre(genre);
                    productGenre.setProduct(product);
                    return productGenre;
                }).collect(Collectors.toList());
        return productGenres;
    }

}
