package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.Genre;
@Component
public class GenreMapper {

        public GenreDTO toDTO(Genre genre) {
                if (genre == null) {
                        return null;
                }
                GenreDTO genreDTO = new GenreDTO();
                genreDTO.setId(genre.getId());
                genreDTO.setName(genre.getName());
                genreDTO.setUrlImage(genre.getUrlImage()!=null ? genre.getUrlImage() : "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80");
                return genreDTO;
        }

}
