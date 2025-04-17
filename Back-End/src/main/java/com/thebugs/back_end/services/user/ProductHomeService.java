package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.HomeAuthorDTO;
import com.thebugs.back_end.dto.HomeGenreDTO;
import com.thebugs.back_end.dto.HomeProductDTO;
import com.thebugs.back_end.dto.HomePromotionDTO;
import com.thebugs.back_end.repository.AuthorJPA;
import com.thebugs.back_end.repository.GenreJPA;
import com.thebugs.back_end.repository.ProductHomeRepository;
import com.thebugs.back_end.repository.PromotionProductJPA;
import com.thebugs.back_end.repository.ShopJPA;

import com.thebugs.back_end.dto.FlashSaleShopDTO;
import java.util.List;
import java.util.stream.Collectors;

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
                products = productRepository.getHomeProducts(pageable).getContent();

                if (filter != null) {
                        switch (filter.toLowerCase()) {
                                case "popular":
                                        products = products.stream()
                                                        .filter(p -> p.getRate() >= 4.0)
                                                        .collect(Collectors.toList());
                                        break;
                                case "new":
                                        products = products.stream()
                                                        .filter(p -> Boolean.TRUE.equals(p.getIsNew()))
                                                        .collect(Collectors.toList());
                                        break;
                                case "sale":
                                        products = products.stream()
                                                        .filter(p -> p.getPromotionValue() != null
                                                                        && p.getPromotionValue() > 0)
                                                        .collect(Collectors.toList());
                                        break;
                                default:
                                        break;
                        }
                }

                if (products.isEmpty()) {
                        throw new IllegalArgumentException("Không tìm thấy sản phẩm cho bộ lọc: " + filter);
                }
                return products;
        }

        public List<HomeAuthorDTO> getFeaturedAuthors() {
                List<HomeAuthorDTO> authors = authorRepository.findFeaturedAuthors();
                if (authors.isEmpty()) {
                        throw new IllegalArgumentException("Không tìm thấy tác giả nổi bật");
                }
                return authors;
        }

        public List<HomeGenreDTO> getGenres() {
                List<HomeGenreDTO> genres = genreRepository.findAllGenres();
                if (genres.isEmpty()) {
                        throw new IllegalArgumentException("Không tìm thấy danh mục sách");
                }
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
