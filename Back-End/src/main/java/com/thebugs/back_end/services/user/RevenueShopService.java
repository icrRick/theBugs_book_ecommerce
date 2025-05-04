package com.thebugs.back_end.services.user;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Order;
import com.thebugs.back_end.entities.OrderItem;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.AdminRevenueShopMapper;
import com.thebugs.back_end.repository.OrderJPA;

@Service
public class RevenueShopService {

    @Autowired
    private OrderJPA orderJPA;

    @Autowired
    private AdminRevenueShopMapper adminRevenueShopMapper;

    @Autowired
    private UserService userService;

    public Object getShopRevenue(Date startDate, Date endDate, String authorizationHeader,
            Pageable pageable) {
        User user = userService.getUserToken(authorizationHeader);
        Page<Order> orderPage = orderJPA.getShopRevenuePageShopId(startDate, endDate, user.getShop().getId(), pageable);
        return adminRevenueShopMapper.toShopDTO(orderPage.getContent());
    }

    public int total(Date startDate, Date endDate, String authorizationHeader) {
        User user = userService.getUserToken(authorizationHeader);
        return orderJPA.countRevenueShopId(startDate, endDate, user.getShop().getId());
    }

  public double getTotalRevenue(Date startDate, Date endDate, String authorizationHeader) {
    User user = userService.getUserToken(authorizationHeader);
    List<Order> orders = orderJPA.getShopRevenueShopId(startDate, endDate, user.getShop().getId());

    double totalRevenue = 0.0;

    for (Order order : orders) {
        double originalPriceTotal = 0.0;
        double promoPriceTotal = 0.0;

        for (OrderItem item : order.getOrderItems()) {
            originalPriceTotal += item.getOlPrice() * item.getQuantity();
            promoPriceTotal += item.getPrice() * item.getQuantity();
        }

        double discount = 0.0;
        if (order.getVoucher() != null && order.getVoucher().getDiscountPercentage() != null) {
            double discountPercent = order.getVoucher().getDiscountPercentage();
            double maxDiscount = order.getVoucher().getMaxDiscount();
            discount = Math.min(promoPriceTotal * discountPercent / 100, maxDiscount);
        }

        double platformFee = originalPriceTotal * 0.05;
        double shopReceives = promoPriceTotal - discount - platformFee;

        totalRevenue += shopReceives;
    }

    return Math.round(totalRevenue * 10.0) / 10.0;
}

}
