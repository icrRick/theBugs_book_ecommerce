package com.thebugs.back_end.services.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ImageDTO;
import com.thebugs.back_end.entities.Image;
import com.thebugs.back_end.mappers.ImageMapper;
import com.thebugs.back_end.repository.ImageJPA;

@Service
public class ProductImageService {
    @Autowired
    private ImageJPA imageJPA;
    @Autowired
    private ImageMapper imageMapper;

    public Image saveImage(Image image) {
        return imageJPA.save(image);
    } 
    public List<ImageDTO> getListProductImage(List<Image> images) {
        return imageMapper.toDTOs(images);
    }
    public ImageDTO getImageDTOById(Integer imageId) {
        Image image = imageJPA.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy imageId: " + imageId));
        return imageMapper.toDTO(image);
    }

}
