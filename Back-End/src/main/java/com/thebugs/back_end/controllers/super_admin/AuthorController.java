package com.thebugs.back_end.controllers.super_admin;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.AuthorBean;
import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.entities.Author;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.AuthorService;
import com.thebugs.back_end.utils.CloudinaryUpload;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/admin/author")
public class AuthorController {
        @Autowired
        AuthorService authorService;

        @GetMapping("/list")
        public ResponseEntity<ResponseData> getAllListAuthor(@RequestParam(required = false) String keyword,
                        @RequestParam(defaultValue = "1") int page) {

                ResponseData responseData = new ResponseData();
                try {
                        Pageable pageable = PageRequest.of(page - 1, 9, Sort.by(Sort.Order.desc("id")));
                        responseData.setStatus(true);
                        responseData.setMessage("Load danh sách thành công");

                        Map<String, Object> response = Map.of(
                                        "arrayList", authorService.getAllListAndSearchKeyWord(keyword, pageable),
                                        "totalItems", authorService.totalItems(keyword));
                        responseData.setData(response);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Error Message: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(responseData);
                }
        }

        @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ResponseData> postAddAuthor(@Valid @ModelAttribute AuthorBean authorBean,
                        BindingResult result) {
                ResponseData responseData = new ResponseData();
                if (result.hasErrors()) {
                        String errorMessages = result.getAllErrors()
                                        .stream()
                                        .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                        .collect(Collectors.joining("; "));
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + errorMessages);
                        return ResponseEntity.badRequest().body(responseData);
                }
                try {
                        String urlImage = null;
                        if (authorBean.getImage() != null && !authorBean.getImage().isEmpty()) {
                                urlImage = CloudinaryUpload.uploadImage(authorBean.getImage());
                        }

                        Author author = new Author();
                        author.setName(authorBean.getName());
                        author.setUrlImage(urlImage);
                        author.setUrlLink(authorBean.getUrlLink());

                        AuthorDTO updatedAuthor = authorService.addAuthor(author);

                        responseData.setStatus(true);
                        responseData.setMessage("Cập nhật tác giả thành công");
                        responseData.setData(updatedAuthor);
                        return ResponseEntity.ok(responseData);

                } catch (IOException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi upload ảnh: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);

                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }

        @PostMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ResponseData> updateAuthor(@RequestParam Integer id,
                        @Valid @ModelAttribute AuthorBean authorBean, BindingResult result) {
                ResponseData responseData = new ResponseData();
                if (result.hasErrors()) {
                        String errorMessages = result.getAllErrors()
                                        .stream()
                                        .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                        .collect(Collectors.joining("; "));
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + errorMessages);
                        return ResponseEntity.badRequest().body(responseData);
                }

                try {
                        String urlImage = null;
                        if (authorBean.getImage() != null && !authorBean.getImage().isEmpty()) {
                                urlImage = CloudinaryUpload.uploadImage(authorBean.getImage());
                        }

                        Author author = new Author();
                        author.setId(id);
                        author.setName(authorBean.getName());
                        author.setUrlImage(urlImage);
                        author.setUrlLink(authorBean.getUrlLink());

                        AuthorDTO updatedAuthor = authorService.updateAuthor(author);

                        responseData.setStatus(true);
                        responseData.setMessage("Cập nhật tác giả thành công");
                        responseData.setData(updatedAuthor);
                        return ResponseEntity.ok(responseData);

                } catch (IOException e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi upload ảnh: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);

                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
        }

        @DeleteMapping("/delete/{id}")
        public ResponseEntity<ResponseData> deleteAuthor(@RequestParam Integer id) {
                ResponseData responseData = new ResponseData();
                try {

                        if (authorService.deleteAuthor(id)) {
                                responseData.setStatus(true);
                                responseData.setMessage("Xoá tác giả thành công");
                                responseData.setData(null);
                                return ResponseEntity.ok(responseData);
                        } else {
                                responseData.setStatus(false);
                                responseData.setMessage("Không thể xoá tác giả vì đã sử dụng");
                                responseData.setData(null);
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(responseData);
                        }

                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Error Message: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(responseData);
                }

        }

        

}