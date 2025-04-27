package com.thebugs.back_end.mappers;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.PromotionDTO;
import com.thebugs.back_end.dto.Seller_ProductPromotionDTO;
import com.thebugs.back_end.entities.Promotion;

@Component
public class PromotionMapper {

        public PromotionDTO toDTO(Promotion promotion) {
                PromotionDTO dto = new PromotionDTO();
                dto.setId(promotion.getId());
                dto.setPromotionValue(promotion.getPromotionValue());
                dto.setCreatedAt(promotion.getCreateAt());
                dto.setStartDate(promotion.getStartDate());
                dto.setExpireDate(promotion.getExpireDate());
                dto.setStatus(status(promotion.getStartDate(), promotion.getExpireDate()));
                dto.setActive(promotion.isActive());
                if (promotion.getPromotionProducts() != null) {
                        List<Seller_ProductPromotionDTO> productDTOs = promotion.getPromotionProducts().stream()
                                        .map(pp -> {
                                                Seller_ProductPromotionDTO spd = new Seller_ProductPromotionDTO();
                                                spd.setId(pp.getProduct().getId());
                                                spd.setName(pp.getProduct().getName());
                                                spd.setPrice(pp.getProduct().getPrice());
                                                spd.setQuantity(pp.getQuantity());
                                                return spd;
                                        })
                                        .toList();

                        dto.setPromotionProductDTO(productDTOs);
                }
                return dto;
        }

        public String status(Date startDate, Date expireDate) {
                if (startDate == null || expireDate == null) {
                        return "Chưa có thời gian áp dụng";
                }
                if (startDate.after(new Date())) {
                        return "sắp diễn ra";
                } else if (expireDate.before(new Date())) {
                        return "Đã kết thúc";
                } else {
                        return "Đang diễn ra";
                }

        }

}