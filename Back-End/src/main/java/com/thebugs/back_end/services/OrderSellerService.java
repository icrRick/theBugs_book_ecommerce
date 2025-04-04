package com.thebugs.back_end.services;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.thebugs.back_end.controllers.AddressController;
import com.thebugs.back_end.dto.OrderSimpleDTO;
import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.repository.OrderJPA;

@Service
public class OrderSellerService {

        @Autowired
        private OrderJPA orderJPA;

        public ArrayList<OrderSimpleDTO> findOrderByShopId(Integer shopId, Pageable pageable) {
                Page<OrderSimpleDTO> order = orderJPA.findOrderByShopId(shopId, pageable);
                return order.stream()
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public Integer getTotalOrder() {
                return null;
        }
}
