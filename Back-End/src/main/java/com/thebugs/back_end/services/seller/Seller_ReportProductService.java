package com.thebugs.back_end.services.seller;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.ReportProduct;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.repository.ReportProductJPA;
import com.thebugs.back_end.services.user.UserService;

@Service
public class Seller_ReportProductService {

    @Autowired
    private ReportProductJPA reportProductJPA;

    @Autowired
    private AdminReportMapper adminReportMapper;
    @Autowired
    private UserService userService;

    public ArrayList<Object> findReportProductsByActive(String activeStr, String token, Pageable pageable) {
        int shopId = userService.getUserToken(token).getShop().getId();
        Page<ReportProduct> page;
        switch (activeStr.toLowerCase()) {
            case "all":
                page = reportProductJPA.findAllReportProductByShopId(shopId, pageable);
                break;
            case "null":
                page = reportProductJPA.findReportProductsByActiveByProductId(null, shopId, pageable);
                break;
            case "true":
                page = reportProductJPA.findReportProductsByActiveByProductId(true, shopId, pageable);
                break;
            case "false":
                page = reportProductJPA.findReportProductsByActiveByProductId(false, shopId, pageable);
                break;
            default:
                return new ArrayList<>();
        }

        return page.stream()
                .map(adminReportMapper::toReportProduct)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int totalItems(String activeStr, String token) {
        int shopId = userService.getUserToken(token).getShop().getId();
        int total = 0;
        switch (activeStr.toLowerCase()) {
            case "all":
                total = reportProductJPA.countAllByActiveByProductId(shopId);
                break;
            case "null":
                total = reportProductJPA.countByActiveByProductId(null, shopId);
                break;
            case "true":
                total = reportProductJPA.countByActiveByProductId(true, shopId);
                break;
            case "false":
                total = reportProductJPA.countByActiveByProductId(false, shopId);
                break;
            default:
                return 0;
        }
        return total;
    }

    public ReportProduct getById(String token, Integer id) {
        Integer shopId = userService.getUserToken(token).getShop().getId();

        if (id == null) {
            throw new IllegalArgumentException("Id không thể null");
        }
        ReportProduct reportProduct = reportProductJPA.getDetailById(shopId, id);

        if (reportProduct == null) {
            throw new IllegalArgumentException(
                    "Không tìm thấy sản phẩm báo cáo với id: " + id + " thuộc shopId: " + shopId);
        }

        return reportProduct;

    }

    public Object getReportProductDetail(String token, Integer id) {

        ReportProduct reportProduct = getById(token, id);
        return adminReportMapper.toReportProduct(reportProduct);
    }

}
