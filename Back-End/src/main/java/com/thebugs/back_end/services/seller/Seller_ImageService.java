package com.thebugs.back_end.services.seller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.entities.Image;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.repository.ImageJPA;
import com.thebugs.back_end.utils.CloudinaryUpload;

@Service
public class Seller_ImageService {
    @Autowired
    private ImageJPA g_ImageJPA;

    protected boolean removeOldImage(List<Integer> imageIdToDelete) {
        try {
            g_ImageJPA.deleteAllById(imageIdToDelete); // Xóa tất cả các ảnh
            return true; // Trả về true nếu xóa thành công
        } catch (Exception e) {
            return false;
        }
    }

    protected List<Image> uploadImage(List<MultipartFile> realImages, Product product) {
        List<Image> images = new ArrayList<>();
        for (MultipartFile realImage : realImages) {
            try {
                Image image = new Image();
                String url = CloudinaryUpload.uploadImage(realImage);
                image.setImageName(url);
                image.setProduct(product);
                if (!url.isEmpty()) {
                    images.add(image);
                } else {
                    return null;
                }
            } catch (Exception e) {
                System.out.println("Lỗi Image nè: " + e.getMessage());
            }
        }

        return images;
    }
}
