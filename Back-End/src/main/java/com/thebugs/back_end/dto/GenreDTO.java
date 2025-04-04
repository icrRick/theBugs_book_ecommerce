package com.thebugs.back_end.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class GenreDTO {
        private Integer id;
        private String name;
        private String urlImage;

        public GenreDTO(Integer id, String name) {
                this.id = id;
                this.name = name;
        }

        public GenreDTO(Integer id, String name, String urlImage) {
                this.id = id;
                this.name = name;
                this.urlImage = urlImage;
        }

}
