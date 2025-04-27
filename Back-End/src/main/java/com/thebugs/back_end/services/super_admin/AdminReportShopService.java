package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.ReportShop;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.repository.ReportShopJPA;
import com.thebugs.back_end.utils.EmailUtil;

@Service
public class AdminReportShopService {

    
    @Autowired
    private ReportShopJPA reportShopJPA;

    @Autowired
    private AdminReportMapper adminReportMapper;

    @Autowired
    private EmailUtil emailUtil;

    public ArrayList<Object> findReportShopsByActive(String activeStr, Pageable pageable) {
        Page<ReportShop> page;
        switch (activeStr.toLowerCase()) {
            case "all":
                page = reportShopJPA.findAll(pageable);
                break;
            case "null":
                page = reportShopJPA.findReportShopsByActive(null, pageable);
                break;
            case "true":
                page = reportShopJPA.findReportShopsByActive(true, pageable);
                break;
            case "false":
                page = reportShopJPA.findReportShopsByActive(false, pageable);
                break;
            default:
                return new ArrayList<>();
        }

        return page.stream()
                .map(adminReportMapper::toReportShop)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int totalItems(String activeStr) {
        int total = 0;
        switch (activeStr.toLowerCase()) {
            case "all":
                total = reportShopJPA.findAll().size();
                break;
            case "null":
                total = reportShopJPA.countByActive(null);
                break;
            case "true":
                total = reportShopJPA.countByActive(true);
                break;
            case "false":
                total = reportShopJPA.countByActive(false);
                break;
            default:
                return 0;
        }
        return total;
    }

    public ReportShop getById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Id không thể null");
        }
        return reportShopJPA.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy" + id));
    }

    public boolean approve(Integer id) {
        ReportShop ReportShop = getById(id);
        List<ReportShop> ReportShops = findReportShopsByProductAndActive(ReportShop, null);
        boolean check = updateActiveAndSendEmail(ReportShops);
        return check;
    }

    public boolean updateActiveAndSendEmail(List<ReportShop> ReportShops) {
        for (ReportShop ReportShop : ReportShops) {
            try {
                ReportShop.setActive(true);
                ReportShop.setApprovalDate(new Date());
                reportShopJPA.save(ReportShop);

                String emailUser = ReportShop.getUser().getEmail();
                String emailShop = ReportShop.getShop().getUser().getEmail();

                boolean checksendEmail = emailUtil.sendEmailApprove(
                        emailUser, "Báo cáo cửa hàng", ReportShop.getShop().getShop_slug());

                boolean checksendEmailShop = emailUtil.sendEmailRejectReprot(
                        emailShop, "Cửa hàng", ReportShop.getShop().getShop_slug(),
                        ReportShop.getNote(), null);

                if (!checksendEmail || !checksendEmailShop) {
                    System.err.println(
                            "Gửi email thất bại cho sản phẩm: " + ReportShop.getShop().getShop_slug());
                }

            } catch (Exception e) {
                System.err.println("Lỗi khi xử lý report: " + e.getMessage());
                e.printStackTrace();
            }
        }
        // Product product = ReportShops.get(0).setShop();
        // product.setStatus(true);
        // productJPA.save(product);
        return true;
    }

    public boolean reject(Integer id, List<String> reasons) {
        ReportShop reportShop = getById(id);

        String emailUser = reportShop.getUser().getEmail();
        boolean checksendEmail = emailUtil.sendEmailReject(emailUser, "Báp cáo cửa hàng",
        reportShop.getShop().getShop_slug(),
                reasons);
        boolean checkUpdateApprove = updateActive(reportShop, false);
        return checksendEmail && checkUpdateApprove;
    }

    public boolean updateActive(ReportShop reportShop, boolean active) {
        try {
            reportShop.setActive(active);
            reportShop.setApprovalDate(new Date());
            reportShopJPA.save(reportShop);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<ReportShop> findReportShopsByProductAndActive(ReportShop reportShop, Boolean active) {
        return reportShopJPA.findReportShopsByshopAndActive(reportShop.getShop().getId(), active);
    }

}

