package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.List;

import com.thebugs.back_end.dto.ImageDTO;
import com.thebugs.back_end.entities.Image;

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
                List<ImageDTO> imageDTOs = new ArrayList<ImageDTO>(images.size());
                for (Image item : images) {
                        imageDTOs.add(toDTO(item));
                }
                return imageDTOs;
        }
}
