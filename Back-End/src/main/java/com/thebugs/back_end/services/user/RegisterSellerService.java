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
import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.utils.API_KEY;
import com.thebugs.back_end.utils.ColorUtil;

@Service
public class RegisterSellerService {
    @Autowired
    private UserService g_UserService;

    public UserDTO getUserByToken(String authorizationHeader) {
        return g_UserService.getUserDTO(authorizationHeader);
    }

    public HashMap<String, Object> idRecognition(List<MultipartFile> images) {
        final String API_URL = "https://api.fpt.ai/vision/idr/vnm";

        // Định nghĩa các trường chính cho front / back
        Set<String> frontAllowed = Set.of(
                "id", "name", "dob", "sex", "nationality",
                "address", "doe", "address_entities", "features", "issue_date", "issue_loc", "type", "errorCode");

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            ObjectMapper mapper = new ObjectMapper();
            HashMap<String, Object> resultFinal = new HashMap<>();
            HashMap<String, Object> errorCodes = new HashMap<>(); // To store error codes for front and back
            StringBuffer message = new StringBuffer();
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
                            new TypeReference<Map<String, Object>>() {
                            });

                    ColorUtil.print(ColorUtil.BLUE, "Result: ");
                    ColorUtil.print(ColorUtil.BLUE, fullResult.toString());

                    // 3. Lấy errorCode và errorMessage
                    int errorCode = (int) fullResult.get("errorCode");

                    // 4. Lưu errorCode tương ứng với từng ảnh
                    if (file.equals(images.get(0))) {
                        errorCodes.put("errorCodeFrontImage", errorCode);
                    } else {
                        errorCodes.put("errorCodeBackImage", errorCode);
                    }

                    // 5. Lấy List<Map> từ key "data"
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> dataList = (List<Map<String, Object>>) fullResult.get("data");
                    if (dataList == null || dataList.isEmpty()) {
                        throw new IllegalStateException("No data in response");
                    }
                    Map<String, Object> dataMap = dataList.get(0);

                    // 6. Chọn bộ key dựa vào type_new
                    String typeNew = (String) dataMap.get("type");
                    Set<String> allowed = frontAllowed;

                    // 7. Filter chỉ giữ những entry cần thiết và bỏ qua các giá trị "N/A"
                    Map<String, Object> filtered = dataMap.entrySet().stream()
                            .filter(e -> allowed.contains(e.getKey())) // chỉ lọc các trường cần thiết
                            .filter(e -> !"N/A".equals(e.getValue())) // loại bỏ giá trị "N/A"
                            .collect(Collectors.toMap(
                                    Map.Entry::getKey,
                                    Map.Entry::getValue));

                    // 8. Gộp tất cả vào kết quả cuối cùng
                    if (typeNew != null && typeNew.contains("front")) {
                        resultFinal.put("frontImage", filtered);
                    } else {
                        resultFinal.put("backImage", filtered);
                    }
                }
            }

            ColorUtil.print(ColorUtil.RED, "Start validate");
            // Bắt lỗi chỉ tách message
            message.append("FrontImageMessage: " + getErrorMessage((int) errorCodes.get("errorCodeFrontImage")));
            message.append("\nBackImageMessage: " + getErrorMessage((int) errorCodes.get("errorCodeBackImage")));
            ColorUtil.print(ColorUtil.RED, "End validate");

            // 9. Gộp frontImage và backImage vào trong một object data duy nhất
            HashMap<String, Object> mergedData = new HashMap<>();
            Map<String, Object> frontData = (Map<String, Object>) resultFinal.get("frontImage");
            Map<String, Object> backData = (Map<String, Object>) resultFinal.get("backImage");

            // Gộp tất cả các trường front và back vào mergedData
            if (frontData != null) {
                mergedData.putAll(frontData);
            }
            if (backData != null) {
                mergedData.putAll(backData);
            }

            // 10. Build response chung
            HashMap<String, Object> responseData = new HashMap<>();
            responseData.put("statusCode", 200);
            responseData.put("data", mergedData); // Gộp vào chung với resultFinal
            responseData.put("message", message.toString());
            return responseData;

        } catch (Exception e) {
            ColorUtil.print(ColorUtil.RED, "ERROR Get Code: " + e);
            // Bắt mọi lỗi
            HashMap<String, Object> errorData = new HashMap<>();
            errorData.put("statusCode", 422);
            errorData.put("message", "Nhận diện thất bại: " + e.getMessage());
            return errorData;
        }
    }

    public String getErrorMessage(int value) {
        StringBuilder result = new StringBuilder();

        switch (value) {
            case 0:
                result.append("Chuyển đổi dữ liệu thành công");
                break;
            case 1:
                result.append(
                        "ERROR: Thiếu ảnh");
                break;
            case 2:
                result.append(
                        "ERROR: Căn cước công dân bị thiếu góc.");
                break;
            case 3:
                result.append(
                        "ERROR: Ảnh quá mờ hoặc quá sáng không thể lấy dữ liệu");
                break;
            case 5:
                result.append(
                        "ERROR: Không thể lấy thông tin hình ảnh");
                break;
            case 6:
                result.append(
                        "ERROR: Lỗi hệ thống");
                break;
            case 7:
                result.append("ERRORD: Tập tin không hợp lệ, yêu cầu phải là ảnh");
                break;
            case 8:
                result.append("ERROR: Ảnh lỗi hoặc không hợp lệ, vui lòng dùng JPEG hoặc PNG");
                break;
            case 9:
                result.append(
                        "ERROR: Lỗi thiếu key hệ thống");
                break;
            case 10:
                result.append(
                        "ERROR: Lỗi phân tích của hệ thống");
                break;
            default:
                result.append("ERROR: Lỗi không xác định của hệ thống");
                break;
        }

        return result.toString();
    }

}
