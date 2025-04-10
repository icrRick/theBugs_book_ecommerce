package com.thebugs.back_end.mappers;
import java.util.List;
import org.springframework.stereotype.Component;
import com.thebugs.back_end.dto.ImageDTO;
import com.thebugs.back_end.entities.Image;
@Component
public class ImageMapper {

        public ImageDTO toDTO(Image image) {
                if (image == null) {
                        return null;
                }
                ImageDTO imageDTO = new ImageDTO();
                imageDTO.setId(image.getId());
                imageDTO.setName(image.getImageName());
                return imageDTO;
        }

        public List<ImageDTO> toDTOs(List<Image> images) {
                if (images == null) {
                        return null;
                }
                return images.stream().map(this::toDTO).toList();
        }
}
