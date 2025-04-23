package com.thebugs.back_end.mappers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.entities.ReportProduct;

@Component
public class AdminReportMapper {
    public Object toReportProduct(ReportProduct reportProduct) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", reportProduct.getId());
        map.put("productName", reportProduct.getProduct().getName());
        map.put("productCode", reportProduct.getProduct().getProduct_code());
        map.put("emailUser", reportProduct.getUser().getEmail());
        map.put("createAt", reportProduct.getCreateAt());
        map.put("approvalDate",reportProduct.getApprovalDate());
        map.put("note", reportProduct.getNote());
        map.put("url", reportProduct.getUrl());
        map.put("active", reportProduct.getActive());
        return map;
    }
}
