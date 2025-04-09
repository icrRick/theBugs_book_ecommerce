package com.thebugs.back_end.controllers.super_admin;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/admin/publisher")
public class PublisherController {

        @Autowired
        private PublisherService publisherService;

        @PostMapping("/save")
        public ResponseEntity<ResponseData> postSave(@RequestBody PublisherBean publisherBean,BindingResult result) {
                ResponseData responseData = new ResponseData();
                try {
                       if (result.hasErrors()) {
                                String errorMessages = result.getAllErrors().stream()
                                                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                                                .collect(Collectors.joining(", "));
                                responseData.setStatus(false);
                                responseData.setMessage(errorMessages);
                                responseData.setData(null);
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(responseData);
                        }
                        Publisher publisher = new Publisher();
                        publisher.setId(publisherBean.getId() != null ? publisherBean.getId() : null);
                        publisher.setName(publisherBean.getName().trim());
                        PublisherDTO publisherDTO = publisherService.save(publisher);
                        responseData.setStatus(true);
                        responseData.setMessage(publisherBean.getId() != null ? "Cập nhật Publisher thành công."
                                        : "Thêm Publisher thành công.");
                        responseData.setData(publisherDTO);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Đã xảy ra lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }
        @GetMapping("/list")
        public ResponseEntity<ResponseData> list(@RequestParam String keyword,
                        @RequestParam(defaultValue = "1") int page
                     ) {
                ResponseData responseData = new ResponseData();
                try {
                        Pageable pageable = PageRequest.of(page - 1, 10, Sort.by(Sort.Order.desc("id")));
                        List<PublisherDTO> publishers = publisherService.getPublishersByKeywordWithPagination(keyword, pageable);
                        Map<String, Object> response = Map.of(
                                        "arrayList", publishers,
                                        "totalItems", publisherService.countPublishersByKeyword(keyword));
                        responseData.setStatus(true);
                        responseData.setMessage("Lấy danh sách Publisher thành công.");
                        responseData.setData(response);
                        return ResponseEntity.ok(responseData);
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Đã xảy ra lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }

        }

        @PostMapping("/delete")
        public ResponseEntity<ResponseData> delete(@RequestParam Integer id) {
                ResponseData responseData = new ResponseData();
                try {
                        boolean isDeleted = publisherService.deletePublisher(id);
                        if (isDeleted) {
                                responseData.setStatus(true);
                                responseData.setMessage("Xóa nhà xuất bản thành công.");
                                responseData.setData(null);
                                return ResponseEntity.ok(responseData);
                        } else {
                                responseData.setStatus(false);
                                responseData.setMessage("Không tìm thấy nhà xuất bản với ID: " + id);
                                responseData.setData(null);
                                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseData);
                        }
                } catch (Exception e) {
                        responseData.setStatus(false);
                        responseData.setMessage("Đã xảy ra lỗi: " + e.getMessage());
                        responseData.setData(null);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
                }
             
        }
        

}
