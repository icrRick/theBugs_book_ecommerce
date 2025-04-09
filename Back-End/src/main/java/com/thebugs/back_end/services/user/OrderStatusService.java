package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.OrderStatus;
import com.thebugs.back_end.repository.OrderStatusJPA;

@Service
public class OrderStatusService {

        @Autowired
        private OrderStatusJPA orderStatusJPA;

        public OrderStatus getOrderStatusById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("ID không được null");
                }
                return orderStatusJPA.findById(id).orElseThrow(() -> new IllegalArgumentException(
                                "Không tìm thấy đối tượng OrderStatus có id= " + id));
        }

        
        
}
