package com.thebugs.back_end.controllers.super_admin;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.entities.Genre;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.GenreService;
import com.thebugs.back_end.utils.CloudinaryUpload;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
                try {
                        Map<String, Object> response = new HashMap<>();
                        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
                        ArrayList<GenreDTO> genres = genreService.getGenresByKeywordWithPagination(keyword, pageable);
                        int count = genreService.totalItems(keyword);
                        response.put("arrayList", genres);
                        response.put("totalItems", count);
                        return ResponseEntityUtil.OK("Lấy thông tin thành công", response);
                } catch (Exception e) {
                        return  ResponseEntityUtil.badRequest("Lỗi: " + e.getMessage());
                }
            
        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> postDeleteGenre(@RequestParam(required = true) Integer id) {
                try {
                        return genreService.deleteGenre(id) 
                        ? ResponseEntityUtil.OK("Xóa thành công", null)
                        : ResponseEntityUtil.badRequest("Xóa thất bại");
                } catch (Exception e) {
                        return  ResponseEntityUtil.badRequest("Lỗi: " + e.getMessage());
                }
        }

        @PostMapping("/save")
        public ResponseEntity<ResponseData> postSaveGenre1(
                @RequestParam(required = false) Integer id,
                @RequestParam String name,
                @RequestParam(required = false) MultipartFile image) {
            try {
                String urlImage = (image != null && !image.isEmpty())
                        ? CloudinaryUpload.uploadImage(image)
                        : null;
                Genre genre = new Genre();
                genre.setId(id != null ? id : null);
                genre.setName(name.trim());
                genre.setUrlImage(urlImage);
                return genreService.save(genre)
                        ? ResponseEntityUtil.OK("Lưu thành công", null)
                        : ResponseEntityUtil.badRequest("Lưu thất bại");
            } catch (Exception e) {
                return ResponseEntityUtil.badRequest("Đã xảy ra lỗi: " + e.getMessage());
            }
        }
}        