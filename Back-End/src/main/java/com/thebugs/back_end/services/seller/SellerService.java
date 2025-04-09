package com.thebugs.back_end.services.seller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.entities.OrderStatus;
import com.thebugs.back_end.entities.Shop;
import com.thebugs.back_end.repository.ShopJPA;
import com.thebugs.back_end.services.user.UserService;

@Service
public class SellerService {

        @Autowired
        private ShopJPA shopJPA;
        @Autowired
        private UserService userService;

        public boolean registerSeller() {

                return false;
        }

        public Shop getShopById(Integer id) {
                if (id == null) {
                        throw new IllegalArgumentException("ID không được null");
                }
                return shopJPA.findById(id).orElseThrow(() -> new IllegalArgumentException(
                                "Không tìm thấy đối tượng OrderStatus có id= " + id));
        }

}
