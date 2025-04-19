package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.OrderPayment;
import com.thebugs.back_end.repository.OrderPaymentJPA;

@Service
public class OrderPaymentService {
    @Autowired
    private OrderPaymentJPA orderPaymentJPA;

    public OrderPayment findByOrderPayment(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Không tìm thấy order payment id");
        }

        return orderPaymentJPA.findById(id)
                .orElseThrow(() -> new RuntimeException("Order payment không tồn tại với id = " + id));
    }

}
