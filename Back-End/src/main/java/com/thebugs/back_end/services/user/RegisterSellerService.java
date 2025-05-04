package com.thebugs.back_end.services.user;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;

import com.thebugs.back_end.beans.AddressBean;
import com.thebugs.back_end.beans.ShopBean;
import com.thebugs.back_end.beans.UserRegisterBean;
import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.dto.FPT_API_DTO.ID_RecognitionDTO.FPT_Id_DTO;
import com.thebugs.back_end.dto.FPT_API_DTO.LiveNessDTO.FPT_LiveFace_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_District_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Province_DTO;
import com.thebugs.back_end.dto.GHN_API_DTO.GHN_Ward_DTO;
import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.repository.AddressJPA;
import com.thebugs.back_end.repository.RoleJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.repository.UserJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.utils.*;

@Service
public class RegisterSellerService {

    private final EmailUtil emailUtil;

    private final JwtUtil jwtUtil;
    @Autowired
    private UserService g_UserService;
    @Autowired
    private ShopJPA g_ShopJPA;
    @Autowired
    private RoleJPA g_RoleJPA;
    @Autowired
    private UserJPA g_UserJPA;
    @Autowired
    private AddressJPA g_AddressJPA;
    @Autowired
    private BCryptPasswordEncoder g_passwordEncoder;

    @Autowired
    private WebClientConfig g_WebClientConfig;

    RegisterSellerService(JwtUtil jwtUtil, EmailUtil emailUtil) {
        this.jwtUtil = jwtUtil;
        this.emailUtil = emailUtil;
    }

    public UserDTO getUserByToken(String authorizationHeader) {
        return g_UserService.getUserDTO(authorizationHeader);
    }

    public User registerUser(UserRegisterBean bean) {
        User user = new User();
        user.setFullName(bean.getFullName());
        user.setEmail(bean.getEmail());
        user.setPhone(bean.getPhone());
        user.setActive(true);
        user.setRole(g_RoleJPA.findById(1).get());
        user.setVerify(false);
        user.setDob(bean.getDob());
        user.setCccd(bean.getCccd());
        ColorUtil.print(ColorUtil.RED, "USERID: " + user.getId());

        user.setPassword(g_passwordEncoder.encode(bean.getPassword()));
        User userRegistered = g_UserJPA.save(user);
        if (userRegistered != null && userRegistered.getId() != null) {
            return userRegistered;
        } else {
            return null;
        }
    }

    public boolean checkTokenConfirmEmail(String token, int userId) {
        return jwtUtil.validateToken(
                token,
                userId,
                "CONFIRM");
    }

    public ResponseData updateExpireAfterConfirm(int userId) {
        try {
            Optional<User> userOptional = g_UserJPA.findById(userId);
            if (userOptional.isPresent()) {
                Shop shop = userOptional.get().getShop();
                shop.setExpiredAt(null);
                g_ShopJPA.save(shop);
                return new ResponseData(true, "Cập nhật thành công", null, 200);
            } else {
                return new ResponseData(false, "Người dùng không tồn tại", null, 404);
            }
        } catch (Exception e) {
            return new ResponseData(false, e.getMessage(), null, 500);
        }
    }

