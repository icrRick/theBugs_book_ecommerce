package com.thebugs.back_end.services.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.resp.ResponseData;

@Service
public class ApiGHNService {

    private static final String URL_Province = "https://online-gateway.ghn.vn/shiip/public-api/master-data/province";
    private static final String URL_District = "https://online-gateway.ghn.vn/shiip/public-api/master-data/district";
    private static final String URL_Ward = "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward";
    private static final String URL_Shipping_Free = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    private static final String TOKEN = "f248ba4d-d70a-11ef-881c-b25c083cd867";
    private static final String ShopId = "5602733";

    private final RestTemplate restTemplate;
    private final AddressService addressService;

    public ApiGHNService(RestTemplate restTemplate, AddressService addressService) {
        this.restTemplate = restTemplate;
        this.addressService = addressService;
    }

    public Object getProvinces() {
        try {
            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Token", TOKEN);
            // Map<String, Object> request = new HashMap<>();
            // HttpEntity<Map<String, Object>> entity = new HttpEntity<>("{}", headers);
            HttpEntity<String> entity = new HttpEntity<>("{}", headers);
            ResponseEntity<ResponseData> responseEntity = restTemplate.exchange(
                    URL_Province, HttpMethod.POST, entity, ResponseData.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null
                    && responseEntity.getBody().getData() != null) {

                System.out.println("responseEntity: " + responseEntity.getBody().getData());

                return responseEntity.getBody().getData();
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Object getDistricts(Integer provinceId) {
        try {
            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Token", TOKEN);

            Map<String, Object> request = new HashMap<>();
            request.put("province_id", provinceId);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<ResponseData> responseEntity = restTemplate.exchange(
                    URL_District, HttpMethod.POST, entity, ResponseData.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null
                    && responseEntity.getBody().getData() != null) {

                System.out.println("responseEntity: " + responseEntity.getBody().getData());

                return responseEntity.getBody().getData();
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Object getWards(Integer districtId) {
        try {
            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Token", TOKEN);

            Map<String, Object> request = new HashMap<>();
            request.put("district_id", districtId);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ResponseData> responseEntity = restTemplate.exchange(
                    URL_Ward, HttpMethod.POST, entity, ResponseData.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null
                    && responseEntity.getBody().getData() != null) {

                System.out.println("responseEntity: " + responseEntity.getBody().getData());

                return responseEntity.getBody().getData();
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Object calculateFee(Integer shopId, Integer addressUserId, Float weight) {
        try {
            Address addressShop = addressService.getAddressShopId(shopId);
            Address addressUser = addressService.getAddressById(addressUserId);

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Token", TOKEN);
            headers.set("ShopId", ShopId);

            Integer fromDistrictId = addressShop != null ? addressShop.getDistrictId() : 1573;
            String fromWardCode = addressShop != null ? String.valueOf(addressShop.getWardId()) : "550207";

            Integer toDistrictId = addressUser != null ? addressUser.getDistrictId() : 1573;
            String toWardCode = addressUser != null ? String.valueOf(addressUser.getWardId()) : "550207";

            // Request body
            Map<String, Object> request = new HashMap<>();
            request.put("service_type_id", 2);
            request.put("from_district_id", fromDistrictId);
            request.put("from_ward_code", fromWardCode);
            request.put("to_district_id", toDistrictId);
            request.put("to_ward_code", toWardCode);
            System.out.println("weight: " + weight);
            System.out.println("weight: " + Math.round(weight));

            request.put("weight", Math.round(weight));
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<ResponseData> responseEntity = restTemplate.exchange(
                    URL_Shipping_Free, HttpMethod.POST, entity, ResponseData.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null
                    && responseEntity.getBody().getData() != null) {

                System.out.println("responseEntity: " + responseEntity.getBody().getData());

                return responseEntity.getBody().getData();
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
