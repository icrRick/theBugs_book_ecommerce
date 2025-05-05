package com.thebugs.back_end.services.seller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.Statistical_DTO.Child_Chart_DTO;
import com.thebugs.back_end.dto.Statistical_DTO.Child_Product_DTO;
import com.thebugs.back_end.dto.Statistical_DTO.Child_Table_DTO;
import com.thebugs.back_end.repository.StatisticalProductJPA;
import com.thebugs.back_end.repository.StatisticalRevenueJPA;

@Service
public class Seller_StatisticalService {
  @Autowired
  private StatisticalProductJPA g_StatisticalProductJPA;

  @Autowired
  private StatisticalRevenueJPA g_StatisticalRevenueJPA;

  public int countAllProductByShopId(int shopId) {

    return g_StatisticalProductJPA.countAllProductByShopId(shopId);
  }

  public int countSoldProductByShopId(int shopId, LocalDate startDate, LocalDate endDate) {
    return g_StatisticalRevenueJPA.countSoldProductByShopId(shopId, startDate, endDate);
  }

  public List<Child_Product_DTO> findSellingProductWithImage(int shopId, LocalDate startDate, LocalDate endDate) {
    Sort sort = Sort.by(Sort.Direction.DESC, "countSold");
    return g_StatisticalRevenueJPA.findSellingProductWithImage(shopId, startDate, endDate, sort);
  }

  public List<Child_Chart_DTO> getChartDataGenresProductByShopId(int shopId) {
    Sort sort = Sort.by(Sort.Direction.DESC, "countGenre");
    return g_StatisticalProductJPA.getChartDataGenresProductByShopId(shopId, sort);
  }

  public List<Child_Chart_DTO> getChartDataWarehouseProductByShopId(int shopId) {
    return g_StatisticalProductJPA.getChartDataProductStatusByShopId(shopId);
  }

  public List<Child_Table_DTO> getChartDataRevenueByShopId(int shopId, LocalDate startDate, LocalDate endDate) {
    Sort sort = Sort.by(Sort.Direction.DESC, "soldProduct");
    List<Object[]> data = g_StatisticalProductJPA.getProductSummaryByShopId(shopId, startDate, endDate, sort);
    List<Child_Table_DTO> childTableDTOList = mapToChildTableDTOList(data);
    return childTableDTOList;
  }

  private List<Child_Table_DTO> mapToChildTableDTOList(List<Object[]> results) {
    List<Child_Table_DTO> dtoList = new ArrayList<>();
    for (Object[] row : results) {
      Child_Table_DTO dto = new Child_Table_DTO();
      dto.setProductName((String) row[0]);
      dto.setProductCode((String) row[1]);
      dto.setGenre((String) row[2]);
      dto.setSoldProduct(row[3] != null ? ((Number) row[3]).longValue() : 0L);
      dto.setWareHouseProduct(row[4] != null ? ((Number) row[4]).intValue() : 0);
      dto.setRevenue(row[5] != null ? ((Number) row[5]).doubleValue() : 0.0);
      dtoList.add(dto);
    }
    return dtoList;
  }
}
