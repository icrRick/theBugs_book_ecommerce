package com.thebugs.back_end.services.user;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.AddressDTO;
import com.thebugs.back_end.entities.Address;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.AddressMapper;
import com.thebugs.back_end.repository.AddressJPA;

@Service
public class AddressService {

        private final AddressJPA addressJPA;
        private final AddressMapper addressMapper;
        private final UserService userService;

        public AddressService(AddressJPA addressJPA, AddressMapper addressMapper,UserService userService) {
                this.addressJPA = addressJPA;
                this.addressMapper = addressMapper;
                this.userService=userService;
        }

        public ArrayList<AddressDTO> getListAddressByUser(User user) {
                return user.getAddresses().stream()
                                .map(addressMapper::toDTO)
                                .sorted(Comparator.comparing(AddressDTO::getId).reversed())
                                .collect(Collectors.toCollection(ArrayList::new));
        }

        public AddressDTO saveAddress(Address address) {
                Address saved = addressJPA.save(address);
                return addressMapper.toDTO(saved);
        }

        public boolean deleteAddress(List<Address> addresses, Integer id) {
                for (Address address : addresses) {
                        if (address.getId() == id) {
                                addressJPA.deleteById(id);
                                return true;
                        }
                }
                return false;
        }

        public Address getAddressById(Integer id) {
                return addressJPA.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy địa chỉ có id= " + id));
        }


        public Address findAddressByIdWhereUserId(Integer addressId, Integer userId) {
                return addressJPA.findAddressByIdWhereUserId(addressId, userId)
                                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đ��a chỉ"));
        }

        public AddressDTO getAddressDTOById(Integer addressId, Integer userId) {
                Address address = findAddressByIdWhereUserId(addressId, userId);
                return addressMapper.toDTO(address);
        }


        public AddressDTO getDefault(Integer addressId, String authorizationHeader){
                Integer userId= userService.getUserToken(authorizationHeader).getId();
                Address address;
                if (addressId !=null ) {
                        address=findAddressByIdWhereUserId(addressId, userId);
                }else{
                        address=addressJPA.findFirstByUserIdOrderByIdAsc(userId).get();
                }
                return addressMapper.toDTO(address);
        }

    

        public Address getAddressShopId(Integer shopId) {
                Address address = addressJPA.getAddressShopId(shopId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy địa chỉ có id = " + shopId));
                return address;
        }


}
