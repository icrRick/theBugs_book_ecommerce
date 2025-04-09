package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.entities.Author;
import com.thebugs.back_end.entities.ProductAuthor;

@Component
public class AuthorMapper {
        public AuthorDTO toDTO(Author author) {
                if (author == null) {
                        return null;
                }

                AuthorDTO authorDTO = new AuthorDTO();
                authorDTO.setId(author.getId());
                authorDTO.setName(author.getName());
                authorDTO.setUrlImage(author.getUrlImage());
                authorDTO.setUrlLink(author.getUrlLink());
                return authorDTO;
        }

        public List<AuthorDTO> toDTOS(List<ProductAuthor> authors) {
                if (authors == null) {
                        return null;
                }

                List<AuthorDTO> authorDTOs = new ArrayList<>();
                for (ProductAuthor productAuthor : authors) {
                        Author author = productAuthor.getAuthor();
                        AuthorDTO authorDTO = toDTO(author);
                        authorDTOs.add(authorDTO);
                }
                return authorDTOs;
        }

}
