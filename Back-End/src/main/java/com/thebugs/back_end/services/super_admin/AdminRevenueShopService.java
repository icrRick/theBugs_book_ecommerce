package com.thebugs.back_end.services.super_admin;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.AdminRevenueShopDTO;
import com.thebugs.back_end.repository.OrderJPA;

@Service
public class AdminRevenueShopService {

    @Autowired
    private OrderJPA orderJPA;

    public List<AdminRevenueShopDTO> getShopRevenueList(Date startDate, Date endDate, Pageable pageable) {
        Page<AdminRevenueShopDTO> pageResult = orderJPA.getShopRevenuePage(startDate, endDate, pageable);
        return pageResult.getContent();
    }
    

    public int total(Date startDate, Date endDate) {
        return orderJPA.countRevenueShops(startDate, endDate);
    }

    public double getTotalRevenue(Date startDate, Date endDate) {
        List<AdminRevenueShopDTO> revenueList = orderJPA.getShopRevenue(startDate, endDate);
        return revenueList.stream().mapToDouble(dto -> dto.getFixedFee()).sum();
    }

}
