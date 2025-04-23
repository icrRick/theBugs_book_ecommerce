package com.thebugs.back_end.services.seller;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

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
import com.thebugs.back_end.utils.ColorUtil;
import com.thebugs.back_end.utils.IrRickUtil;

@Service
public class Seller_ProductCRUDService {
    @Autowired
    private Seller_ProductJPA g_ProductJPA;

    @Autowired
    private Seller_ImageService g_ImageService;

    @Autowired
    private Seller_ProductConverter g_ProductConverter;

    public Page<Seller_ProductDTO> getProductsByShopId(int shopId, String keyword, String sort, Pageable pageable) {
        ColorUtil.print(ColorUtil.RED, "Start JPA GetProduct");
        String cleaned = keyword.replaceAll("\\s+", "");
        String keywordPattern = Arrays.stream(cleaned.split(""))
                .map(ch -> "%" + ch)
                .collect(Collectors.joining("")) + "%";
        Page<Product> products = g_ProductJPA.findAllByShopIdAndKeyword(shopId, keywordPattern, pageable);
        ColorUtil.print(ColorUtil.RED, "End JPA GetProduct");
        return products.map(g_ProductConverter::fromEntityToDTO);
    }

    public Seller_ProductDTO findProductByProductCodeAndShopId(Integer shopId, String product_code) {
        Product product = g_ProductJPA.findProductByProductCodeAndShopId(shopId, product_code);
        if (product == null) {
            return null; // hoặc có thể throw exception tùy vào yêu cầu
        }
        return g_ProductConverter.fromEntityToDTO(product);
    }

    @SuppressWarnings("finally")
    public HashMap<String, Object> createProduct(Product product, List<MultipartFile> realImages) {
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
        String maxProductId = g_ProductJPA.findMaxProductCodeByShopId(product.getShop().getId());
        String code = generateNextProductCode(product.getShop().getShop_slug(), maxProductId);

        product.setProduct_code(code);
        product.setCreatedAt(new Date());
        try {
            Product savedProduct = g_ProductJPA.save(product);
            if (savedProduct != null && savedProduct.getId() != null) {
                statusCode = 201;
                Seller_ProductDTO data = g_ProductConverter.fromEntityToDTO(savedProduct);
                result.put("data", data);
                IrRickUtil.addBreakLineForMessage(message, "Thêm sản phẩm thành công");
            } else {
                statusCode = 201;
                status = false;
                IrRickUtil.addBreakLineForMessage(message, "ERROR: Xảy ra lỗi trong quá trình lưu sản phẩm");
            }
        } catch (Exception e) {
            statusCode = 500;
            status = false;
            IrRickUtil.addBreakLineForMessage(message, "ERROR: Lỗi khi lưu sản phẩm vào cơ sở dữ liệu: " + e.getMessage());
        } finally {
            result.put("status", status);
            result.put("message", message.toString());
            result.put("statusCode", statusCode);
            return result;
        }
    }

    @SuppressWarnings("finally")
    public HashMap<String, Object> updateProduct(Product product, List<Integer> oldImage,
            List<MultipartFile> realImages) {
        HashMap<String, Object> result = new HashMap<String, Object>();
        StringBuffer message = new StringBuffer();
        Boolean status = true;
        int statusCode = 200;

        if (realImages != null && !realImages.isEmpty()) {
            List<Image> images = g_ImageService.uploadImage(realImages, product);
            if (images == null) {
                statusCode = 500;
                IrRickUtil.addBreakLineForMessage(message, "ERROR: Lỗi không thể upload hình ảnh");
            } else if (product.getImages() != null && !product.getImages().isEmpty()) {
                images.addAll(product.getImages());
            }
            product.setImages(images);
        }
        try {
            Product savedProduct = g_ProductJPA.save(product);
            if (savedProduct != null && savedProduct.getId() != null) {
                statusCode = 201;
                Seller_ProductDTO data = g_ProductConverter.fromEntityToDTO(savedProduct);
                result.put("data", data);
                IrRickUtil.addBreakLineForMessage(message, "Cập nhật sản phẩm thành công");
            } else {
                statusCode = 201;
                status = false;
                IrRickUtil.addBreakLineForMessage(message, "ERROR: Xảy ra lỗi trong quá trình lưu sản phẩm");
            }
        } catch (Exception e) {
            statusCode = 500;
            status = false;
            IrRickUtil.addBreakLineForMessage(message, "ERROR: Lỗi khi lưu sản phẩm vào cơ sở dữ liệu: " + e.getMessage());
        } finally {
            result.put("status", status);
            result.put("message", message.toString());
            result.put("statusCode", statusCode);
            return result;
        }
    }

