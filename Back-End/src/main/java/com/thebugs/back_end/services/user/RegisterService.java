package com.thebugs.back_end.services.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.entities.User;
import com.thebugs.back_end.mappers.UserMapper;
import com.thebugs.back_end.repository.RoleJPA;
import com.thebugs.back_end.repository.UserJPA;

@Service
public class RegisterService {

        private final UserJPA userJPA;
        private final RoleJPA roleJPA;
        private final UserMapper userMapper;
        private final BCryptPasswordEncoder passwordEncoder;

        public RegisterService(UserJPA userJPA, UserMapper userMapper, RoleJPA roleJPA) {
                this.userJPA = userJPA;
                this.userMapper = userMapper;
                this.roleJPA = roleJPA;
                this.passwordEncoder = new BCryptPasswordEncoder();
        }

        public UserDTO Register(String fullName, String email, String password, String cfPassword) {
                User user = new User();
                user.setFullName(fullName);
           
                user.setEmail(email);
                user.setActive(true);
                user.setRole(roleJPA.findById(1).get());
                user.setVerify(false);
                userJPA.findByEmailExist(user.getId(), user.getEmail())
                                .ifPresent(u -> {
                                        throw new IllegalArgumentException("Email đã được sử dụng");
                                });

                if (!password.equals(cfPassword)) {
                        throw new IllegalArgumentException("Mật khẩu không khớp");
                }
                user.setPassword(passwordEncoder.encode(password));
              
                User userRegister = userJPA.save(user);
                return userMapper.toDTO(userRegister);
        }
}
