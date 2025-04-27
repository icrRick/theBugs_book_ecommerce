package com.thebugs.back_end.services.super_admin;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.entities.Author;
import com.thebugs.back_end.mappers.AuthorMapper;
import com.thebugs.back_end.repository.AuthorJPA;

@Service
public class AuthorService {
        @Autowired
        private AuthorJPA authorJPA;
        @Autowired
        private AuthorMapper authorMapper;

        public List<AuthorDTO> getAllListAndSearchKeyWord(String keyword, Pageable pageable) {
                Page<Author> authorPageable;
                if (keyword == null || keyword.isEmpty()) {
                        authorPageable = authorJPA.findAll(pageable);
                } else {
                        authorPageable = authorJPA.findByNameAuthor(keyword, pageable);
                }

                return authorPageable.stream().map(authorMapper::toDTO).collect(Collectors.toList());
        }

        public int totalItems(String keyword) {
                if (keyword == null || keyword.isEmpty()) {
                        return (int) authorJPA.count();
                } else {
                        return authorJPA.countFindByName(keyword);
                }
        }

        public AuthorDTO addAuthor(Author author) {
                authorJPA.findByNameExist(null, author.getName())
                                .ifPresent(a -> {
                                        throw new IllegalArgumentException("Tên tác giả đã tồn tại");
                                });
                Author savedAuthor = authorJPA.save(author);
                return authorMapper.toDTO(savedAuthor);

        }

        public AuthorDTO updateAuthor(Author author) {
                Author existAuthor = getAuthorById(author.getId());
                authorJPA.findByNameExist(existAuthor.getId(), existAuthor.getName())
                                .ifPresent(a -> {
                                        throw new IllegalArgumentException("Tên tác giả đã tồn tại");
                                });
                Author savedAuthor = authorJPA.save(author);
                return authorMapper.toDTO(savedAuthor);
        }

        public Boolean deleteAuthor(Integer id) {
                Author author = getAuthorById(id);
                if (author.getId() == 1) {
                        throw new IllegalArgumentException("Không thể xóa tác giả này");
                }
                if (author.getProductAuthors().size() > 0) {
                        throw new IllegalArgumentException("Tác giả đã có sản phẩm, không thể xóa");
                }

                authorJPA.deleteById(id);
                return true;
        }

        public Author getAuthorById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("Id không thể null");
                }
                return authorJPA.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy " + id));
        }

        public List<AuthorDTO> findDistinctAuthorsByShopSlug(String shopSlug) {
                List<Author> authors = authorJPA.findDistinctAuthorsByShopSlug(shopSlug);
                return authors.stream()
                                .map(authorMapper::toDTO)
                                .sorted(Comparator.comparing(AuthorDTO::getId).reversed())
                                .collect(Collectors.toList());
        }
}