package com.thebugs.back_end.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.thebugs.back_end.entities.Address;

public interface AddressJPA extends JpaRepository<Address, Integer> {

  

        @Query("SELECT a FROM Address a WHERE a.id =?1 AND a.user.id =?2")
        Optional<Address> findAddressByIdWhereUserId(Integer addressId, Integer userId);

        Optional<Address> findFirstByUserIdOrderByIdAsc(Integer userId);

        @Query("SELECT a FROM Address a WHERE a.isShop != '' AND a.user.shop.id = ?1")
        Optional<Address> getAddressShopId(Integer shopid);

}
