package com.thebugs.back_end.services.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ReviewDTO;
import com.thebugs.back_end.repository.ProductJPA;
import com.thebugs.back_end.repository.ReviewJPA;

@Service
public class ReviewService { // Không cần abstract nếu là service cụ thể
    @Autowired
    private ReviewJPA reviewJPA;

    @Autowired
    private ProductJPA productJPA;

    // Trả về danh sách ReviewDTO theo productId
    public List<ReviewDTO> getReviewDTOsByProductId(Integer productId) {
        return reviewJPA.getReviewContentsByProductId(productId);
    }

    // Nếu bạn muốn trả về một ReviewDTO duy nhất (ví dụ: review đầu tiên)
    public ReviewDTO getFirstReviewDTO(Integer productId) {
        List<ReviewDTO> reviewContents = reviewJPA.getReviewContentsByProductId(productId);
        return reviewContents.isEmpty() ? null : reviewContents.get(0);
    }
}