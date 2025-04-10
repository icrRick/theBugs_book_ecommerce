package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.repository.OrderJPA;

@Service
public class OrderService {

        @Autowired
        private OrderJPA orderJPA;

        public Order saveOrder(Order order) {
                return orderJPA.save(order);
        }

        public Order findById(Integer orderId) {
                if (orderId == null) {
                        throw new IllegalArgumentException("ID không được null");
                }
                return orderJPA.findById(orderId)
                                .orElseThrow(() -> new IllegalStateException("Không tìm thấy order " + orderId));
        }
}
