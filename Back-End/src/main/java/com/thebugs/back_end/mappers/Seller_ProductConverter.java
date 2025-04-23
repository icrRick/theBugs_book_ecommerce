package com.thebugs.back_end.mappers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.thebugs.back_end.beans.Seller_ProductBean;
import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.dto.ImageDTO;
import com.thebugs.back_end.dto.Seller_ProductDTO;
import com.thebugs.back_end.entities.Image;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ProductAuthor;
import com.thebugs.back_end.entities.ProductGenre;
import com.thebugs.back_end.entities.Publisher;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.repository.ImageJPA;
import com.thebugs.back_end.repository.PublisherJPA;
import com.thebugs.back_end.repository.Seller_ProductJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.services.seller.Seller_ProductAuthorService;
import com.thebugs.back_end.services.seller.Seller_ProductGenreService;

@Component
public class Seller_ProductConverter {
    @Autowired
    private ShopJPA g_ShopJPA;
    @Autowired
    private PublisherJPA g_PublisherJPA;
    @Autowired
    private ImageJPA g_ImageJPA;

    @Autowired
    private Seller_ProductGenreService g_ProductGenreService;
    @Autowired
    private Seller_ProductAuthorService g_ProductAuthorService;
    @Autowired
    private Seller_ProductJPA g_ProductJPA;

    public Product fromBeanToEntity(Seller_ProductBean bean) {
        if (bean == null) {
            return null;
        }
        Product product = new Product();

        Shop shop = g_ShopJPA.findById(bean.getShopId()).orElse(null);
        Publisher publisher = g_PublisherJPA.findById(bean.getPublisher_id()).orElse(null);
        List<ProductGenre> productGenres = g_ProductGenreService.getProductGenres(bean.getGenres_id(), product);
        List<ProductAuthor> productAuthors = g_ProductAuthorService.getProductAuthors(bean.getAuthors_id(),
                product);
        Product oldProduct = g_ProductJPA.findProductByProductCodeAndShopId(bean.getShopId(), bean.getProduct_code());
        
        //Còn ảnh cũ thì lấy ảnh cũ
        if (bean.getOldImage() != null && !bean.getOldImage().isEmpty()) {
            List<Image> images = g_ImageJPA.findAllById(bean.getOldImage());
            product.setImages(images);
        }
        product.setId(bean.getId());
        product.setName(bean.getName());
        product.setWeight(bean.getWeight());
        product.setQuantity(bean.getQuantity());
        product.setPrice(bean.getPrice());
        product.setDescription(bean.getDescription());
        product.setShop(shop);
        product.setProductGenres(productGenres);
        product.setProductGenres(productGenres);
        product.setProductAuthors(productAuthors);
        product.setPublisher(publisher);
        product.setActive(bean.getActive());

        // Cho phép shop chỉnh sửa trạng thái active
        product.setActive(bean.getActive());

        if (oldProduct != null) {
            // Không cho phép sửa approve/product_code
            product.setApprove(oldProduct.getApprove());
            product.setProduct_code(oldProduct.getProduct_code());
        } else {
            // Trường hợp tạo mới
            product.setActive(true); // Mặc định active nếu tạo mới
            product.setApprove(null); // Mặc định chưa duyệt
        }

        return product;
    }

    public Seller_ProductDTO fromEntityToDTO(Product product) {
        if (product == null) {
            return null;
        }

        return new Seller_ProductDTO(
                product.getId(),
                product.getProduct_code(),
                product.getName(),
                product.getPrice(),
                product.getQuantity(),
                product.getWeight(),
                product.getDescription(),
                product.isActive(),
                product.getApprove(),
                product.getShop().getId(),
                product.getPublisher().getId(),
                product.getImages() != null ? product.getImages().stream()
                        .map(image -> new ImageDTO(image.getId(), image.getImageName()))
                        .collect(Collectors.toList()) : null,
                product.getProductGenres() != null ? product.getProductGenres().stream()
                        .map(genre -> new GenreDTO(genre.getGenre().getId(), genre.getGenre().getName()))
                        .collect(Collectors.toList()) : null,
                product.getProductAuthors() != null ? product.getProductAuthors().stream()
                        .map(author -> new AuthorDTO(author.getAuthor().getId(), author.getAuthor().getName()))
                        .collect(Collectors.toList()) : null);

    }
}
