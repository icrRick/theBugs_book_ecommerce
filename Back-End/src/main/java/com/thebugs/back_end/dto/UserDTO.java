package com.thebugs.back_end.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {
        private Integer id;
        private String cccd;
        private String fullName;
        private String email;
        private String phone;
        private Boolean gender;
        private String address;
        private Date dob;
        private int role;
}
