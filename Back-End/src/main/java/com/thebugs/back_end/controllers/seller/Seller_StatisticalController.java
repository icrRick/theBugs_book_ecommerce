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

import java.math.BigDecimal;
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

  @GetMapping("/test")
  public Object getMethodName() {
    return null;
  }

  @GetMapping("")
  public ResponseEntity<ResponseData> getStatisticalProducts(@RequestHeader("Authorization") String token,
      @RequestParam(value = "startDate", required = false) String startDate,
      @RequestParam(value = "endDate", required = false) String endDate) {

    int shopId = g_UserService.getUserToken(token).getShop().getId();

    ProductStatistical_DTO statistical_DTO = new ProductStatistical_DTO();

    List<Child_Product_DTO> childProducts = g_Seller_StatisticalService.findSellingProductWithImage(shopId);
    int countAllProducts = g_Seller_StatisticalService.countAllProductByShopId(shopId);
    int countSoldProducts = g_Seller_StatisticalService.countSoldProductByShopId(shopId);
    List<Child_Chart_DTO> childGenresChart = g_Seller_StatisticalService.getChartDataGenresProductByShopId(shopId);
    List<Child_Chart_DTO> childWarehouseChart = g_Seller_StatisticalService
        .getChartDataWarehouseProductByShopId(shopId);
    List<Child_Table_DTO> childTable = g_Seller_StatisticalService.getChartDataRevenueByShopId(shopId);

    statistical_DTO.setMostSoldProduct(childProducts.getFirst());
    statistical_DTO.setLeastSoldProduct(childProducts.getLast());
    statistical_DTO.setAllProduct(countAllProducts);
    statistical_DTO.setSoldProduct(countSoldProducts);
    statistical_DTO.setChart_GenresProduct(childGenresChart);
    statistical_DTO.setChart_WareHouseProduct(childWarehouseChart);
    statistical_DTO.setTable_ProductStatistical(childTable);

    ResponseData responseData = new ResponseData(true, "Thống kê sản phẩm thành công", statistical_DTO);

    return ResponseEntity.status(HttpStatus.valueOf(201)).body(responseData);
  }

  @GetMapping("/revenue")
  public String getStatisticalRevenue(@RequestHeader("Authorization") String token,
      @RequestParam(value = "startDate", required = false) String startDate,
      @RequestParam(value = "endDate", required = false) String endDate) {

    return new String();
  }
}
