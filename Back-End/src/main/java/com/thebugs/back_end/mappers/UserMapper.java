package com.thebugs.back_end.mappers;

import org.springframework.stereotype.Component;

import com.thebugs.back_end.dto.UserDTO;
import com.thebugs.back_end.entities.Role;
import com.thebugs.back_end.entities.User;

@Component
public class UserMapper {
        public UserDTO toDTO(User user) {
                if (user == null) {
                        return null;
                }
                UserDTO userDTO = new UserDTO();
                Integer id = userRoleId(user);
                if (id != null) {
                        userDTO.setRole(id);
                }
                userDTO.setId(user.getId());
                userDTO.setFullName(user.getFullName());
                userDTO.setEmail(user.getEmail());
                userDTO.setPhone(user.getPhone());
                userDTO.setCccd(user.getCccd());
                userDTO.setGender(user.getGender() != null ? user.getGender() : null);
                userDTO.setAddress(user.getAddress());
                userDTO.setDob(user.getDob());
                return userDTO;
        }

        private Integer userRoleId(User user) {
                Role role = user.getRole();
                if (role == null) {
                        return null;
                }
                return role.getId();
        }
}
