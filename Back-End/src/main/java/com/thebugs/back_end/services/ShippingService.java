package com.thebugs.back_end.services;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.thebugs.back_end.resp.ResponseData;

@Service
public class ShippingService {

        private final RestTemplate restTemplate;

        public ShippingService(RestTemplate restTemplate) {
                this.restTemplate = restTemplate;
        }

        @SuppressWarnings("unchecked")
        public Integer calculateFee(Integer fromDistrictId, String fromWardCode,
                        Integer toDistrictId, String toWardCode, Integer weight) {
                try {
                        HttpHeaders headers = new HttpHeaders();
                        String url = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

                        headers.setContentType(MediaType.APPLICATION_JSON);
                        headers.set("Token", "f248ba4d-d70a-11ef-881c-b25c083cd867");
                        headers.set("ShopId", "5602733");

                        Map<String, Object> request = Map.of(
                                        "service_type_id", 2,
                                        "from_district_id", fromDistrictId != null ? fromDistrictId : 1573,
                                        "from_ward_code", fromWardCode != null ? fromWardCode : "550207",
                                        "to_district_id", toDistrictId,
                                        "to_ward_code", toWardCode,
                                        "weight", weight);

                        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

                        ResponseEntity<ResponseData> responseEntity = restTemplate.exchange(
                                        url,
                                        HttpMethod.POST,
                                        entity,
                                        ResponseData.class);
                        if (responseEntity.getStatusCode() == HttpStatus.OK) {

                                ResponseData responseData = responseEntity.getBody();

                                if (responseData != null && responseData.getData() != null) {

                                        Map<String, Object> dataMap = (Map<String, Object>) responseData.getData();
                                        Integer total = (Integer) dataMap.get("total");
                                        if (total != null) {
                                                return total;
                                        }
                                }
                        }

                        return 0;
                } catch (Exception e) {
                        return 0;
                }
        }
}
