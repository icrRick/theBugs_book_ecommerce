package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.*;
import com.thebugs.back_end.repository.AuthorJPA;
import com.thebugs.back_end.repository.GenreJPA;
import com.thebugs.back_end.repository.ProductHomeRepository;
import com.thebugs.back_end.repository.PromotionProductJPA;
import com.thebugs.back_end.repository.ShopJPA;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProductHomeService {

        @Autowired
        private ProductHomeRepository productRepository;

        @Autowired
        private AuthorJPA authorRepository;

        @Autowired
        private GenreJPA genreRepository;

        @Autowired
        private PromotionProductJPA promotionRepository;

        @Autowired
        private ShopJPA shopRepository;

        public List<HomeProductDTO> getProducts(String filter, Pageable pageable) {
                List<HomeProductDTO> products;
                LocalDate currentDate = LocalDate.now();
                LocalDate thirtyDaysAgo = currentDate.minusDays(30);

                if (filter != null) {
                        switch (filter.toLowerCase()) {
                                case "popular":
                                        products = productRepository.findPopularProducts(pageable, thirtyDaysAgo);
                                        break;
                                case "new":
                                        products = productRepository.findNewProducts(pageable, thirtyDaysAgo);
                                        break;
                                case "sale":
                                        products = productRepository.findSaleProducts(pageable, thirtyDaysAgo);
                                        break;
                                default:
                                        products = productRepository.getHomeProducts(pageable, thirtyDaysAgo)
                                                        .getContent();
                                        break;
                        }
                } else {
                        products = productRepository.getHomeProducts(pageable, thirtyDaysAgo).getContent();
                }
                return products;
        }

        public List<HomeAuthorDTO> getFeaturedAuthors() {
                Pageable pageable = PageRequest.of(0, 6);
                List<HomeAuthorDTO> authors = authorRepository.findFeaturedAuthors(pageable);
                return authors;
        }

        public List<HomeGenreDTO> getGenres() {
                Pageable pageable = PageRequest.of(0, 12);
                List<HomeGenreDTO> genres = genreRepository.findTopGenres(pageable);
                return genres;
        }

        public List<HomePromotionDTO> getActivePromotions() {
                List<HomePromotionDTO> promotions = promotionRepository.getActivePromotions();
                if (promotions.isEmpty()) {
                        throw new IllegalArgumentException("Không tìm thấy khuyến mãi đang hoạt động");
                }
                return promotions;
        }

        public List<FlashSaleShopDTO> getFlashSaleShops() {
                List<FlashSaleShopDTO> shops = shopRepository.findFlashSaleShops();
                if (shops.isEmpty()) {
                        throw new IllegalArgumentException("Không tìm thấy cửa hàng flash sale");
                }
                return shops;
        }

}