package com.thebugs.back_end.controllers.super_admin;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
                        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
                        responseData.setStatus(true);
                        responseData.setMessage("Load danh sách thành công");

                        Map<String, Object> response = Map.of(
                                        "arrayList", authorService.searchKeyWordAndPagination(keyword, pageable),
                                        "totalItems", authorService.getTotal(keyword));
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

        @PostMapping(value = "/add", consumes =MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ResponseData> postAddAuthor( @ModelAttribute AuthorBean authorBean) {
                ResponseData responseData = new ResponseData();
                try {
                        String urlImage = null;
                        if (authorBean.getImage() != null && !authorBean.getImage().isEmpty()) {
                                System.out.println("Image: " + authorBean.getImage().getOriginalFilename());
                                urlImage = CloudinaryUpload.uploadImage(authorBean.getImage());
                        } else {
                                System.out.println("No image provided");
                        }
                        Author author = new Author();
                        author.setName(authorBean.getName());
                        author.setUrlImage(urlImage);
                        author.setUrlLink(authorBean.getUrlLink());
                        AuthorDTO authorDTO = authorService.add(author);

                        responseData.setStatus(true);
                        responseData.setMessage("Thêm tác giả thành công");
                        responseData.setData(authorDTO);
                        return ResponseEntity
                                        .ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(responseData);
                }

        }

        @PostMapping(value = "/update", consumes =MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ResponseData> postUpdateAuthor(@RequestParam Integer id, @ModelAttribute AuthorBean authorBean) {
                ResponseData responseData = new ResponseData();
                try {
                        String urlImage = null;
                        if (authorBean.getImage() != null && !authorBean.getImage().isEmpty()) {
                                System.out.println("Image: " + authorBean.getImage().getOriginalFilename());
                                urlImage = CloudinaryUpload.uploadImage(authorBean.getImage());
                        } else {
                                System.out.println("No image provided");
                        }
                        Author author = new Author();
                        author.setId(id);
                        author.setName(authorBean.getName());
                        author.setUrlImage(urlImage);
                        author.setUrlLink(authorBean.getUrlLink());
                        AuthorDTO authorDTO = authorService.update(author);

                        responseData.setStatus(true);
                        responseData.setMessage("Cập nhật tác giả thành công");
                        responseData.setData(authorDTO);
                        return ResponseEntity
                                        .ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(responseData);
                }

        }
        @PostMapping("/delete")
        public ResponseEntity<ResponseData> deleteAuthor(@RequestParam Integer id) {
                ResponseData responseData = new ResponseData();
                try {

                        boolean deleteAuthor = authorService.deleteAuthor(id);

                        if (deleteAuthor) {
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