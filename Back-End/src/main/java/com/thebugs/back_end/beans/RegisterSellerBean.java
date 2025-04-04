package com.thebugs.back_end.beans;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterSellerBean {
        private String name;
        private String address;
        private String description;
        private String image;
        private boolean active;
}
