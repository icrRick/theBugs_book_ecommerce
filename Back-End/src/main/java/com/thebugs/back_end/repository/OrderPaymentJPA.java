package com.thebugs.back_end.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.thebugs.back_end.entities.OrderPayment;

public interface OrderPaymentJPA extends JpaRepository<OrderPayment, Integer> {

   
}
