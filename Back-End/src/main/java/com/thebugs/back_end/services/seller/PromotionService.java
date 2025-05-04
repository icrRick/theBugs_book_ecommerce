package com.thebugs.back_end.services.seller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.beans.PromotionBean;
import com.thebugs.back_end.beans.PromotionProductBean;
import com.thebugs.back_end.dto.PromotionDTO;
import com.thebugs.back_end.dto.Seller_ProductPromotionDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.Promotion;
import com.thebugs.back_end.entities.PromotionProduct;
import com.thebugs.back_end.mappers.PromotionMapper;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.PromotionJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.UserService;

@Service
public class PromotionService {
        @Autowired
        private PromotionJPA promotionJPA;

        @Autowired
        private ProductJPA g_ProductJPA;
        @Autowired
        private UserService userService;

        @Autowired
        private PromotionMapper promotionMapper;

        public ArrayList<PromotionDTO> getAllPromotions() {
                ArrayList<Promotion> promotions = (ArrayList<Promotion>) promotionJPA.findAll();
                return promotions.stream()
                                .map(promotionMapper::toDTO)
                                .sorted(Comparator.comparing(PromotionDTO::getId).reversed())
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public ResponseData createPromotion(PromotionBean promotionBean, String authorizationHeader) {
                try {
                        Promotion promotion = new Promotion();
                        promotion.setStartDate(promotionBean.getStartDate());
                        promotion.setExpireDate(promotionBean.getExpireDate());
                        promotion.setPromotionValue(promotionBean.getPromotionValue());
                        promotion.setShop(userService.getUserToken(authorizationHeader).getShop());
                        List<PromotionProduct> promotionProducts = new ArrayList<>();
                        for (PromotionProductBean productBean : promotionBean.getProducts()) {
                                Optional<Product> optionalProduct = g_ProductJPA.findById(productBean.getId());
                                if (!optionalProduct.isPresent()) {
                                        return new ResponseData(false,
                                                        "Không tìm thấy sản phẩm với ID = " + productBean.getId(),
                                                        null,
                                                        401);
                                }
                                Product productEntity = optionalProduct.get();
                                if (productBean.getQuantity() > productEntity.getQuantity()) {
                                        return new ResponseData(false,
                                                        "Số lượng sản phẩm " + productEntity.getName()
                                                                        + " trong kho không đủ, số lượng trong kho: "
                                                                        + productEntity.getQuantity(),
                                                        null,
                                                        401);
                                }

                                PromotionProduct promotionProduct = new PromotionProduct();
                                promotionProduct.setPromotion(promotion);
                                promotionProduct.setProduct(productEntity);
                                promotionProduct.setQuantity(productBean.getQuantity());
                                promotionProduct.setSoldQuantity(0);
                                promotionProducts.add(promotionProduct);
                        }
                        promotion.setPromotionProducts(promotionProducts);
                        promotion.setCreateAt(new Date());
                        promotion.setActive(true);
                        promotion.setFlashSale(true);
                        promotionJPA.save(promotion);
                        return new ResponseData(true, "Thêm thành công", null, 201);
                } catch (Exception e) {
                        return new ResponseData(false, "Lỗi: " + e.getMessage(), null, 400);
                }
        }
        
        private Promotion promotionBeanToEntity(PromotionBean promotionBean, Promotion promotionOg) {
                Promotion promotion = new Promotion();
                promotion.setId(promotionOg.getId());
                promotion.setCreateAt(promotionOg.getCreateAt());
                promotion.setShop(promotionOg.getShop());

                promotion.setStartDate(promotionBean.getStartDate());
                promotion.setExpireDate(promotionBean.getExpireDate());
                promotion.setPromotionValue(promotionBean.getPromotionValue());
                promotion.setActive(true);
                promotion.setFlashSale(true);
                return promotion;
        }

        public ResponseData updatePromotion(Integer promotionId, PromotionBean promotionBean,
                        String authorizationHeader) {
                try {
                        // Find the existing promotion by ID
                        Optional<Promotion> optionalPromotion = promotionJPA.findById(promotionId);
                        if (!optionalPromotion.isPresent()) {
                                return new ResponseData(false, "Không tìm thấy khuyến mãi với ID = " + promotionId,
                                                null, 404);
                        }
                        Promotion og_promotion = optionalPromotion.get();
                        Promotion promotion = promotionBeanToEntity(promotionBean, og_promotion);

                        List<PromotionProduct> updatedPromotionProducts = new ArrayList<>();

                        // Create a map to track existing promotion products by product ID
                        Map<Integer, PromotionProduct> productMap = new HashMap<>();
                        for (PromotionProduct promotionProduct : og_promotion.getPromotionProducts()) {
                                productMap.put(promotionProduct.getProduct().getId(), promotionProduct);
                        }

                        // Loop through the new products to add or update them
                        for (PromotionProductBean productBean : promotionBean.getProducts()) {
                                Optional<Product> optionalProduct = g_ProductJPA.findById(productBean.getId());
                                if (!optionalProduct.isPresent()) {
                                        return new ResponseData(false,
                                                        "Không tìm thấy sản phẩm với ID = " + productBean.getId(), null,
                                                        401);
                                }
                                Product productEntity = optionalProduct.get();
                                if (productBean.getQuantity() > productEntity.getQuantity()) {
                                        return new ResponseData(false,
                                                        "Số lượng sản phẩm " + productEntity.getName()
                                                                        + " trong kho không đủ, số lượng trong kho: "
                                                                        + productEntity.getQuantity(),
                                                        null, 401);
                                }

                                // Check if the product already exists in the promotion
                                PromotionProduct existingPromotionProduct = productMap.get(productBean.getId());
                                if (existingPromotionProduct != null) {
                                        // Update the existing promotion product quantity
                                        System.out.println("ExistingProduct: " + existingPromotionProduct.getId());
                                        existingPromotionProduct.setQuantity(productBean.getQuantity());
                                        updatedPromotionProducts.add(existingPromotionProduct);
                                } else {
                                        // Create a new promotion product if it doesn't exist
                                        PromotionProduct promotionProduct = new PromotionProduct();
                                        promotionProduct.setPromotion(promotion);
                                        promotionProduct.setProduct(productEntity);
                                        promotionProduct.setQuantity(productBean.getQuantity());
                                        promotionProduct.setSoldQuantity(0);
                                        updatedPromotionProducts.add(promotionProduct);
                                }
                        }

                        // Set the updated list of promotion products
                        promotion.setPromotionProducts(updatedPromotionProducts);
                        promotion.setActive(true);
                        promotion.setFlashSale(true);

                        // Save the updated promotion
                        promotionJPA.save(promotion);

                        return new ResponseData(true, "Cập nhật khuyến mãi thành công", null, 200);
                } catch (Exception e) {
                        return new ResponseData(false, "Lỗi: " + e.getMessage(), null, 400);
                }
        }

        public ArrayList<PromotionDTO> findByShopAndDateRange(String authorizationHeader, Date startDate,
                        Date expireDate, Pageable pageable) {
                Page<Promotion> page = promotionJPA.findByShopAndDateRange(
                                userService.getUserToken(authorizationHeader).getShop().getId(), startDate,
                                expireDate,
                                pageable);
                return page.stream()
                                .map(promotionMapper::toDTO)
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public int total(String authorizationHeader, Date startDate, Date expireDate) {
                return promotionJPA.countByShopAndDateRange(
                                userService.getUserToken(authorizationHeader).getShop().getId(), startDate, expireDate);
        }

        public boolean deletePromotion(Integer id) {
                Promotion promotion = findById(id);
                if (promotion.getPromotionProducts().size() > 0) {
                        throw new IllegalArgumentException("Promotion đã được sử dụng không thể xóa");
                }
                promotionJPA.delete(promotion);
                return true;
        }

        public Promotion findById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("Id Không được null");
                }
                return promotionJPA.findById(id).orElseThrow(() -> new IllegalArgumentException(
                                "Không tìm thấy đối tượng promotion có id= " + id));

        }

