package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thebugs.back_end.dto.ProductDetailDTO;
import com.thebugs.back_end.dto.RelatedProductDTO;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.services.user.ProductDetailService;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/product-detail")
public class ProductDetailController {

    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductJPA productJPA;

    @GetMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> getProductDetail(@PathVariable Integer productId) {
        try {

            String productCode = productJPA.findProductCodeById(productId);
            if (productCode == null) {
                throw new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + productId);
            }

            ProductDetailDTO productDetail = productDetailService.getProductDetailById(productId);

            Map<String, Object> response = new HashMap<>();
            response.put("status", true);
            response.put("message", "Load chi tiết sản phẩm thành công");
            response.put("data", productDetail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", false);
            response.put("message", "Đã xảy ra lỗi khi load chi tiết sản phẩm: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{productId}/related")
    public ResponseEntity<Map<String, Object>> getRelatedProducts(@PathVariable Integer productId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Lấy productCode từ productId
            String productCode = productJPA.findProductCodeById(productId);
            if (productCode == null) {
                throw new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + productId);
            }

            List<RelatedProductDTO> relatedProducts = productDetailService.getRelatedProducts(productCode);

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