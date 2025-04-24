package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.repository.OrderItemJPA;

@Service
public class OrderItemService {
    @Autowired
    private OrderItemJPA orderItemJPA;

    public OrderItem saveOrderItem(OrderItem orderItem) {
        return orderItemJPA.save(orderItem);
    }

    public OrderItem getOrderItemById(Integer id) {
        if(id == null) {
            throw new IllegalArgumentException("ID không được null");
        }
        return orderItemJPA.findById(id).orElseThrow(() -> new IllegalArgumentException(
            "OrderItem không tồn tại"));
    }

    public void deleteOrderItem(OrderItem orderItem) {
        orderItemJPA.delete(orderItem);
    }
}
