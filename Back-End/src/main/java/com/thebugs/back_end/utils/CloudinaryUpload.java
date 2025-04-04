package com.thebugs.back_end.utils;

import java.io.IOException;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.*;
import com.cloudinary.utils.ObjectUtils;

public class CloudinaryUpload {

        private static String CLOUD_NAME = "djxmnm9lk";
        private static String API_KEY = "543752648944648";
        private static String API_SECRET = "UxPGHCjd8YyU-CrYZytC6bfzR-g";

        private static Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", CLOUD_NAME,      // Thay thế bằng cloud name của bạn
                "api_key", API_KEY,            // Thay thế bằng API key của bạn
                "api_secret", API_SECRET       // Thay thế bằng API secret của bạn
        ));
    
        public static String uploadImage(MultipartFile file) throws IOException {
            // Upload file lên Cloudinary, có thể thêm các option nếu cần
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            // Lấy URL ảnh được upload
            return (String) uploadResult.get("secure_url");
        }

}