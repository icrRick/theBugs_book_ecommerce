package com.thebugs.back_end.services.user;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.utils.API_KEY;

@Service
public class RegisterSellerService {
    @Autowired
    private UserService g_UserService;

    public User getUserByToken(String authorizationHeader) {
        return g_UserService.getUserToken(authorizationHeader);
    }

    public HashMap<String, Object> idRecognition(List<MultipartFile> images) {
    final String API_URL = "https://api.fpt.ai/vision/idr/vnm";

    // Định nghĩa các trường chính cho front / back
    Set<String> frontAllowed = Set.of(
        "id", "name", "dob", "sex", "nationality",
        "address", "doe", "address_entities"
    );
    Set<String> backAllowed = Set.of(
        "features", "issue_date", "mrz_details", "issue_loc"
    );

    try (CloseableHttpClient client = HttpClients.createDefault()) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> resultFinal = new HashMap<>();

        for (MultipartFile file : images) {
            // 1. Gửi ảnh
            HttpPost post = new HttpPost(API_URL);
            post.setHeader("api-key", API_KEY.FPT_API_KEY);
            HttpEntity entity = MultipartEntityBuilder.create()
                    .addBinaryBody("image",
                            file.getInputStream(),
                            ContentType.IMAGE_JPEG,
                            file.getOriginalFilename())
                    .build();
            post.setEntity(entity);

            try (CloseableHttpResponse response = client.execute(post)) {
                String responseBody = EntityUtils.toString(
                        response.getEntity(), StandardCharsets.UTF_8);

                // 2. Parse toàn bộ JSON
                Map<String, Object> fullResult = mapper.readValue(
                        responseBody,
                        new TypeReference<Map<String, Object>>() {});

                // 3. Lấy List<Map> từ key "data"
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) fullResult.get("data");
                if (dataList == null || dataList.isEmpty()) {
                    throw new IllegalStateException("No data in response");
                }
                Map<String, Object> dataMap = dataList.get(0);

                // 4. Chọn bộ key dựa vào type_new
                String typeNew = (String) dataMap.get("type_new");
                Set<String> allowed = (typeNew != null && typeNew.contains("front"))
                        ? frontAllowed
                        : backAllowed;

                // 5. Filter chỉ giữ những entry cần thiết
                Map<String, Object> filtered = dataMap.entrySet().stream()
                        .filter(e -> allowed.contains(e.getKey()))
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                Map.Entry::getValue
                        ));

                // 6. Đưa vào frontImage hoặc backImage
                if (typeNew != null && typeNew.contains("front")) {
                    resultFinal.put("frontImage", filtered);
                } else {
                    resultFinal.put("backImage", filtered);
                }
            }
        }

        // 7. Build response chung
        HashMap<String, Object> responseData = new HashMap<>();
        responseData.put("statusCode", 200);
        responseData.put("message", "Nhận diện thành công");
        responseData.put("data", resultFinal);
        return responseData;

    } catch (Exception e) {
        // Bắt mọi lỗi
        HashMap<String, Object> errorData = new HashMap<>();
        errorData.put("statusCode", 422);
        errorData.put("message", "Nhận diện thất bại: " + e.getMessage());
        return errorData;
    }
}


}