    @Transactional
    public ResponseData createSeller(ShopBean shopBean, AddressBean addressBean,
            UserRegisterBean registerBean, MultipartFile logo, MultipartFile banner) {
        try {
            boolean isRegisted = true; // Biến để lưu trạng thái đăng ký

            // Kiểm tra xem người dùng đã tồn tại chưa
            User user = null;
            if (registerBean.getId() != null) {
                user = g_UserJPA.findById(registerBean.getId()).orElse(null);
            }

            if (user == null) {
                // Nếu người dùng chưa tồn tại, tiến hành đăng ký
                user = registerUser(registerBean);
                isRegisted = false; // Người dùng mới đăng ký
            }

            if (user == null || user.getId() == null) {
                throw new RuntimeException("Không thể đăng ký người dùng.");
            }

            String imageUrl = "";
            String bannerUrl = "";
            if (logo != null && !logo.isEmpty()) {
                imageUrl = uploadImage(logo);
            }
            if (banner != null && !banner.isEmpty()) {
                bannerUrl = uploadImage(banner);
            }

            Shop shop = shopBeanToEntity(shopBean);
            shop.setImage(imageUrl);
            shop.setBanner(bannerUrl);
            shop.setTotalPayout(0.0);
            shop.setUser(user);
            if (!isRegisted) {
                ZonedDateTime nowInVietnam = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
                shop.setExpiredAt(nowInVietnam.toLocalDateTime().plusMinutes(15));
            }
            Shop savedShop = g_ShopJPA.save(shop);
            if (savedShop.getId() == null) {
                throw new RuntimeException("Không thể đăng ký shop.");
            }

            Address address = addressBeanToEntity(addressBean, user);
            Address savedAddress = g_AddressJPA.save(address);
            if (savedAddress.getId() == null) {
                throw new RuntimeException("Không thể đăng ký địa chỉ.");
            }

            if (!isRegisted) {
                String token = jwtUtil.generateToken(user.getId(), user.getRole().getId(), "CONFIRM");
                emailUtil.sendEmailConfirmEmail(user.getEmail(), token, user.getId());
            }

            return new ResponseData(true, "Đăng ký thành công, vui lòng kiểm tra email để xác nhận đăng ký", null, 201);

        } catch (Exception e) {
            return new ResponseData(false, e.getMessage(), null, 500);
        }
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

    private FPT_Id_DTO idRecognitionImage(MultipartFile image) {
        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("image", new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename(); // quan trọng để server hiểu đây là file
                }
            }).contentType(MediaType.IMAGE_JPEG);
            FPT_Id_DTO result = g_WebClientConfig
                    .fptWebClient()
                    .post()
                    .uri("/vision/idr/vnm")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .retrieve()
                    .bodyToMono(FPT_Id_DTO.class)
                    .block();
            return result;
        } catch (Exception e) {
            System.err.println("ERROR Get Code: " + e.getMessage());
            return null;
        }
    }

    public ResponseData idRecognition(List<MultipartFile> images) {
        FPT_Id_DTO frontImage = idRecognitionImage(images.getFirst());
        FPT_Id_DTO backImage = idRecognitionImage(images.getLast());
        ColorUtil.print(ColorUtil.BLUE, "ERROR ID");
        if (frontImage == null || backImage == null) {
            ResponseData responseData = new ResponseData(false, "Nhận diện thất bại lỗi server", null, 422);
            return responseData;
        }

        StringBuffer message = new StringBuffer();
        message.append("FrontMessage: " + getErrorMessage(frontImage.getErrorCode()) + "\n");
        message.append("BackMessage: " + getErrorMessage(backImage.getErrorCode()));

        frontImage.getData().get(0).setIssue_date(backImage.getData().get(0).getIssue_date());
        frontImage.getData().get(0).setIssue_loc(backImage.getData().get(0).getIssue_loc());
        // 10. Build response chung
        return new ResponseData(true, message.toString(), frontImage, 201);
    }

    public ResponseData faceMatch(MultipartFile cmnd, MultipartFile video) {
        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("cmnd", new ByteArrayResource(cmnd.getBytes()) {
                @Override
                public String getFilename() {
                    return cmnd.getOriginalFilename();
                }
            }).contentType(MediaType.IMAGE_JPEG);
            builder.part("video", new ByteArrayResource(video.getBytes()) {
                @Override
                public String getFilename() {
                    return video.getOriginalFilename();
                }
            }).contentType(MediaType.MULTIPART_FORM_DATA);

            FPT_LiveFace_DTO result = g_WebClientConfig
                    .fptWebClient()
                    .post()
                    .uri("/dmp/liveness/v3")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .retrieve()
                    .bodyToMono(FPT_LiveFace_DTO.class)
                    .block();
            if (result == null) {
                return new ResponseData(false, "Nhận diện thất bại lỗi server", null, 422);
            } else {
                return new ResponseData(true, "Xác minh khuôn mặt thành công", result, 201);
            }
        } catch (Exception e) {
            System.err.println("ERROR Get Code: " + e.getMessage());
            return new ResponseData(false, "Nhận diện thất bại lỗi server", null, 422);
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

    private Shop shopBeanToEntity(ShopBean bean) {
        Shop shop = new Shop();
        shop.setName(bean.getName());
        shop.setBankOwnerName(bean.getBankOwnerName());
        shop.setBankOwnerNumber(bean.getBankOwnerNumber());
        shop.setBankProvideName(bean.getBankProvideName());
        shop.setShop_slug(bean.getShop_slug());
        shop.setDescription(bean.getDescription());
        shop.setActive(true);
        shop.setApprove(null);
        shop.setStatus(null);
        return shop;
    }

    private Address addressBeanToEntity(AddressBean bean, User user) {
        Address address = new Address();
        address.setDistrictId(bean.getDistrictId());
        address.setProvinceId(bean.getProvinceId());
        address.setWardId(bean.getWardId());
        address.setStreet(bean.getStreet());
        address.setIsShop("Yes");
        address.setFullName(user.getFullName());
        address.setPhone(user.getPhone());
        address.setUser(user);
        return address;
    }

    private String getErrorMessage(int value) {
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