    public HashMap<String, Object> deleteProductByIdAndShopId(Integer shopId, Integer productId) {
        Product product = g_ProductJPA.findProductByIdAndShopId(shopId, productId);
        HashMap<String, Object> result = new HashMap<>();

        if (product == null || product.getId() == null) {
            result.put("status", false);
            result.put("message", "ERROR: Không tìm thấy sản phẩm cần xóa.");
            result.put("statusCode", 200);
            return result;
        }

        StringBuffer message = new StringBuffer();
        boolean status = false;
        int statusCode = 200;

        // validate các liên kết với bảng khác
        if (product.getOrderItems() != null && !product.getOrderItems().isEmpty()) {
            message.append("ERROR: Không thể xóa sản phẩm, sản phẩm đã có người đặt hàng.");
        } else if (product.getCartItems() != null && !product.getCartItems().isEmpty()) {
            message.append("ERROR: Không thể xóa sản phẩm, sản phẩm đã có người thêm vào giỏ hàng.");
        } else if (product.getFavorites() != null && !product.getFavorites().isEmpty()) {
            message.append("ERROR: Không thể xóa sản phẩm, sản phẩm đã có người thêm vào yêu thích.");
        } else if (product.getPromotionProducts() != null && !product.getPromotionProducts().isEmpty()) {
            message.append("ERROR: Không thể xóa sản phẩm, sản phẩm đang nằm trong chương trình giảm giá");
        } else if (product.getReportProducts() != null && !product.getReportProducts().isEmpty()) {
            message.append("ERROR: Không thể xóa sản phẩm, sản phẩm đã bị báo cáo.");
        } else {
            try {
                g_ProductJPA.delete(product);
                status = true;
            } catch (Exception e) {
                message.append("ERROR: Đã xảy ra lỗi không xác định.");
            }
        }
        // Kiểm tra lỗi,
        // do status mặc định là false,
        // trường hợp true duy nhất là xóa sản phẩm thành công khi k có liên kết
        if (!status) {
            statusCode = 409;
            if (product.isActive()) {
                if (product.isActive() && updateProductStatusToStopSelling(product)) {
                    message.append("\n Đã chuyển trạng thái sản phẩm thành ngừng bán.");
                } else {
                    message.append("\n ERROR: Đã xảy ra lỗi khi chuyển trạng thái sản phẩm thành ngừng bán.");
                }
            }
        } else {
            message.append("Đã xóa sản phẩm thành công.");
        }

        // gửi về controller
        result.put("status", status);
        result.put("statusCode", statusCode);
        result.put("message", message.toString());
        return result;
    }

    private boolean updateProductStatusToStopSelling(Product product) {
        try {
            product.setActive(false);
            g_ProductJPA.save(product);
            return true;
        } catch (Exception e) {
            System.out.println("Khong update duoc");
            return false;
        }
    }

    // util function

    

    public String generateNextProductCode(String rawPrefix, String maxProductCode) {
        // Chuyển prefix thành chữ hoa và thêm _P
        String prefix = rawPrefix.toUpperCase() + "_P";
        int nextId = 1;

        if (maxProductCode != null && maxProductCode.startsWith(prefix)) {
            String numberPart = maxProductCode.substring(prefix.length());
            try {
                nextId = Integer.parseInt(numberPart) + 1;
            } catch (NumberFormatException e) {
                // Nếu không phải số thì giữ nextId = 1
            }
        }

        // Format phần số: ít nhất 3 chữ số (001, 045, 120, 1000...)
        return prefix + String.format("%03d", nextId);
    }

}
