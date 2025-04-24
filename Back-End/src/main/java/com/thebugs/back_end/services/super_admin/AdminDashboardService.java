package com.thebugs.back_end.services.super_admin;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.repository.AuthorJPA;
import com.thebugs.back_end.repository.GenreJPA;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.PublisherJPA;
import com.thebugs.back_end.repository.ShopJPA;

@Service
public class AdminDashboardService {

    @Autowired
    private ProductJPA productJPA;
    @Autowired
    private GenreJPA genreJPA;
    @Autowired
    private AuthorJPA authorJPA;
    @Autowired
    private PublisherJPA publisherJPA;

    @Autowired
    private ShopJPA shopJPA;

    public Object getDashboard() {
        Map<String, Object> map = new HashMap<>();

        map.put("totalGenres", genreJPA.findAll().size());
        map.put("totalProducts", productJPA.findAll().size());
        map.put("totalAuthors", authorJPA.findAll().size());
        map.put("totalPublishers", publisherJPA.countfindAll());
        map.put("totalShops", shopJPA.findAll().size());

        map.put("activeTrueShops", shopJPA.countShopByActiveTrue());
        map.put("approveNullShops", shopJPA.countShopByApproveNull());
        map.put("statusTrueShops", shopJPA.countShopByStatusTrue());
        map.put("activeTrueProducts", productJPA.countProductByActiveTrue());
        map.put("approveNullProducts", productJPA.countProductByApproveNull());
        map.put("statusTrueProducts", productJPA.countProductByStatusTrue());
        return map;
    }

}
