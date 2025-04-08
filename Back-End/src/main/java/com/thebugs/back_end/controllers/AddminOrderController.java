package com.thebugs.back_end.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.services.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class AddminOrderController {
    @Autowired
    private OrderService orderService;

   
    @GetMapping("path")
    public String getMethodName(@RequestParam Integer orderId) {
        Order order = orderService.findById(orderId);

        for (OrderItem item : order.getOrderItems()) {
            
        }
         
        return new String();
    }
    
}
