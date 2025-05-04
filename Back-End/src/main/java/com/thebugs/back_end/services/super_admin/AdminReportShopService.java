package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ReportShop;
import com.thebugs.back_end.entities.ReportShopImage;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.ReportShopJPA;
import com.thebugs.back_end.repository.RoleJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.repository.UserJPA;
import com.thebugs.back_end.utils.EmailUtil;

@Service
public class AdminReportShopService {

    @Autowired
    private ReportShopJPA reportShopJPA;

    @Autowired
    private AdminReportMapper adminReportMapper;

    @Autowired
    private ShopJPA shopJPA;

    @Autowired
    private UserJPA userJPA;

    @Autowired
    private RoleJPA roleJPA;

    @Autowired
    private ProductJPA productJPA;

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

    public Object getReportShop(Integer id) {
        ReportShop reportProduct = getById(id);
        return adminReportMapper.toReportShop(reportProduct);
    }

    public boolean approve(Integer id) {
        ReportShop reportShop = getById(id);
        List<ReportShop> reportShops = findReportShopsByshopAndActive(reportShop, null);
        boolean check = updateActiveAndSendEmail(reportShops);
        return check;
    }

    public boolean updateActiveAndSendEmail(List<ReportShop> reportShops) {
        Set<Integer> emailedShops = new HashSet<>();

        for (ReportShop reportShop : reportShops) {
            try {

                reportShop.setActive(true);
                reportShop.setApprovalDate(new Date());
                reportShopJPA.save(reportShop);

                String emailUser = reportShop.getUser().getEmail();
                boolean sentUserEmail = emailUtil.sendEmailApprove(
                        emailUser, "Báo cáo cửa hàng", reportShop.getShop().getShop_slug());

                if (!sentUserEmail) {
                    System.err.println("Gửi email cho người dùng thất bại: " + emailUser);
                }

                Integer shopId = reportShop.getShop().getId();
                if (!emailedShops.contains(shopId)) {
                    emailedShops.add(shopId);

                    String emailShop = reportShop.getShop().getUser().getEmail();
                    String shopSlug = reportShop.getShop().getShop_slug();

                    List<String> imageUrls = reportShop.getReportShopImages().stream()
                            .map(ReportShopImage::getImageName)
                            .collect(Collectors.toList());

                    boolean sentShopEmail = emailUtil.sendEmailRejectReport(
                            emailShop, "Cửa hàng", shopSlug, imageUrls);

                    if (!sentShopEmail) {
                        System.err.println("Gửi email cho shop thất bại: " + shopSlug);
                    }
                }

            } catch (Exception e) {
                System.err.println("Lỗi khi xử lý report: " + e.getMessage());
                e.printStackTrace();
            }
        }
        Shop shop = reportShops.get(0).getShop();
        shop.setStatus(true);
        shopJPA.save(shop);
        User user = shop.getUser();
        user.setRole(roleJPA.findById(1).get());
        userJPA.save(user);
        List<Product> products = productJPA.findAllByShopId(shop.getId());
        for (Product product : products) {
            product.setStatus(true);

            productJPA.save(product);
        }
        return true;
    }

    public boolean reject(Integer id, List<String> reasons) {
        ReportShop reportShop = getById(id);

        String emailUser = reportShop.getUser().getEmail();
        boolean checksendEmail = emailUtil.sendEmailReject(emailUser, "Báo cáo cửa hàng",
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

    public List<ReportShop> findReportShopsByshopAndActive(ReportShop reportShop, Boolean active) {
        return reportShopJPA.findReportShopsByshopAndActive(reportShop.getShop().getId(), active);
    }

}
