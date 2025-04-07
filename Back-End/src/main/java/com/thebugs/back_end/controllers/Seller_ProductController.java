package com.thebugs.back_end.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
import com.thebugs.back_end.dto.Seller_ProductDTO;
import com.thebugs.back_end.entities.Product;
import com.thebugs.back_end.mappers.Seller_ProductConverter;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.AuthorService;
import com.thebugs.back_end.services.GenreService;
import com.thebugs.back_end.services.PublisherService;
import com.thebugs.back_end.services.Seller_ProductCRUDService;
import com.thebugs.back_end.services.UserService;
import com.thebugs.back_end.utils.ColorUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/seller")
public class Seller_ProductController {
    @Autowired
    private Seller_ProductCRUDService g_ProductService;
    @Autowired
    private UserService g_UserService;
    @Autowired
    private AuthorService g_AuthorService;
    @Autowired
    private PublisherService g_PublisherService;
    @Autowired
    GenreService g_GenreService;

    @Autowired
    Seller_ProductConverter g_ProductConverter;

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
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "DESC") String sort) {

        ColorUtil.print(ColorUtil.RED, "SearchTerm: " + keyword);
        ColorUtil.print(ColorUtil.RED, "Page: " + page);

        int pageNumber = (page == null || page < 1) ? 1 : page;
        int pageSize = (size == null || size < 1) ? 10 : size;
        int shopId = g_UserService.getUserToken(authorizationHeader).getShop().getId();
        Sort sortBy;
        if (sort.equalsIgnoreCase("DESC")) {
            sortBy = Sort.by(Sort.Order.desc("id"));
        } else {
            sortBy = Sort.by(Sort.Order.asc("id"));
        }

        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize, sortBy);
        Page<Seller_ProductDTO> pageResult = g_ProductService.getProductsByShopId(shopId, keyword, sort, pageable);
        List<Seller_ProductDTO> products = pageResult.getContent();
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
            @RequestPart("product") @Valid Seller_ProductBean productBean,
            BindingResult bindingResult,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        System.out.println("Bean1 Data: ");
        System.out.println(productBean.toString());

        if (bindingResult.hasErrors() || images == null || images.isEmpty()) {
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
        productBean.setShopId(shopId);
        // Gọi service để tạo sản phẩm
        Product product = g_ProductConverter.fromBeanToEntity(productBean);
        Map<String, Object> result = g_ProductService.createProduct(product, images);

        // Tạo ResponseData
        ResponseData responseData = new ResponseData();
        responseData.setStatus((boolean) result.get("status"));
        responseData.setMessage((String) result.get("message"));
        Object data = result.get("data");
        if (data != null) {
            responseData.setData((Seller_ProductDTO) data);
        }
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

    @PostMapping(value = "/productUpdate")
    public ResponseEntity<ResponseData> updateProduct(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart("product") @Valid Seller_ProductBean productBean,
            BindingResult bindingResult,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        ColorUtil.print(ColorUtil.GREEN, "Start Update: ");
        ColorUtil.print(ColorUtil.YELLOW, productBean.toString());
        if (bindingResult.hasErrors() || productBean.getId() == null) {
            Map<String, String> errorMap = new HashMap<>();
            Map<String, Object> errors = new HashMap<>();
            if (bindingResult.hasErrors()) {
                // Duyệt qua các lỗi và lưu thông báo lỗi theo trường
                for (FieldError fieldError : bindingResult.getFieldErrors()) {
                    errorMap.put(fieldError.getField(), fieldError.getDefaultMessage());
                }
            }
            errors.put("errorMap", errorMap);

            // Tạo response với thông báo lỗi chi tiết theo trường
            ResponseData responseData = new ResponseData();
            responseData.setStatus(false);
            // Kiểm tra bắt lỗi id null
            if (productBean.getId() == null) {
                responseData.setMessage("Không thể lấy thông tin ID sản phẩm");
            } else {
                responseData.setMessage("Yêu cầu nhập đúng các trường dữ liệu ");
            }
            responseData.setData(errors); // Trả về lỗi theo từng trường
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseData);
        }
        // Lấy shopId từ token
        int shopId = g_UserService.getUserToken(authorizationHeader).getShop().getId();
        ResponseData responseData = new ResponseData();

        if (g_ProductService.findProductByIdAndShopId(shopId, productBean.getId()) == null) {
            responseData.setStatus(false);
            responseData.setMessage("Không có quyền truy cập");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseData);
        }

        productBean.setShopId(shopId);

        Product product = g_ProductConverter.fromBeanToEntity(productBean);
        // Gọi service để tạo sản phẩm

        Map<String, Object> result = g_ProductService.updateProduct(product, productBean.getOldImage(),
                images);
        // Tạo ResponseData
        responseData.setStatus((boolean) result.get("status"));
        responseData.setMessage((String) result.get("message"));
        Object data = result.get("data");
        if (data != null) {
            responseData.setData((Seller_ProductDTO) data);
        }
        ColorUtil.print(ColorUtil.YELLOW, (String) result.get("message"));
        ColorUtil.print(ColorUtil.GREEN, "End Update: ");

        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }

    @GetMapping("/getProductById")
    public ResponseEntity<ResponseData> getProductById(@RequestHeader("Authorization") String authorizationHeader,
            @RequestParam Integer productId) {
        int shopId = g_UserService.getUserToken(authorizationHeader).getShop().getId();
        Seller_ProductDTO productDTO = g_ProductService.findProductByIdAndShopId(shopId, productId);
        int statusCode = 200;
        ResponseData responseData = new ResponseData();
        if (productDTO.getId() != null) {
            statusCode = 201;
            responseData.setStatus(true);
        } else {
            statusCode = 404;
            responseData.setStatus(false);
            responseData.setMessage("Không thể lấy thông tin sản phẩm");
        }
        responseData.setData(productDTO);
        return ResponseEntity.status(HttpStatus.valueOf(statusCode)).body(responseData);
    }

    @PostMapping("/deleteProduct")
    public ResponseEntity<ResponseData> deleteProductByIdAndShopId(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody HashMap<String, Integer> body) {
        ColorUtil.print(ColorUtil.RED, "Start Delete");
        Integer productId = body.get("productId");
        int shopId = g_UserService.getUserToken(authorizationHeader).getShop().getId();

        HashMap<String, Object> result = g_ProductService.deleteProductByIdAndShopId(shopId, productId);
        ResponseData responseData = new ResponseData();
        responseData.setStatus((boolean) result.get("status"));
        responseData.setMessage((String) result.get("message"));
        responseData.setData(productId);
        return ResponseEntity.status(HttpStatus.valueOf((int) result.get("statusCode"))).body(responseData);
    }
}
