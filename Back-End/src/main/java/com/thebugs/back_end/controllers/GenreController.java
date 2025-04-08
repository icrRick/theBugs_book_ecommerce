package com.thebugs.back_end.controllers;

import org.springframework.web.bind.annotation.RestController;
import com.thebugs.back_end.beans.GenreBean;
import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.GenreService;
import com.thebugs.back_end.utils.CloudinaryUpload;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/admin/genre")
public class GenreController {

        private final GenreService genreService;

        public GenreController(GenreService genreService) {
                this.genreService = genreService;
        }

        @GetMapping("/list")
        public ResponseEntity<ResponseData> getPage(@RequestParam(required = false) String keyword,
                        @RequestParam(defaultValue = "1") int page) {

                ResponseData responseData = new ResponseData();
                try {
                        Map<String, Object> response = new HashMap<>();
                        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
                        ArrayList<GenreDTO> genres = genreService.getGenresByKeywordWithPagination(keyword, pageable);
                        int count = genreService.totalItems(keyword);
                        response.put("arrayList", genres);
                        response.put("totalItems", count);
                        responseData.setStatus(true);
                        responseData.setMessage("Load thành công");
                        responseData.setData(response);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Lỗi genre" + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
                return ResponseEntity.ok(responseData);
        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> postDeleteGenre(@RequestParam(required = true) Integer id) {

                ResponseData responseData = new ResponseData();
                try {
                        boolean check = genreService.deleteGenre(id);
                        if (check) {
                                responseData.setStatus(true);
                                responseData.setMessage("Xóa thành công");
                                responseData.setData(null);
                        } else {
                                responseData.setStatus(false);
                                responseData.setMessage("Xóa thất bại");
                                responseData.setData(null);
                        }

                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(new ResponseData(false, e.getMessage(), null));
                }
        }

        @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ResponseData> postSaveGenre(
                        @ModelAttribute GenreBean genreBean) {
                ResponseData responseData = new ResponseData();
                try {
                        String urlImage = null;
                        
                        if (genreBean.getImage() != null && !genreBean.getImage().isEmpty()) {
                                System.out.println("Image: " + genreBean.getImage().getOriginalFilename());
                                urlImage = CloudinaryUpload.uploadImage(genreBean.getImage());
                        } else {
                                System.out.println("No image provided");
                        }
                        Genre genre = new Genre();
                        genre.setName(genreBean.getName().trim());
                        genre.setUrlImage(urlImage);
                        GenreDTO genreDTO = genreService.add(genre);
                        responseData.setStatus(true);
                        responseData.setMessage("Lưu thành công");
                        responseData.setData(genreDTO);
                        return ResponseEntity.ok(responseData);

                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Đã xảy ra lỗi: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
                }
        }

        @PostMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ResponseData> postUpdateGenre( @RequestParam Integer id,
                        @ModelAttribute GenreBean genreBean) {
                ResponseData responseData = new ResponseData();
                try {
                        String urlImage = null;
                        if (genreBean.getImage() != null && !genreBean.getImage().isEmpty()) {
                                System.out.println("Image: " + genreBean.getImage().getOriginalFilename());
                                urlImage = CloudinaryUpload.uploadImage(genreBean.getImage());
                        } else {
                                System.out.println("No image provided");
                        }
                        Genre genre = new Genre();
                        genre.setId(id);
                        genre.setName(genreBean.getName().trim());
                        genre.setUrlImage(urlImage);
                        GenreDTO genreDTO = genreService.update(genre);
                        responseData.setStatus(true);
                        responseData.setMessage("Lưu thành công");
                        responseData.setData(genreDTO);
                        return ResponseEntity.ok(responseData);

                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Đã xảy ra lỗi: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
                }
        }

}