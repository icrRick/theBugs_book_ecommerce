package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.entities.ReportProduct;
import com.thebugs.back_end.entities.ReportProductImage;
import com.thebugs.back_end.entities.ReportShop;
import com.thebugs.back_end.entities.ReportShopImage;
import com.thebugs.back_end.utils.ReplaceName;

@Component
public class AdminReportMapper {

    public List<Map<String, Object>> toListReportProductImage(List<ReportProductImage> reportProductImages) {
        List<Map<String, Object>> result = new ArrayList<>();

        for (ReportProductImage image : reportProductImages) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", image.getId());
            map.put("name", image.getImageName());
            result.add(map);
        }

        return result;
    }

    public Object toReportProduct(ReportProduct reportProduct) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", reportProduct.getId());
        map.put("productName", reportProduct.getProduct().getName());
        map.put("productCode", reportProduct.getProduct().getProduct_code());
        map.put("emailUser", reportProduct.getUser().getEmail());
        map.put("createAt", reportProduct.getCreateAt());
        map.put("approvalDate",reportProduct.getApprovalDate());
        map.put("note", reportProduct.getNote());
        // map.put("url", reportProduct.getUrl());
        map.put("active", reportProduct.getActive());
        map.put("productImage", reportProduct.getProduct().getLastImageName());
        map.put("images", toListReportProductImage(reportProduct.getReportProductImages()));
        return map;
    }


    public List<Map<String,Object>> toListReportShopImage(List<ReportShopImage> reportShopImages){
        List<Map<String, Object>> result = new ArrayList<>();

        for (ReportShopImage image : reportShopImages) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", image.getId());
            map.put("name", image.getImageName());
            result.add(map);
        }
        return result;
    }

    public Object toReportShop(ReportShop reportShop){
        Map<String, Object> map = new HashMap<>();
        map.put("id", reportShop.getId());
        map.put("shopImage", reportShop.getShop().getImage()!= null ? reportShop.getShop().getImage() : ReplaceName.generatePlaceholderUrl(reportShop.getShop().getName()));
        map.put("shopName", reportShop.getShop().getName());
        map.put("shopSlug", reportShop.getShop().getShop_slug());
        map.put("emailUser", reportShop.getUser().getEmail());
        map.put("createAt", reportShop.getCreateAt());
        map.put("approvalDate",reportShop.getApprovalDate());
        map.put("note", reportShop.getNote());
        // map.put("url", reportShop.getUrl());
        map.put("active", reportShop.getActive());
        map.put("images", toListReportShopImage(reportShop.getReportShopImages()));
        return map;
    }



}
