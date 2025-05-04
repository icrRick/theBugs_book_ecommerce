package com.thebugs.back_end.services.user;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.OAuth2UserInfo;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        OAuth2UserInfo userInfo = new OAuth2UserInfo();
        userInfo.setId((String) oauth2User.getAttribute("sub"));
        userInfo.setName((String) oauth2User.getAttribute("name"));
        userInfo.setEmail((String) oauth2User.getAttribute("email"));
        userInfo.setImageUrl((String) oauth2User.getAttribute("picture"));
        userInfo.setProvider("google");
        return oauth2User;
    }
}