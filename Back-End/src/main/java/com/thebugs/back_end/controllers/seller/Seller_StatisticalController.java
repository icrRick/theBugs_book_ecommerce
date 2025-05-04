package com.thebugs.back_end.controllers.seller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thebugs.back_end.dto.Statistical_DTO.Child_Chart_DTO;
import com.thebugs.back_end.dto.Statistical_DTO.Child_Product_DTO;
import com.thebugs.back_end.dto.Statistical_DTO.Child_Table_DTO;
import com.thebugs.back_end.dto.Statistical_DTO.ProductStatistical_DTO;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.seller.Seller_StatisticalService;
import com.thebugs.back_end.services.user.UserService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/seller/statistical")
public class Seller_StatisticalController {
  @Autowired
  private Seller_StatisticalService g_Seller_StatisticalService;

  @Autowired
  private UserService g_UserService;

  @GetMapping("")
  public ResponseEntity<ResponseData> getStatisticalProducts(@RequestHeader("Authorization") String token,
      @RequestParam(required = false) String startDate,
      @RequestParam(required = false) String endDate) {
    try {
      int shopId = g_UserService.getUserToken(token).getShop().getId();
      DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
      System.out.println("COntrollerne");
      // Parse String → LocalDate hoặc gán mặc định
      LocalDate end = (endDate != null) ? LocalDate.parse(endDate, formatter) : LocalDate.now();
      LocalDate start = (startDate != null) ? LocalDate.parse(startDate, formatter) : end.minusDays(30);

      ProductStatistical_DTO statistical_DTO = new ProductStatistical_DTO();

      List<Child_Product_DTO> childProducts = g_Seller_StatisticalService.findSellingProductWithImage(shopId, start,
          end);

      int countAllProducts = g_Seller_StatisticalService.countAllProductByShopId(shopId);
      int countSoldProducts = g_Seller_StatisticalService.countSoldProductByShopId(shopId, start, end);

      List<Child_Chart_DTO> childGenresChart = g_Seller_StatisticalService.getChartDataGenresProductByShopId(shopId);
      List<Child_Chart_DTO> childWarehouseChart = g_Seller_StatisticalService
          .getChartDataWarehouseProductByShopId(shopId);
      List<Child_Table_DTO> childTable = g_Seller_StatisticalService.getChartDataRevenueByShopId(shopId, start,
          end);
      if (childProducts.size() > 0) {
        statistical_DTO.setMostSoldProduct(childProducts.getFirst());
        statistical_DTO.setLeastSoldProduct(childProducts.getLast());
      }
      statistical_DTO.setAllProduct(countAllProducts);
      statistical_DTO.setSoldProduct(countSoldProducts);
      statistical_DTO.setChart_GenresProduct(childGenresChart);
      statistical_DTO.setChart_WareHouseProduct(childWarehouseChart);
      statistical_DTO.setTable_ProductStatistical(childTable);

      ResponseData responseData = new ResponseData(true, "Thống kê sản phẩm thành công", statistical_DTO);
      return ResponseEntity.status(HttpStatus.valueOf(201)).body(responseData);
    } catch (Exception e) {
      ResponseData responseData = new ResponseData(false, "Thống kê sản phẩm thất bại", null);
      return ResponseEntity.status(HttpStatus.valueOf(401)).body(responseData);
    }
  }

  @GetMapping("/revenue")
  public String getStatisticalRevenue(@RequestHeader("Authorization") String token,
      @RequestParam(value = "startDate", required = false) String startDate,
      @RequestParam(value = "endDate", required = false) String endDate) {

    return new String();
  }
}
