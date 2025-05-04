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
import com.thebugs.back_end.entities.ReportProduct;
import com.thebugs.back_end.entities.ReportProductImage;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.mappers.ProItemMapper;
import com.thebugs.back_end.mappers.ReportProductImageJPA;
import com.thebugs.back_end.repository.ReportProductJPA;
import com.thebugs.back_end.utils.CloudinaryUpload;

@Service
public class UserReportProductService {
    @Autowired
    private ReportProductJPA reportProductJPA;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AdminReportMapper adminReportMapper;

    @Autowired
    private ProItemMapper proItemMapper;

    @Autowired
    private ReportProductImageJPA reportProductImageJPA;

    public ArrayList<Object> findReportProductsByActive(String activeStr, String authorizationHeader,
            Pageable pageable) {
        Page<ReportProduct> page;
        User user = userService.getUserToken(authorizationHeader);
        switch (activeStr.toLowerCase()) {
            case "all":
                page = reportProductJPA.findAllByUserId(user.getId(), pageable);
                break;
            case "null":
                page = reportProductJPA.findReportProductsByActiveByUser(null, user.getId(), pageable);
                break;
            case "true":
                page = reportProductJPA.findReportProductsByActiveByUser(true, user.getId(), pageable);
                break;
            case "false":
                page = reportProductJPA.findReportProductsByActiveByUser(false, user.getId(), pageable);
                break;
            default:
                return new ArrayList<>();
        }

        return page.stream()
                .map(adminReportMapper::toReportProduct)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public int countByActive(String activeStr, String authorizationHeader) {
        User user = userService.getUserToken(authorizationHeader);
        switch (activeStr.toLowerCase()) {
            case "all":
                return (int) reportProductJPA.countByActiveByUserId(user.getId());
            case "null":
                return (int) reportProductJPA.countByActiveByUser(null, user.getId());
            case "true":
                return (int) reportProductJPA.countByActiveByUser(true, user.getId());
            case "false":
                return (int) reportProductJPA.countByActiveByUser(false, user.getId());
            default:
                return 0;
        }
    }

    public ReportProduct getById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Id không thể null");
        }
        return reportProductJPA.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy" + id));
    }

    public Object getReportProduct(Integer id) {
        ReportProduct reportProduct = getById(id);
        return adminReportMapper.toReportProduct(reportProduct);
    }

    public Object getReportProductByProductCode(String productCode) {
        Product product = productService.getProductByProductCode(productCode);
        return proItemMapper.toDTO(product);
    }

    public boolean addReportProduct(String productCode, String note, String authorizationHeader,
            List<MultipartFile> images) throws IOException {
        ReportProduct reportProduct = new ReportProduct();
        Product product = productService.getProductByProductCode(productCode);
        User user = userService.getUserToken(authorizationHeader);
        if (reportProductJPA.checkReportProductByUser(productCode, user.getId()) > 0) {
            throw new IllegalArgumentException("Bạn đã báo cáo sản phẩm này rồi vui lòng chờ xác nhận!");
        }
        reportProduct.setNote(note);
        reportProduct.setProduct(product);
        reportProduct.setUser(user);
        reportProduct.setCreateAt(new Date());
        reportProduct.setApprovalDate(null);
        reportProduct.setActive(null);
        ReportProduct save = reportProductJPA.save(reportProduct);
        for (MultipartFile image : images) {
            ReportProductImage reportProductImage = new ReportProductImage();
            String urlImage = (image != null && !image.isEmpty())
                    ? CloudinaryUpload.uploadImage(image)
                    : null;
            reportProductImage.setImageName(urlImage);
            reportProductImage.setReportProduct(save);
            reportProductImageJPA.save(reportProductImage);
        }
        return true;
    }

}
