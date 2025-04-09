package com.thebugs.back_end.services.super_admin;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.entities.Author;
import com.thebugs.back_end.mappers.AuthorMapper;
import com.thebugs.back_end.repository.AuthorJPA;

@Service
public class AuthorService {

        private final AuthorMapper authorMapper;
        private final AuthorJPA authorJPA;

        public AuthorService(AuthorMapper authorMapper, AuthorJPA authorJPA) {
                this.authorMapper = authorMapper;
                this.authorJPA = authorJPA;
        }

        public int getTotal(String keyword) {
                return authorJPA.countfindByName(keyword);
        }

        public List<AuthorDTO> searchKeyWordAndPagination(String keyword, Pageable pageable) {
                Page<Author> authorPageable;

                if (keyword == null || keyword.isEmpty()) {
                        authorPageable = authorJPA.findAll(pageable);
                } else {
                        authorPageable = authorJPA.findByNameAuthor(keyword, pageable);
                }

                return authorPageable.stream()
                                .map(authorMapper::toDTO)
                                .collect(Collectors.toList());

        }

        public AuthorDTO add(Author author) {
                authorJPA.findByNameExist(null, author.getName())
                                .ifPresent(a -> {
                                        throw new IllegalArgumentException("Tên tác giả đã tồn tại");
                                });
                Author saveAuthor = authorJPA.save(author);
                AuthorDTO authorDTO = authorMapper.toDTO(saveAuthor);
                return authorDTO;
        }
        public AuthorDTO update(Author author) {
                authorJPA.findByNameExist(author.getId(), author.getName())
                                .ifPresent(a -> {
                                        throw new IllegalArgumentException("Tên tác giả đã tồn tại");
                                });
                Author saveAuthor = authorJPA.save(author);
                AuthorDTO authorDTO = authorMapper.toDTO(saveAuthor);
                return authorDTO;
        }

        public Author getAuthorById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("Id không thể null");
                }
                return authorJPA.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy " + id));
        }

        public boolean deleteAuthor(Integer id) {
                Author author = getAuthorById(id);
                if (author.getId() == 1) {
                        throw new IllegalArgumentException("Không thể xóa tác giả này");
                }
                if (author.getProductAuthors().size() > 0) {
                        throw new IllegalArgumentException("Không thể xóa tác giả này vì đã có sản phẩm liên quan");
                }
                authorJPA.deleteById(id);
                return true;

        }

}