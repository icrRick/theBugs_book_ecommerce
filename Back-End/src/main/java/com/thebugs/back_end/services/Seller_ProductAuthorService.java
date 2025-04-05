package com.thebugs.back_end.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Author;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ProductAuthor;
import com.thebugs.back_end.repository.AuthorJPA;

@Service
public class Seller_ProductAuthorService {
    @Autowired
    private AuthorJPA g_AuthorJPA;

    public List<ProductAuthor> getProductAuthors(List<Integer> authors_id, Product product) {
        List<ProductAuthor> productGenres = authors_id.stream()
                .map(author_id -> {
                    ProductAuthor productAuthor = new ProductAuthor();
                    Author author = g_AuthorJPA.findById(author_id).orElse(null);
                    System.out.println("AUTHORID: " + author.getId());
                    productAuthor.setAuthor(author);
                    productAuthor.setProduct(product);
                    return productAuthor;
                }).collect(Collectors.toList());
        return productGenres;
    }
}
