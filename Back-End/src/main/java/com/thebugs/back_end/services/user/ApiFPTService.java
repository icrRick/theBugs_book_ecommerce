package com.thebugs.back_end.services.user;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.utils.MultipartInputStreamFileResource;

@Service
public class ApiFPTService {
    
    private static final String URL_Recognition = "https://api.fpt.ai/vision/idr/vnm/";
    private static final String URL_Liveness = "https://api.fpt.ai/dmp/liveness/v3";
    private static final String API_KEY = "ABxq2kJ6h4pWuSpci6Kki9y5KMsdp8NW";
    private final RestTemplate restTemplate;

    public ApiFPTService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object getRecognition(MultipartFile image) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("api-key", API_KEY);

            MultiValueMap<String, Object> request = new LinkedMultiValueMap<>();
            request.add("image",
                    new MultipartInputStreamFileResource(image.getInputStream(), image.getOriginalFilename()));

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ResponseData> responseEntity = restTemplate.exchange(
                URL_Recognition, HttpMethod.POST, entity, ResponseData.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null
                    && responseEntity.getBody().getData() != null) {
                System.out.println("📦 Response từ FPT: " + responseEntity.getBody());

                // Tuỳ bạn parse về kiểu gì, ở đây chỉ return string JSON
                return responseEntity.getBody().getData();
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Object getLiveness(MultipartFile cccdImage,MultipartFile video) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("api-key", API_KEY);

            MultiValueMap<String, Object> request = new LinkedMultiValueMap<>();
            request.add("cmnd", new MultipartInputStreamFileResource(cccdImage.getInputStream(), cccdImage.getOriginalFilename()));
            request.add("video", new MultipartInputStreamFileResource(video.getInputStream(), video.getOriginalFilename()));

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<Object> responseEntity = restTemplate.exchange(
                URL_Liveness, HttpMethod.POST, entity, Object.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK && responseEntity.getBody() != null
                    ) {
                System.out.println("📦 Response từ FPT: " + responseEntity.getBody());

                // Tuỳ bạn parse về kiểu gì, ở đây chỉ return string JSON
                return responseEntity.getBody();
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
