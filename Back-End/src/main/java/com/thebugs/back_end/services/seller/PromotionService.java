package com.thebugs.back_end.services.seller;

import java.util.Date;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.PromotionDTO;
import com.thebugs.back_end.entities.Promotion;
import com.thebugs.back_end.mappers.PromotionMapper;
import com.thebugs.back_end.repository.PromotionJPA;
import com.thebugs.back_end.services.user.UserService;

@Service
public class PromotionService {
        @Autowired
        private PromotionJPA promotionJPA;

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

        public ArrayList<PromotionDTO> findByShopAndDateRange(String authorizationHeader, Date startDate,
                        Date expireDate, Pageable pageable) {
                Page<Promotion> page;
                if (startDate == null && expireDate == null) {
                        page = promotionJPA.findAll(pageable);
                } else {
                        page = promotionJPA.findByShopAndDateRange(
                                        userService.getUserToken(authorizationHeader).getShop().getId(), startDate,
                                        expireDate,
                                        pageable);
                }
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
                if (promotion.getPromotionProducts().size()>0) {
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
        
}
