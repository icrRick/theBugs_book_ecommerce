package com.thebugs.back_end.services.seller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.thebugs.back_end.beans.ShopInfor_Bean;
import com.thebugs.back_end.dto.ShopInfor_DTO;
import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.repository.AddressJPA;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.repository.UserJPA;
import com.thebugs.back_end.resp.ResponseData;
import com.thebugs.back_end.services.user.AddressService;
import com.thebugs.back_end.services.user.UserService;

@Service
public class Seller_ShopInforService {
  @Autowired
  private ShopJPA g_ShopJPA;

  @Autowired
  private UserService g_UserService;

  @Autowired
  private AddressJPA g_AddressJPA;
  @Autowired
  private AddressService g_AddressService;

  @Autowired
  private UserJPA g_UserJPA;
  @Autowired
  private Seller_ImageService g_ImageService;

  public ResponseData getShopInfor(String jwtToken) {
    try {
      User user = g_UserService.getUserToken(jwtToken);
      Shop shop = user.getShop();

      ShopInfor_DTO shopDTO = new ShopInfor_DTO();
      shopDTO.setName(shop.getName());
      shopDTO.setLogoUrl(shop.getImage());
      shopDTO.setBannerUrl(shop.getBanner());
      shopDTO.setDescription(shop.getDescription());
      shopDTO.setBankOwnerName(shop.getBankOwnerName());
      shopDTO.setBankOwnerNumber(shop.getBankOwnerNumber());
      shopDTO.setBankProvideName(shop.getBankProvideName());
      shopDTO.setDescription(shop.getDescription());
      shopDTO.setShopSlug(shop.getShop_slug());

      Address address = g_AddressService.getAddressShopId(shop.getId());
      shopDTO.setAddressDetail(address.getStreet());

      shopDTO.setWardId(address.getWardId());
      shopDTO.setProvinceId(address.getProvinceId());
      shopDTO.setDistrictId(address.getDistrictId());

      shopDTO.setPhoneNumber(user.getPhone());
      shopDTO.setEmail(user.getEmail());

      return new ResponseData(true, "Load thông tin shop thành công", shopDTO, 200);
    } catch (Exception e) {
      return new ResponseData(false, "Load thông tin shop thất bại", null, 400);
    }
  }

  @Transactional
  public ResponseData updateShopInfor(String jwtToken, ShopInfor_Bean shopBean, MultipartFile logo, MultipartFile banner) {
    try {
      User user = g_UserService.getUserToken(jwtToken);
      Shop shop = user.getShop();
      if (logo != null) {
        String logoUrl = g_ImageService.uploadImage(logo);
        if (logoUrl == null) {
          return new ResponseData(false, "Cập nhật logo thất bại", null, 400);
        }
        shop.setImage(logoUrl);
      } else {
        shop.setImage(shopBean.getLogoUrl());
      }
      if (banner != null) {
        String bannerUrl = g_ImageService.uploadImage(banner);
        if (bannerUrl == null) {
          return new ResponseData(false, "Cập nhật banner thất bại", null, 400);
        }
        shop.setBanner(bannerUrl);
      } else {
        shop.setBanner(shopBean.getBannerUrl());
      }

      shop.setName(shopBean.getName());

      shop.setDescription(shopBean.getDescription());
      shop.setBankOwnerName(shopBean.getBankOwnerName());
      shop.setBankOwnerNumber(shopBean.getBankOwnerNumber());
      shop.setBankProvideName(shopBean.getBankProvideName());

      user.setEmail(shopBean.getEmail());
      user.setPhone(shopBean.getPhoneNumber());

      Address address = g_AddressService.getAddressShopId(shop.getId());
      address.setStreet(shopBean.getAddressDetail());
      address.setWardId(shopBean.getWardId());
      address.setDistrictId(shopBean.getDistrictId());
      address.setProvinceId(shopBean.getProvinceId());

      g_ShopJPA.save(shop);
      g_AddressJPA.save(address);
      g_UserJPA.save(user);
      return new ResponseData(true, "Cập nhật thông tin shop thành công", null, 200);
    } catch (Exception e) {
      return new ResponseData(false, "Cập nhật thông tin shop thất bại", null, 400);
    }
  }
}
