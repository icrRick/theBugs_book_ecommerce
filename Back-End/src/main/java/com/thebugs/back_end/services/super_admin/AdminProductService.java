package com.thebugs.back_end.services.super_admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import com.thebugs.back_end.dto.AdminProductDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.mappers.AdminProductMapper;
import com.thebugs.back_end.mappers.AdminShopMapper;
import com.thebugs.back_end.mappers.ImageMapper;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.services.user.ProductAuthorService;
import com.thebugs.back_end.services.user.ProductGenreService;
import com.thebugs.back_end.utils.EmailUtil;

@Service
public class AdminProductService {

    @Autowired
    private ProductJPA productJPA;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private ImageMapper imageMapper;

    @Autowired
    private AdminShopMapper adminShopMapper;

    @Autowired
    private ProductAuthorService productAuthorService;

    @Autowired
    private ProductGenreService productGenreService;

    @Autowired
    private PublisherService publisherService;

    @Autowired
    private AdminProductMapper adminProductMapper;

    public ArrayList<AdminProductDTO> getProductByKeywordWithPagination(String keyword, Pageable pageable) {
        Page<Product> page;
        if (keyword == null || keyword.isEmpty()) {
            page = productJPA.findAll(pageable);
        } else {
            page = productJPA.findByName(keyword, pageable);
        }
        return page.stream()
                .map(adminProductMapper::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));

    }

    public int totalItems(String keyword) {
        return productJPA.countfindByName(keyword);
    }

    public Product getProductByProductCode(String productCode) {
        return productJPA.getProductByProductCode(productCode)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy productcode: " + productCode));
    }

    public Object getProductDetail(String productCode) {
        Map<String, Object> map = new HashMap<>();
        Product product = getProductByProductCode(productCode);
        map.put("id", product.getId());
        map.put("name", product.getName());
        map.put("weight", product.getWeight());
        map.put("quantity", product.getQuantity());
        map.put("price", product.getPrice());
        map.put("productCode", product.getProduct_code());
        map.put("description", product.getDescription());
        map.put("createdAt", product.getCreatedAt());
        map.put("approve", product.getApprove());
        map.put("status", product.getStatus());
        map.put("active", product.isActive());
        map.put("images", imageMapper.toDTOs(product.getImages()));
        map.put("authors", productAuthorService.getAuthorsByProductId(product.getId()));
        map.put("genres", productGenreService.getGenresByProductId(product.getId()));
        map.put("publisher", publisherService.getPublisherDTO(product.getPublisher()));
        map.put("shop", adminShopMapper.toDTO(product));
        return map;
    }

    public boolean approve(String productCode) {
        Product product = getProductByProductCode(productCode);
        String emailShop = product.getShop().getUser().getEmail();
        boolean checksendEmail = emailUtil.sendEmailApprove(emailShop,"Sản phẩm", productCode);
        boolean checkUpdateApprove=updateApprove(product, true);
        return checksendEmail && checkUpdateApprove;
    }

    public boolean reject(String productCode,List<String> reasons) {
        Product product = getProductByProductCode(productCode);
        String emailShop = product.getShop().getUser().getEmail();
        boolean checksendEmail = emailUtil.sendEmailReject(emailShop,"Sản phẩm", productCode,reasons);
        boolean checkUpdateApprove=updateApprove(product, false);
        return checksendEmail && checkUpdateApprove;
    }


    public boolean updateApprove(Product product,boolean approve){
        try {
            product.setApprove(approve);
            productJPA.save(product);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }



    

}
