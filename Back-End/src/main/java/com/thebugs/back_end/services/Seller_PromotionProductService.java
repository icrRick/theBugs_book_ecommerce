package com.thebugs.back_end.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.repository.PromotionProductJPA;

@Service
public class Seller_PromotionProductService {
    @Autowired
    private PromotionProductJPA g_PromotionProductJPA;


}
