package com.thebugs.back_end.controllers.super_admin;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.beans.PublisherBean;
import com.thebugs.back_end.dto.PublisherDTO;
import com.thebugs.back_end.entities.Publisher;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.super_admin.PublisherService;
import com.thebugs.back_end.utils.ResponseEntityUtil;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/admin/publisher")
public class PublisherController {

        @Autowired
        private PublisherService publisherService;

        @PostMapping("/save")
        public ResponseEntity<ResponseData> postSave(@RequestBody PublisherBean publisherBean, BindingResult result) {
                try {
                        if (result.hasErrors()) {
                                String errorMessages = result.getAllErrors().stream()
                                                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                                .collect(Collectors.joining(", "));
                                return ResponseEntityUtil.badRequest("Đã xảy ra lỗi: " + errorMessages);
                        }
                        Publisher publisher = new Publisher();
                        publisher.setId(publisherBean.getId() != null ? publisherBean.getId() : null);
                        publisher.setName(publisherBean.getName().trim());
                        PublisherDTO publisherDTO = publisherService.save(publisher);
                    
                        return ResponseEntityUtil.OK("Lưu thành công", publisherDTO);
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest("Đã xảy ra lỗi: " + e.getMessage());
                }

        }

        @GetMapping("/list")
        public ResponseEntity<ResponseData> list(@RequestParam String keyword,
                        @RequestParam(defaultValue = "1") int page) {
                try {
                        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
                        List<PublisherDTO> publishers = publisherService.getPublishersByKeywordWithPagination(keyword,
                                        pageable);
                        Map<String, Object> response = Map.of(
                                        "arrayList", publishers,
                                        "totalItems", publisherService.countPublishersByKeyword(keyword));
                        return ResponseEntityUtil.OK("Lấy thông tin thành công", response);
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest("Đã xảy ra lỗi: " + e.getMessage());
                }

        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> delete(@RequestParam Integer id) {
                try {
                        return publisherService.deletePublisher(id) ? ResponseEntityUtil.OK("Xóa thành công", null)
                                        : ResponseEntityUtil.badRequest("Xóa thất bại");
                } catch (Exception e) {
                        return ResponseEntityUtil.badRequest("Đã xảy ra lỗi: " + e.getMessage());
                }

        }

}