        public PromotionDTO getPromotionById(Integer id) {
                Promotion promotion = promotionJPA.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy promotion với ID = " + id));
                return promotionMapper.toDTO(promotion);
        }

        public ResponseData deletePromotion(Integer promotionId, String authorizationHeader) {
                try {
                        // Find the promotion by ID
                        Optional<Promotion> optionalPromotion = promotionJPA.findById(promotionId);
                        if (!optionalPromotion.isPresent()) {
                                return new ResponseData(false, "Không tìm thấy khuyến mãi với ID = " + promotionId,
                                                null, 404);
                        }

                        Promotion promotion = optionalPromotion.get();
                        // Delete the promotion itself
                        promotionJPA.delete(promotion);

                        return new ResponseData(true, "Xóa khuyến mãi thành công", null, 200);
                } catch (Exception e) {
                        return new ResponseData(false, "Lỗi: " + e.getMessage(), null, 400);
                }
        }

        public ResponseData getProductAndPromotion(Integer shopId, Pageable pageable) {
                try {
                        Page<Seller_ProductPromotionDTO> productAndPromotion = g_ProductJPA.getPromotions(shopId,
                                        pageable);
                        return new ResponseData(true, "Lấy danh sách thành công", productAndPromotion,
                                        201);
                } catch (Exception e) {
                        return new ResponseData(false, "Lỗi: " + e.getMessage(), null, 400);
                }
        }

}
