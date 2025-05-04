package com.thebugs.back_end.services.seller;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.ReportShop;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.repository.ReportShopJPA;
import com.thebugs.back_end.services.user.UserService;

@Service
public class Seller_ReportShopService {
    @Autowired
    private ReportShopJPA reportShopJPA;

    @Autowired
    private AdminReportMapper adminReportMapper;

    @Autowired
    private UserService userService;

    public ArrayList<Object> findReportShopsByActive(String activeStr, String token, Pageable pageable) {
        Page<ReportShop> page;
        int shopId = userService.getUserToken(token).getShop().getId();
        switch (activeStr.toLowerCase()) {
            case "all":
                page = reportShopJPA.findAllByShopId(shopId, pageable);
                break;
            case "null":
                page = reportShopJPA.findReportShopsByActiveByShopId(null, shopId, pageable);
                break;
            case "true":
                page = reportShopJPA.findReportShopsByActiveByShopId(true, shopId, pageable);
                break;
            case "false":
                page = reportShopJPA.findReportShopsByActiveByShopId(false, shopId, pageable);
                break;
            default:
                return new ArrayList<>();
        }

        return page.stream()
                .map(adminReportMapper::toReportShop)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int totalItems(String activeStr, String token) {
        int total = 0;
        int shopId = userService.getUserToken(token).getShop().getId();
        switch (activeStr.toLowerCase()) {
            case "all":
                total = reportShopJPA.countAllByShopId(shopId);
                break;
            case "null":
                total = reportShopJPA.countByActiveByShopId(null, shopId);
                break;
            case "true":
                total = reportShopJPA.countByActiveByShopId(true, shopId);
                break;
            case "false":
                total = reportShopJPA.countByActiveByShopId(false, shopId);
                break;
            default:
                return 0;
        }
        return total;
    }

    public ReportShop getById(String token, Integer id) {
        Integer shopId = userService.getUserToken(token).getShop().getId();

        if (id == null) {
            throw new IllegalArgumentException("Id không thể null");
        }
        ReportShop reportShop = reportShopJPA.getDetailById(shopId, id);

        if (reportShop == null) {
            throw new IllegalArgumentException(
                    "Không tìm thấy sản phẩm báo cáo với id: " + id + " thuộc shopId: " + shopId);
        }

        return reportShop;

    }

    public Object getReportProductDetail(String token, Integer id) {

        ReportShop reportProduct = getById(token, id);
        return adminReportMapper.toReportShop(reportProduct);
    }
}
