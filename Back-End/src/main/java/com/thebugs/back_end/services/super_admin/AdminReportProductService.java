package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ReportProduct;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.ReportProductJPA;
import com.thebugs.back_end.utils.EmailUtil;

@Service
public class AdminReportProductService {

    @Autowired
    private ProductJPA productJPA;
    
    @Autowired
    private ReportProductJPA reportProductJPA;

    @Autowired
    private AdminReportMapper adminReportMapper;

    @Autowired
    private EmailUtil emailUtil;

    public ArrayList<Object> findReportProductsByActive(String activeStr, Pageable pageable) {
        Page<ReportProduct> page;
        switch (activeStr.toLowerCase()) {
            case "all":
                page = reportProductJPA.findAll(pageable);
                break;
            case "null":
                page = reportProductJPA.findReportProductsByActive(null, pageable);
                break;
            case "true":
                page = reportProductJPA.findReportProductsByActive(true, pageable);
                break;
            case "false":
                page = reportProductJPA.findReportProductsByActive(false, pageable);
                break;
            default:
                return new ArrayList<>();
        }

        return page.stream()
                .map(adminReportMapper::toReportProduct)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int totalItems(String activeStr) {
        int total = 0;
        switch (activeStr.toLowerCase()) {
            case "all":
                total = reportProductJPA.findAll().size();
                break;
            case "null":
                total = reportProductJPA.countByActive(null);
                break;
            case "true":
                total = reportProductJPA.countByActive(true);
                break;
            case "false":
                total = reportProductJPA.countByActive(false);
                break;
            default:
                return 0;
        }
        return total;
    }

    public ReportProduct getById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Id không thể null");
        }
        return reportProductJPA.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy" + id));
    }

    public boolean approve(Integer id) {
        ReportProduct reportProduct = getById(id);
        List<ReportProduct> reportProducts = findReportProductsByProductAndActive(reportProduct, null);
        boolean check = updateActiveAndSendEmail(reportProducts);
        return check;
    }

    public boolean updateActiveAndSendEmail(List<ReportProduct> reportProducts) {
        for (ReportProduct reportProduct : reportProducts) {
            try {
                reportProduct.setActive(true);
                reportProduct.setApprovalDate(new Date());
                reportProductJPA.save(reportProduct);

                String emailUser = reportProduct.getUser().getEmail();
                String emailShop = reportProduct.getProduct().getShop().getUser().getEmail();

                boolean checksendEmail = emailUtil.sendEmailApprove(
                        emailUser, "Báo cáo sản phẩm", reportProduct.getProduct().getProduct_code());

                boolean checksendEmailShop = emailUtil.sendEmailRejectReprot(
                        emailShop, "Sản phẩm", reportProduct.getProduct().getProduct_code(),
                        reportProduct.getNote(), reportProduct.getUrl());

                if (!checksendEmail || !checksendEmailShop) {
                    System.err.println(
                            "Gửi email thất bại cho sản phẩm: " + reportProduct.getProduct().getProduct_code());
                }

            } catch (Exception e) {
                System.err.println("Lỗi khi xử lý report: " + e.getMessage());
                e.printStackTrace();
            }
        }
        Product product = reportProducts.get(0).getProduct();
        product.setStatus(true);
        productJPA.save(product);
        return true;
    }

    public boolean reject(Integer id, List<String> reasons) {
        ReportProduct reportProduct = getById(id);

        String emailUser = reportProduct.getUser().getEmail();
        boolean checksendEmail = emailUtil.sendEmailReject(emailUser, "Báp cáo sản phẩm",
                reportProduct.getProduct().getProduct_code(),
                reasons);
        boolean checkUpdateApprove = updateActive(reportProduct, false);
        return checksendEmail && checkUpdateApprove;
    }

    public boolean updateActive(ReportProduct reportProduct, boolean active) {
        try {
            reportProduct.setActive(active);
            reportProduct.setApprovalDate(new Date());
            reportProductJPA.save(reportProduct);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<ReportProduct> findReportProductsByProductAndActive(ReportProduct reportProduct, Boolean active) {
        return reportProductJPA.findReportProductsByProductAndActive(reportProduct.getProduct().getId(), active);
    }

}
