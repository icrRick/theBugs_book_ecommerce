package com.thebugs.back_end.services.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.thebugs.back_end.dto.HomeProductDTO;
import com.thebugs.back_end.repository.ProductJPA;
import java.util.ArrayList;
import java.util.stream.Collectors;
@Service
public class ProductHomeService {

        @Autowired
        private ProductJPA productJPA;

        public ArrayList<HomeProductDTO> AllProduct(Pageable pageable) {
                return productJPA.getHomeProducts(pageable).stream().collect(Collectors.toCollection(ArrayList::new));
        }
}
