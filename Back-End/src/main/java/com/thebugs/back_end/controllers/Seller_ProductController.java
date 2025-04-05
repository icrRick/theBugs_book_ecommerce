package com.thebugs.back_end.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.beans.Seller_ProductBean;
import com.thebugs.back_end.dto.AuthorDTO;
import com.thebugs.back_end.dto.GenreDTO;
import com.thebugs.back_end.dto.PublisherDTO;
import com.thebugs.back_end.dto.SellerProductDTO;
import com.thebugs.back_end.mappers.IrRick_SellerMapper;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.AuthorService;
import com.thebugs.back_end.services.GenreService;
import com.thebugs.back_end.services.PublisherService;
import com.thebugs.back_end.services.Seller_ProductCRUDService;
import com.thebugs.back_end.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/seller")
public class Seller_ProductController {
    @Autowired
    private Seller_ProductCRUDService g_ProductCRUDService;
    @Autowired
    private UserService g_UserService;
    @Autowired
    private AuthorService g_AuthorService;
    @Autowired
    private PublisherService g_PublisherService;
    @Autowired
    GenreService g_GenreService;

    @GetMapping("/genresList")
    public ResponseEntity<ResponseData> getPage(@RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page) {

        ResponseData responseData = new ResponseData();
        try {
            Map<String, Object> response = new HashMap<>();
            // Pageable pageable = PageRequest.of(page - 1, 10,
            // Sort.by(Sort.Order.desc("id")));
            Pageable pageable = Pageable.unpaged();
            ArrayList<GenreDTO> genres = g_GenreService.getGenresByKeywordWithPagination(keyword, pageable);
            int count = g_GenreService.totalItems(keyword);
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

    @GetMapping("/authorList")
    public ResponseEntity<ResponseData> getAllListAuthor(@RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page) {
        ResponseData responseData = new ResponseData();
        try {
            // Pageable pageable = PageRequest.of(page - 1, 10,
            // Sort.by(Sort.Order.desc("id")));
            Pageable pageable = Pageable.unpaged();
            responseData.setStatus(true);
            responseData.setMessage("Load danh sách thành công");

            // Lấy danh sách tác giả
            List<AuthorDTO> authors = g_AuthorService.searchKeyWordAndPagination(keyword, pageable);
            int totalItems = g_AuthorService.getTotal(keyword);

            Map<String, Object> response = new HashMap<>();
            response.put("arrayList", authors);
            response.put("totalItems", totalItems);

            responseData.setData(response);
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setStatus(false);
            responseData.setMessage("Error Message: " + e.getMessage());
            responseData.setData(null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
    }

    @GetMapping("/publisherList")
    public ResponseEntity<ResponseData> list(@RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page) {
        ResponseData responseData = new ResponseData();
        try {
            // Pageable pageable = PageRequest.of(page - 1, 10,
            // Sort.by(Sort.Order.desc("id")));
            Pageable pageable = Pageable.unpaged();

            // Lấy danh sách nhà xuất bản
            List<PublisherDTO> publishers = g_PublisherService.getPublishersByKeywordWithPagination(keyword, pageable);
            int totalItems = g_PublisherService.countPublishersByKeyword(keyword);

            Map<String, Object> response = new HashMap<>();
            response.put("arrayList", publishers);
            response.put("totalItems", totalItems);

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

    @GetMapping("/productList")
    public ResponseEntity<ResponseData> getProductsByShop(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        if (authorizationHeader != null) {
            System.out.println("ABC: " + authorizationHeader);
        }
        int pageNumber = (page == null || page < 1) ? 1 : page;
        int pageSize = (size == null || size < 1) ? 10 : size;
        int shopId = g_UserService.getUserToken(authorizationHeader).getShop().getId();

        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        Page<SellerProductDTO> pageResult = g_ProductCRUDService.getProductsByShopId(pageable, shopId);
        List<SellerProductDTO> products = pageResult.getContent();
        long totalItems = pageResult.getTotalElements();
        Map<String, Object> result = new HashMap<>();
        result.put("products", products);
        result.put("totalItems", totalItems);
        ResponseData response;
        if (!products.isEmpty()) {
            response = new ResponseData(true, "Load thành công", result);
            return ResponseEntity.ok(response);
        } else {
            response = new ResponseData(false, "Load thất bại", null);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        }
    }

    @PostMapping(value = "/productCreate")
    public ResponseEntity<ResponseData> createProduct(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("product") @Valid Seller_ProductBean productSellerBean,
            BindingResult bindingResult,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        System.out.println("Bean2 Data: ");
        System.out.println(productSellerBean.toString());

        if (bindingResult.hasErrors() || images == null|| images.isEmpty()) {
            Map<String, String> errorMap = new HashMap<>();
            Map<String, Object> errors = new HashMap<>();
            if (bindingResult.hasErrors()) {
                // Duyệt qua các lỗi và lưu thông báo lỗi theo trường
                for (FieldError fieldError : bindingResult.getFieldErrors()) {
                    errorMap.put(fieldError.getField(), fieldError.getDefaultMessage());
                }
            }
            if (images == null || images.isEmpty()) {
                errorMap.put("images", "Vui lòng thêm ít nhất 1 ảnh cho sản phẩm");
            }
            errors.put("errorMap", errorMap);

            // Tạo response với thông báo lỗi chi tiết theo trường
            ResponseData responseData = new ResponseData();
            responseData.setStatus(false);
            responseData.setMessage("Yêu cầu nhập đúng các trường dữ liệu ");
            responseData.setData(errors); // Trả về lỗi theo từng trường

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
        // Lấy shopId từ token
        int shopId = g_UserService.getUserToken(authorizationHeader).getShop().getId();
        productSellerBean.setShopId(shopId);
        // Gọi service để tạo sản phẩm
        SellerProductDTO sellerProductDTO = IrRick_SellerMapper.fromProductBeanToDTO(productSellerBean);

        Map<String, Object> result = g_ProductCRUDService.createProduct(sellerProductDTO, images);

        // Tạo ResponseData
        ResponseData responseData = new ResponseData();
        responseData.setStatus((boolean) result.get("status"));
        responseData.setMessage((String) result.get("message"));
        Object data = result.get("data");
        if (data != null) {
            responseData.setData((SellerProductDTO) data);
        }
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

}
