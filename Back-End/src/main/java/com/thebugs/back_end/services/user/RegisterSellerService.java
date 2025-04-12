package com.thebugs.back_end.services.user;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;

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
import com.thebugs.back_end.dto.IrRickDTO.ID_RecognitionDTO.FPT_ID_OBJECT;
import com.thebugs.back_end.dto.IrRickDTO.LiveNessDTO.FPT_LIVEFACE_DTO;
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

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            ObjectMapper mapper = new ObjectMapper();
            FPT_ID_OBJECT frontImage = new FPT_ID_OBJECT();
            FPT_ID_OBJECT backImage = new FPT_ID_OBJECT();
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
                    ColorUtil.print(ColorUtil.RED, responseBody);

                    if (images.get(0).equals(file)) {
                        frontImage = mapper.readValue(
                                responseBody,
                                new TypeReference<FPT_ID_OBJECT>() {
                                });
                    } else {
                        backImage = mapper.readValue(
                                responseBody,
                                new TypeReference<FPT_ID_OBJECT>() {
                                });
                    }

                }
            }
            frontImage.getData().get(0).setIssue_date(backImage.getData().get(0).getIssue_date());
            frontImage.getData().get(0).setIssue_loc(backImage.getData().get(0).getIssue_loc());
            ColorUtil.print(ColorUtil.RED, "DATA_CMND");
            ColorUtil.print(ColorUtil.RED, frontImage.toString());
            // Bắt lỗi chỉ tách message

            // 10. Build response chung
            HashMap<String, Object> responseData = new HashMap<>();
            responseData.put("statusCode", 200);
            responseData.put("data", frontImage); // Gộp vào chung với resultFinal
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

    public HashMap<String, Object> faceMatch(MultipartFile cmnd, MultipartFile video) {
        final String API_URL = "https://api.fpt.ai/dmp/liveness/v3";

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            ObjectMapper mapper = new ObjectMapper();
            StringBuffer message = new StringBuffer();

            // 1. Gửi ảnh
            HttpPost post = new HttpPost(API_URL);
            post.setHeader("api-key", API_KEY.FPT_API_KEY);
            MultipartEntityBuilder multipartEntity = MultipartEntityBuilder.create()
                    .addBinaryBody("cmnd",
                            cmnd.getInputStream(),
                            ContentType.IMAGE_JPEG,
                            cmnd.getOriginalFilename());

            multipartEntity.addBinaryBody("video", video.getInputStream(), ContentType.MULTIPART_FORM_DATA,
                    video.getOriginalFilename());

            HttpEntity entity = multipartEntity.build();
            post.setEntity(entity);

            try (CloseableHttpResponse response = client.execute(post)) {
                String responseBody = EntityUtils.toString(
                        response.getEntity(), StandardCharsets.UTF_8);

                // 2. Parse toàn bộ JSON
                FPT_LIVEFACE_DTO fullResult = mapper.readValue(
                        responseBody,
                        new TypeReference<FPT_LIVEFACE_DTO>() {
                        });

                ColorUtil.print(ColorUtil.BLUE, "Result: ");
                ColorUtil.print(ColorUtil.BLUE, fullResult.toString());

                HashMap<String, Object> responseData = new HashMap<>();
                responseData.put("statusCode", 200);
                responseData.put("data", fullResult); // Gộp vào chung với resultFinal
                responseData.put("message", message.toString());
                return responseData;
            }

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
