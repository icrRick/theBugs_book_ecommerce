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
        Date nowDate = new Date();
    
        if (endDate == null && startDate == null) {
            endDate = nowDate;
            startDate = new Date(endDate.getTime() - 31L * 24 * 60 * 60 * 1000);
        } else if (startDate == null) {
            startDate = new Date(endDate.getTime() - 31L * 24 * 60 * 60 * 1000);
        } else if (endDate == null) {
            endDate = nowDate;
        }
        long diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffInDays > 31) {
            throw new IllegalArgumentException("Khoảng thời gian không được vượt quá 31 ngày");
        }
    
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
