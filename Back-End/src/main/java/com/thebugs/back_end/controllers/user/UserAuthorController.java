package com.thebugs.back_end.controllers.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.AuthorDetailService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

@RestController
@RequestMapping("/author")
public class UserAuthorController {
    @Autowired
    private AuthorDetailService authorDetailService;

    @GetMapping("/list")
    public ResponseEntity<ResponseData> getAllAuthor(@RequestParam(defaultValue = "1") Integer page) {
        try {
            Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));

            return ResponseEntityUtil.OK("Tải danh sách thành công", authorDetailService.getAllAuthor(pageable));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi" + e.getMessage());
        }
    }

    @GetMapping("/detail")
    public ResponseEntity<ResponseData> getAllAuthor(@RequestParam int id) {
        try {

            return ResponseEntityUtil.OK("Tải danh sách thành công", authorDetailService.getAuthorDetail(id));
        } catch (Exception e) {
            return ResponseEntityUtil.badRequest("Lỗi" + e.getMessage());
        }
    }

}
