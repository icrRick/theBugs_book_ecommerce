package com.thebugs.back_end.controllers.user;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.SearchProductService;

@RestController
@RequestMapping("/search")
public class SearchProductController {
    @Autowired
    private SearchProductService searchProductService;

    @GetMapping("")
    public ResponseEntity<ResponseData> searchProduct(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, name = "genres") List<String> genreNames,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy,
            @RequestParam(required = false, defaultValue = "1") Integer page) {
        try {
            ResponseData responseData = new ResponseData();
            responseData.setStatus(true);
            responseData.setMessage("Tìm kiếm danh sách thành công");
            responseData
                    .setData(searchProductService.searchProduct(keyword, genreNames, minPrice, maxPrice, sortBy, page));
            return ResponseEntity.ok().body(responseData);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ResponseData(false, e.getMessage(), null));
        }
    }

    @PostMapping("/voice/transcribe")
    public ResponseEntity<ResponseData> transcribeVoice(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new ResponseData(false, "File âm thanh trống!", null));
            }
            ResponseData responseData = new ResponseData();
            responseData.setStatus(true);

            String transcript = searchProductService.transcribeVoice(file);
            Map<String, String> map = new HashMap<>();
            map.put("transcript", transcript);
            responseData.setData(map);
            responseData.setMessage("Nhận diện giọng nói thành công");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ResponseData(false, e.getMessage(), null));
        }
    }
}
