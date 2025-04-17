package com.thebugs.back_end.services.user;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserter;
import org.springframework.web.reactive.function.BodyInserters;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thebugs.back_end.beans.ShopBean;
import com.thebugs.back_end.beans.UserRegisterBean;
import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.dto.FPT_API_DTO.ID_RecognitionDTO.FPT_Id_DTO;
import com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO.FPT_LiveFace_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_District_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Province_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Ward_DTO;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.ShopConverter;
import com.thebugs.back_end.repository.RoleJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.repository.UserJPA;
import com.thebugs.back_end.utils.API_KEY;
import com.thebugs.back_end.utils.CloudinaryUpload;
import com.thebugs.back_end.utils.ColorUtil;
import com.thebugs.back_end.utils.JwtUtil;
import com.thebugs.back_end.utils.WebClientConfig;

import reactor.core.publisher.Mono;

@Service
public class RegisterSellerService {
    @Autowired
    private UserService g_UserService;
    @Autowired
    private ShopJPA g_ShopJPA;
    @Autowired
    private RoleJPA g_RoleJPA;
    @Autowired
    private UserJPA g_UserJPA;
    @Autowired
    private BCryptPasswordEncoder g_passwordEncoder;

    @Autowired
    private JwtUtil g_JwtUtil;

    @Autowired
    private WebClientConfig g_WebClientConfig;
    @Autowired
    private ShopConverter g_ShopMapper;

    public UserDTO getUserByToken(String authorizationHeader) {
        return g_UserService.getUserDTO(authorizationHeader);
    }

    public String registerAndLoginUser(UserRegisterBean bean) {
        User user = new User();
        user.setFullName(bean.getFullName());
        user.setEmail(bean.getEmail());
        user.setPhone(bean.getPhone());
        user.setActive(true);
        user.setRole(g_RoleJPA.findById(1).get());
        user.setVerify(false);
        ColorUtil.print(ColorUtil.RED, "USERID: " + user.getId());

        user.setPassword(g_passwordEncoder.encode(bean.getPassword()));
        User userRegistered = g_UserJPA.save(user);
        if (userRegistered != null && userRegistered.getId() != null) {
            String jwt = g_JwtUtil.generateToken(userRegistered.getId(), userRegistered.getRole().getId(), "login");
            if (jwt.isBlank()) {
                return null;
            } else {
                return jwt;
            }
        } else {
            return null;
        }
    }

    public HashMap<String, Object> createSeller(String authorizationHeader, ShopBean shopBean, MultipartFile logo) {
        HashMap<String, Object> result = new HashMap<>();
        String imageUrl = uploadImage(logo);
        if (imageUrl.isBlank()) {
            result.put("status", false);
            result.put("statusCode", 401);
            result.put("message", "Lỗi không thể lưu ảnh");
            return result;
        }
        User user = g_UserService.getUserToken(authorizationHeader);
        System.out.println("ABC");
        Shop shop = g_ShopMapper.beanToEntity(shopBean);
        shop.setImage(imageUrl);
        shop.setTotalPayout(0.0);
        shop.setUser(user);
        Shop savedShop = g_ShopJPA.save(shop);
        if (savedShop != null && savedShop.getId() != null) {
            result.put("status", true);
            result.put("statusCode", 201);
            result.put("message", "Đăng ký bán hàng thành công");
        } else {
            result.put("status", false);
            result.put("statusCode", 500);
            result.put("message", "Lỗi hệ thống, không thể đăng ký bán hàng");
        }
        return result;
    }

    public GHN_Ward_DTO getWardInfor(int districtID) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("district_id", districtID);
            GHN_Ward_DTO result = g_WebClientConfig
                    .ghnWebClient()
                    .post()
                    .uri("/ward")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(GHN_Ward_DTO.class)
                    .block();
            System.out.println("ResultDistrict: " + result.getMessage());
            return result;
        } catch (Exception e) {
            System.err.println("ERROR Get Code: " + e.getMessage());
            return null;
        }
    }

    public GHN_District_DTO getDistrictInfor(int provinceID) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("province_id", provinceID);
            GHN_District_DTO result = g_WebClientConfig
                    .ghnWebClient()
                    .post()
                    .uri("/district")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(GHN_District_DTO.class)
                    .block();
            System.out.println("ResultDistrict: " + result.getMessage());
            return result;

        } catch (Exception e) {
            System.err.println("ERROR Get Code: " + e.getMessage());
            return null;
        }
    }

    public GHN_Province_DTO getProvinceInfo() {
        try {
            GHN_Province_DTO result = g_WebClientConfig
                    .ghnWebClient()
                    .get()
                    .uri("/province")
                    .retrieve()
                    .bodyToMono(GHN_Province_DTO.class)
                    .block(); // blocking để đơn giản

            System.out.println("Result: " + result);
            return result;

        } catch (Exception e) {
            System.err.println("ERROR Get Code: " + e.getMessage());
            return null;
        }
    }

    public HashMap<String, Object> idRecognition(List<MultipartFile> images) {
        final String API_URL = "https://api.fpt.ai/vision/idr/vnm";

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            ObjectMapper mapper = new ObjectMapper();
            FPT_Id_DTO frontImage = new FPT_Id_DTO();
            FPT_Id_DTO backImage = new FPT_Id_DTO();
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
                                new TypeReference<FPT_Id_DTO>() {
                                });
                    } else {
                        backImage = mapper.readValue(
                                responseBody,
                                new TypeReference<FPT_Id_DTO>() {
                                });
                    }

                }
            }
            message.append("FrontMessage: " + getErrorMessage(frontImage.getErrorCode()) + "\n");
            message.append("BackMessage: " + getErrorMessage(backImage.getErrorCode()));

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

        } catch (

        Exception e) {
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
                FPT_LiveFace_DTO fullResult = mapper.readValue(
                        responseBody,
                        new TypeReference<FPT_LiveFace_DTO>() {
                        });

                ColorUtil.print(ColorUtil.BLUE, "Result: ");
                ColorUtil.print(ColorUtil.BLUE, fullResult.toString());

                HashMap<String, Object> responseData = new HashMap<>();
                responseData.put("statusCode", 200);
                responseData.put("status", true);
                responseData.put("data", fullResult); // Gộp vào chung với resultFinal
                responseData.put("message", message.toString());
                return responseData;
            }

        } catch (Exception e) {
            ColorUtil.print(ColorUtil.RED, "ERROR Get Code: " + e);
            // Bắt mọi lỗi
            HashMap<String, Object> errorData = new HashMap<>();
            errorData.put("status", false);
            errorData.put("statusCode", 422);
            errorData.put("message", "Nhận diện thất bại: " + e.getMessage());
            return errorData;
        }
    }

    protected String uploadImage(MultipartFile image) {
        try {
            return CloudinaryUpload.uploadImage(image);
        } catch (Exception e) {
            System.out.println("Lỗi Image nè: " + e.getMessage());
            return null;
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
