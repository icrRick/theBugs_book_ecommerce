package com.thebugs.back_end.services.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.ProItemDTO;
import com.thebugs.back_end.entities.Favorite;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.FavoriteMapper;
import com.thebugs.back_end.repository.FavoriteJPA;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteJPA favoriteJPA;
    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private FavoriteMapper favoriteMapper;

    public List<ProItemDTO> getListFavorite(String authorizationHeader) {
        User user = userService.getUserToken(authorizationHeader);

        return favoriteMapper.toDtos(user.getFavorites());
    }

    public boolean isFavorite(Integer userId, Integer productId) {
        return favoriteJPA.existsByUserIdAndProductId(userId, productId);
    }

    public Favorite addAndRemoveFavorite(String authorizationHeader, Integer productId) {
        User user = userService.getUserToken(authorizationHeader);
        Favorite favorite = favoriteJPA.findByUserIdAndProductId(user.getId(), productId).orElse(null);
        if (favorite != null) {
            favoriteJPA.delete(favorite);
            return null;
        } else {
            Favorite newFavorite = new Favorite();
            newFavorite.setUser(user);
            newFavorite.setProduct(productService.getProductById(productId));
            return favoriteJPA.save(newFavorite);
        }
    }

}
