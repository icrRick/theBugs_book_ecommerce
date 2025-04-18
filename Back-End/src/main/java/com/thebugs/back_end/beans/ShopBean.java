package com.thebugs.back_end.beans;

import lombok.Data;

@Data
public class ShopBean {
    private String shop_slug;
    private String name;
    private String description;
    private String bankOwnerNumber;
    private String bankOwnerName;
    private String bankProvideName;
}
