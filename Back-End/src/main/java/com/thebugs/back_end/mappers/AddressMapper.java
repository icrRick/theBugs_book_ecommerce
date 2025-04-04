package com.thebugs.back_end.mappers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.AddressDTO;
import com.thebugs.back_end.entities.Address;

@Component
public class AddressMapper {

        public AddressDTO toDTO(Address address) {
                if (address == null) {
                        return null;
                }
                AddressDTO addressDTO = new AddressDTO();
                addressDTO.setId(address.getId());
                addressDTO.setFullName(address.getFullName());
                addressDTO.setPhone(address.getPhone());
                addressDTO.setProvinceId(address.getProvinceId());
                addressDTO.setDistrictId(address.getDistrictId());
                addressDTO.setWardId(String.valueOf(address.getWardId()));
                addressDTO.setStreet(address.getStreet());
                addressDTO.setIsShop(address.getIsShop() != null ? address.getIsShop() : "Địa chỉ nhận hàng");
                return addressDTO;
        }

        public List<AddressDTO> toDTOs(List<Address> addresses) {
                if (addresses == null) {
                        return null;
                }
                List<AddressDTO> list = new ArrayList<AddressDTO>(addresses.size());
                for (Address address : addresses) {
                        list.add(toDTO(address));
                }
                return list;
        }
}
