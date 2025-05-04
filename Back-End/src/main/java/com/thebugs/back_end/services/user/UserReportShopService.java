package com.thebugs.back_end.services.user;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ReportShop;
import com.thebugs.back_end.entities.ReportShopImage;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.mappers.ProItemMapper;
import com.thebugs.back_end.mappers.ReportProductImageJPA;
import com.thebugs.back_end.repository.ReportShopImageJPA;
import com.thebugs.back_end.repository.ReportShopJPA;
import com.thebugs.back_end.utils.CloudinaryUpload;

@Service
public class UserReportShopService {
    @Autowired
    private ReportShopJPA reportShopJPA;

    @Autowired
    private UserService userService;

    @Autowired
    private AdminReportMapper adminReportMapper;

    @Autowired
    private ReportShopImageJPA reportShopImageJPA;

    @Autowired
    private ShopPageService shopPageService;

    public ArrayList<Object> findReportShopsByActive(String activeStr, String authorizationHeader,
            Pageable pageable) {
        Page<ReportShop> page;
        User user = userService.getUserToken(authorizationHeader);
        switch (activeStr.toLowerCase()) {
            case "all":
                page = reportShopJPA.findAllByUserId(user.getId(), pageable);
                break;
            case "null":
                page = reportShopJPA.findReportShopsByActiveByUser(null, user.getId(), pageable);
                break;
            case "true":
                page = reportShopJPA.findReportShopsByActiveByUser(true, user.getId(), pageable);
                break;
            case "false":
                page = reportShopJPA.findReportShopsByActiveByUser(false, user.getId(), pageable);
                break;
            default:
                return new ArrayList<>();
        }

        return page.stream()
                .map(adminReportMapper::toReportShop)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int countByActive(String activeStr, String authorizationHeader) {
        User user = userService.getUserToken(authorizationHeader);
        switch (activeStr.toLowerCase()) {
            case "all":
                return (int) reportShopJPA.countByActiveByUserId(user.getId());
            case "null":
                return (int) reportShopJPA.countByActiveByUser(null, user.getId());
            case "true":
                return (int) reportShopJPA.countByActiveByUser(true, user.getId());
            case "false":
                return (int) reportShopJPA.countByActiveByUser(false, user.getId());
            default:
                return 0;
        }
    }

    public ReportShop getById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Id không thể null");
        }
        return reportShopJPA.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy" + id));
    }

    public Object getReportShop(Integer id) {
        ReportShop ReportShop = getById(id);
        return adminReportMapper.toReportShop(ReportShop);
    }

    public boolean addReportShop(String shopSlug, String note, String authorizationHeader,
            List<MultipartFile> images) throws IOException {
        ReportShop reportShop = new ReportShop();
        Shop shop = shopPageService.getShopByShopSlug(shopSlug);
        User user = userService.getUserToken(authorizationHeader);
        if (reportShopJPA.checkReportShopByUser(shopSlug, user.getId()) > 0) {
            throw new IllegalArgumentException("Bạn đã báo cáo cửa hàng này rồi vui lòng chờ xác nhận!");
        }
        reportShop.setNote(note);
        reportShop.setShop(shop);
        reportShop.setUser(user);
        reportShop.setCreateAt(new Date());
        reportShop.setApprovalDate(null);
        reportShop.setActive(null);
        ReportShop save = reportShopJPA.save(reportShop);
        for (MultipartFile image : images) {
            ReportShopImage reportShopImage = new ReportShopImage();
            String urlImage = (image != null && !image.isEmpty())
                    ? CloudinaryUpload.uploadImage(image)
                    : null;
            reportShopImage.setImageName(urlImage);
            reportShopImage.setReportShop(save);
            reportShopImageJPA.save(reportShopImage);
        }
        return true;
    }
}
