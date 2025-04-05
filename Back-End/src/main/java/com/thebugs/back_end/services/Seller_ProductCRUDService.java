package com.thebugs.back_end.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.dto.SellerProductDTO;
import com.thebugs.back_end.entities.Author;
import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.entities.Image;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ProductAuthor;
import com.thebugs.back_end.entities.ProductGenre;
import com.thebugs.back_end.entities.Publisher;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.repository.AuthorJPA;
import com.thebugs.back_end.repository.GenreJPA;
import com.thebugs.back_end.repository.ImageJPA;
import com.thebugs.back_end.repository.PublisherJPA;
import com.thebugs.back_end.repository.Seller_ProductJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.utils.CloudinaryUpload;

@Service
public class Seller_ProductCRUDService {
    @Autowired
    private Seller_ProductJPA g_ProductJPA;
    @Autowired
    private ImageJPA g_ImageJPA;
    @Autowired
    private ShopJPA g_ShopJPA;
    @Autowired
    private GenreJPA g_GenreJPA;
    @Autowired
    private AuthorJPA g_AuthorJPA;
    @Autowired
    private PublisherJPA g_PublisherJPA;

    public Page<SellerProductDTO> getProductsByShopId(Pageable pageable, int shopId) {
        Page<Product> products = g_ProductJPA.findAllByShopId(shopId, pageable);
        for (Product product : products) {
            System.out.println("Product Image: ");
            if (!product.getImages().isEmpty()) {
                System.out.println("ImageID: ");
                System.out.println(product.getImages().getFirst().getId());
                System.out.println("ImageID: ");
                System.out.println(product.getImages().getFirst().getImageName());
            }
        }
        return products.map(SellerProductDTO::fromEntityToDTO);
    }

    private Product fromDTOtoEntity(SellerProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setWeight(productDTO.getWeight());
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());
        product.setActive(productDTO.getActive());
        product.setDescription(productDTO.getDescription());

        // Cập nhật mối quan hệ với Shop
        Shop shop = g_ShopJPA.findById(productDTO.getShopId()).orElse(null);
        product.setShop(shop);

        // Cập nhật mối quan hệ với Genre
        if (productDTO.getGenres_id() != null) {
            List<ProductGenre> productGenres = productDTO.getGenres_id().stream()
                    .map(ID_GenreDTO -> {
                        ProductGenre productGenre = new ProductGenre();
                        Genre genre = g_GenreJPA.findById(ID_GenreDTO).orElse(null);
                        productGenre.setProduct(product);
                        productGenre.setGenre(genre);
                        return productGenre;
                    }).collect(Collectors.toList());
            product.setProductGenres(productGenres);
        }

        // Cập nhật mối quan hệ với Author
        if (productDTO.getAuthors_id() != null) {
            List<ProductAuthor> productAuthors = productDTO.getAuthors_id().stream()
                    .map(ID_AuthorDTO -> {
                        ProductAuthor productAuthor = new ProductAuthor();
                        Author author = g_AuthorJPA.findById(ID_AuthorDTO).orElse(null);
                        productAuthor.setProduct(product);
                        productAuthor.setAuthor(author);
                        return productAuthor;
                    }).collect(Collectors.toList());
            product.setProductAuthors(productAuthors);
        }

        Publisher publisher = g_PublisherJPA.findById(productDTO.getPublisher_id()).orElse(null);
        product.setPublisher(publisher);

        return product;
    }

    private List<Image> uploadImage(List<MultipartFile> realImages, Product product) {
        List<Image> images = new ArrayList();
        for (MultipartFile realImage : realImages) {
            try {
                Image image = new Image();
                String url = CloudinaryUpload.uploadImage(realImage);
                image.setImageName(url);
                image.setProduct(product);
                if (!url.isEmpty()) {
                    Image savedImage = g_ImageJPA.save(image);
                    images.add(savedImage);
                } else {
                    return null;
                }
            } catch (Exception e) {
                System.out.println("Lỗi Image nè: " + e.getMessage());
            }
        }

        return images;
    }

    private void addBreakLineForMessage(StringBuffer messageO, String messageAdd) {
        if (!messageO.isEmpty()) {
            messageO.append("\n");
        }
        messageO.append(messageAdd);
    }

    @SuppressWarnings("finally")
    public HashMap<String, Object> createProduct(SellerProductDTO productDTO,
            List<MultipartFile> realImages) {
        Product product = fromDTOtoEntity(productDTO);
        HashMap<String, Object> result = new HashMap<String, Object>();
        StringBuffer message = new StringBuffer();
        Boolean status = true;
        int statusCode = 200;
        try {
            Product savedProduct = g_ProductJPA.save(product);
            if (savedProduct != null && savedProduct.getId() != null) {
                statusCode = 201;
                if (realImages != null && !realImages.isEmpty()) {
                    List<Image> images = uploadImage(realImages, savedProduct);
                    if (images == null) {
                        statusCode = 500;
                        message.append("ERROR: Lỗi không thể upload hình ảnh");
                    }
                    product.setImages(images);
                }
                SellerProductDTO data = SellerProductDTO.fromEntityToDTO(savedProduct);
                result.put("data", data);
                addBreakLineForMessage(message, "Thêm sản phẩm thành công");

            } else {
                statusCode = 201;
                status = false;
                addBreakLineForMessage(message, "ERROR: Xảy ra lỗi trong quá trình lưu sản phẩm");
            }
        } catch (Exception e) {
            statusCode = 500;
            status = false;
            addBreakLineForMessage(message, "ERROR: Lỗi khi lưu sản phẩm vào cơ sở dữ liệu: " + e.getMessage());
        } finally {
            result.put("status", status);
            result.put("message", message.toString());
            result.put("statusCode", statusCode);
            return result;
        }
    }
    @SuppressWarnings("finally")
    public HashMap<String, Object> updateProduct(SellerProductDTO productDTO,
            List<MultipartFile> realImages) {
        Product product = fromDTOtoEntity(productDTO);
        HashMap<String, Object> result = new HashMap<String, Object>();
        StringBuffer message = new StringBuffer();
        Boolean status = true;
        int statusCode = 200;
        try {
            Product savedProduct = g_ProductJPA.save(product);
            if (savedProduct != null && savedProduct.getId() != null) {
                statusCode = 201;
                if (realImages != null && !realImages.isEmpty()) {
                    List<Image> images = uploadImage(realImages, savedProduct);
                    if (images == null) {
                        statusCode = 500;
                        message.append("ERROR: Lỗi không thể upload hình ảnh");
                    }
                    product.setImages(images);
                }
                SellerProductDTO data = SellerProductDTO.fromEntityToDTO(savedProduct);
                result.put("data", data);
                addBreakLineForMessage(message, "Thêm sản phẩm thành công");

            } else {
                statusCode = 201;
                status = false;
                addBreakLineForMessage(message, "ERROR: Xảy ra lỗi trong quá trình lưu sản phẩm");
            }
        } catch (Exception e) {
            statusCode = 500;
            status = false;
            addBreakLineForMessage(message, "ERROR: Lỗi khi lưu sản phẩm vào cơ sở dữ liệu: " + e.getMessage());
        } finally {
            result.put("status", status);
            result.put("message", message.toString());
            result.put("statusCode", statusCode);
            return result;
        }
    }
}
