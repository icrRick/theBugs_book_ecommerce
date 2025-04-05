package com.thebugs.back_end.services;

import java.util.ArrayList;
import java.util.Comparator;

import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.mappers.GenreMapper;
import com.thebugs.back_end.repository.GenreJPA;

@Service
public class GenreService {

        private final GenreJPA genreJPA;
        private final GenreMapper genreMapper;

        public GenreService(GenreJPA genreJPA, GenreMapper genreMapper) {
                this.genreJPA = genreJPA;
                this.genreMapper = genreMapper;
        }

        public ArrayList<GenreDTO> getAllGenreDTOs() {
                ArrayList<Genre> genres = (ArrayList<Genre>) genreJPA.findAll();
                return genres.stream()
                                .map(genreMapper::toDTO)
                                .sorted(Comparator.comparing(GenreDTO::getId).reversed())
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public ArrayList<GenreDTO> getGenresByKeywordWithPagination(String keyword, Pageable pageable) {
                Page<Genre> genrePage;
                if (keyword == null || keyword.isEmpty()) {
                        genrePage = genreJPA.findAll(pageable);
                } else {
                        genrePage = genreJPA.findByName(keyword, pageable);
                }

                return genrePage.stream()
                                .map(genreMapper::toDTO)
                                .collect(Collectors.toCollection(ArrayList::new));

        }

        public GenreDTO update(Genre genre) {
                Genre getGenreById = getGenreById(genre.getId());
                if (getGenreById.getId() == 1) {
                        throw new IllegalArgumentException("Không thể cập nhật genre với ID = 1");
                }
                genreJPA.findByNameExist(getGenreById.getId(), genre.getName())
                                .ifPresent(existingGenre -> {
                                        throw new IllegalArgumentException("Tên thể loại đã tồn tại");
                                });
                Genre saved = genreJPA.save(genre);
                return genreMapper.toDTO(saved);
        }

        public GenreDTO add(Genre genre) {
                genreJPA.findByNameExist(null, genre.getName().trim())
                                .ifPresent(existingGenre -> {
                                        throw new IllegalArgumentException("Tên thể loại đã tồn tại");
                                });
                Genre saved = genreJPA.save(genre);
                return genreMapper.toDTO(saved);
        }

        public int totalItems(String keyword) {
                return genreJPA.countfindByName(keyword);
        }

        public boolean deleteGenre(Integer id) {
                Genre genre = getGenreById(id);
                if (genre.getId() == 1) {
                        throw new IllegalArgumentException("Không thể xóa thể loại này");
                }

                if (genre.getProductGenres().size() > 0) {
                        throw new IllegalArgumentException("Thể loại này đã được dùng không thể xóa");
                }
                genreJPA.delete(genre);
                return true;
        }

        public Genre getGenreById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("ID thể loại không hợp lệ");
                }
                return genreJPA.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy đối tượng có id= " + id));
        }

}
