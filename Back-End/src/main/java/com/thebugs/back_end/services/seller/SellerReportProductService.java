package com.thebugs.back_end.services.seller;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.entities.ReportProduct;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.AdminReportMapper;
import com.thebugs.back_end.mappers.ProItemMapper;
import com.thebugs.back_end.repository.ReportProductJPA;
import com.thebugs.back_end.services.user.ProductService;
import com.thebugs.back_end.services.user.UserService;


@Service
public class SellerReportProductService {
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

    
}
