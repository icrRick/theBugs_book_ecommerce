package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.AdminRevenueShopDTO;
import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.mappers.AdminRevenueShopMapper;
import com.thebugs.back_end.repository.OrderJPA;

@Service
public class AdminRevenueShopService {

    @Autowired
    private OrderJPA orderJPA;

    @Autowired
    private AdminRevenueShopMapper adminRevenueShopMapper;

    public ArrayList<Object> getShopRevenue(Date startDate, Date endDate, Pageable pageable) {
        Page<Order> orderPage = orderJPA.getShopRevenuePage(startDate, endDate, pageable);
        return (ArrayList<Object>) adminRevenueShopMapper.toDTO(orderPage.getContent());
    }
    

    public int total(Date startDate, Date endDate) {
        return orderJPA.countRevenueShops(startDate, endDate);
    }

    public double getTotalRevenue(Date startDate, Date endDate) {
        double totalRevenue = 0.0;
        List<Order> orders = orderJPA.getShopRevenue(startDate, endDate);
        totalRevenue = orders.stream()
            .mapToDouble(order -> order.getOrderItems().stream()
                .mapToDouble(item -> item.getOlPrice() * item.getQuantity())
                .sum() * 0.05)
            .sum();
        return totalRevenue;
    }

}
