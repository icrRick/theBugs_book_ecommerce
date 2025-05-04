package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thebugs.back_end.dto.ProductDetailDTO;
import com.thebugs.back_end.dto.RelatedProductDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.services.user.ProductDetailService;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/product-detail")
public class ProductDetailController {

    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductJPA productJPA;

    @GetMapping("/{product_code}")
    public ResponseEntity<Map<String, Object>> getProductDetail(@PathVariable String product_code) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Product> productOptional = productJPA.findProductCodeById(product_code);

            if (!productOptional.isPresent()) {
                response.put("status", false);
                response.put("message", "Không tìm thấy sản phẩm với mã: " + product_code);
                response.put("data", null);
                return ResponseEntity.status(404).body(response);
            }

            Product product = productOptional.get();

            ProductDetailDTO productDetail = productDetailService.getProductDetailById(product.getId());

            response.put("status", true);
            response.put("message", "Load chi tiết sản phẩm thành công");
            response.put("data", productDetail);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "Đã xảy ra lỗi hệ thống khi xử lý yêu cầu của bạn.");
            response.put("data", null);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{product_code}/related")
    public ResponseEntity<Map<String, Object>> getRelatedProducts(@PathVariable String product_code) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Lấy productCode từ productId
            Product productCode = productJPA.findProductCodeById(product_code).get();
            if (productCode == null) {
                throw new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + product_code);
            }

            List<RelatedProductDTO> relatedProducts = productDetailService
                    .getRelatedProducts(productCode.getProduct_code());

            if (relatedProducts.isEmpty()) {
                response.put("status", true);
                response.put("message", "Không có sản phẩm tương tự nào.");
                response.put("data", relatedProducts);
                return ResponseEntity.ok(response);
            }

            response.put("status", true);
            response.put("message", "Load sản phẩm tương tự thành công");
            response.put("data", relatedProducts);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "Đã xảy ra lỗi khi load sản phẩm tương tự: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(500).body(response);
        }
    }

}