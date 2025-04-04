package com.thebugs.back_end.beans;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProfileBean {
        private String cccd;
        private String fullName;
        private String email;
        private String phone;
        private Boolean gender;
        private String address;
        private Date dob;
}
