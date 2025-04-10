package com.thebugs.back_end.mappers;

import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.PromotionDTO;
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
                        dto.setPromotionProductIds(
                                        promotion.getPromotionProducts().stream()
                                                        .map(product -> product.getId())
                                                        .collect(Collectors.toList()));
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