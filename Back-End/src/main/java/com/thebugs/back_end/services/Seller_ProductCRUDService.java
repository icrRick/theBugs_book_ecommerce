package com.thebugs.back_end.services;

import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.dto.Seller_ProductDTO;
import com.thebugs.back_end.entities.Image;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.mappers.Seller_ProductConverter;
import com.thebugs.back_end.repository.Seller_ProductJPA;

@Service
public class Seller_ProductCRUDService {
    @Autowired
    private Seller_ProductJPA g_ProductJPA;

    @Autowired
    private Seller_ImageService g_ImageService;

    @Autowired
    private Seller_ProductConverter g_ProductConverter;

    public Page<Seller_ProductDTO> getProductsByShopId(Pageable pageable, int shopId) {
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
        return products.map(g_ProductConverter::fromEntityToDTO);
    }

    @SuppressWarnings("finally")
    public HashMap<String, Object> createProduct(Product product,
            List<MultipartFile> realImages) {
        HashMap<String, Object> result = new HashMap<String, Object>();
        StringBuffer message = new StringBuffer();
        Boolean status = true;
        int statusCode = 200;
        List<Image> images = g_ImageService.uploadImage(realImages, product);
        if (images == null) {
            statusCode = 500;
            message.append("ERROR: Lỗi không thể upload hình ảnh");
        } else {
            product.setImages(images);
        }
        try {
            Product savedProduct = g_ProductJPA.save(product);
            if (savedProduct != null && savedProduct.getId() != null) {
                statusCode = 201;
                Seller_ProductDTO data = g_ProductConverter.fromEntityToDTO(savedProduct);
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
    public HashMap<String, Object> updateProduct(Product product,
            List<MultipartFile> realImages) {
        HashMap<String, Object> result = new HashMap<String, Object>();
        StringBuffer message = new StringBuffer();
        Boolean status = true;
        int statusCode = 200;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            if (g_ImageService.removeOldImage(product.getImages())) {
                statusCode = 500;
                message.append("Lỗi không thể xóa ảnh cũ");
            }
        }
        List<Image> images = g_ImageService.uploadImage(realImages, product);
        if (images == null) {
            statusCode = 500;
            addBreakLineForMessage(message, "Lỗi không thể upload hình ảnh");
        } else {
            product.setImages(images);
        }
        try {
            Product savedProduct = g_ProductJPA.save(product);
            if (savedProduct != null && savedProduct.getId() != null) {
                statusCode = 201;
                Seller_ProductDTO data = g_ProductConverter.fromEntityToDTO(savedProduct);
                result.put("data", data);
                addBreakLineForMessage(message, "Thêm sản phẩm thành công");
            } else {
                statusCode = 201;
                status = false;
                addBreakLineForMessage(message, "Xảy ra lỗi trong quá trình lưu sản phẩm");
            }
        } catch (Exception e) {
            statusCode = 500;
            status = false;
            addBreakLineForMessage(message, "Lỗi khi lưu sản phẩm vào cơ sở dữ liệu: " + e.getMessage());
        } finally {
            result.put("status", status);
            result.put("message", message.toString());
            result.put("statusCode", statusCode);
            return result;
        }
    }

    // util function

    private void addBreakLineForMessage(StringBuffer messageO, String messageAdd) {
        if (!messageO.isEmpty()) {
            messageO.append("\n");
        }
        messageO.append(messageAdd);
    }
}
