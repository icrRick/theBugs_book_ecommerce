package com.thebugs.back_end.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "shops")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 60)
    private String shop_slug;

    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "bank_owner_number", nullable = false, length = 100)
    private String bankOwnerNumber;

    @Column(name = "bank_owner_name", nullable = false, length = 100)
    private String bankOwnerName;

    @Column(name = "bank_provide_name", nullable = false, length = 100)
    private String bankProvideName;

    @Column(name = "total_payout", nullable = false)
    private Double totalPayout;

    @Column(length = 100)
    private String image;
    
    @Column(length = 100)
    private String banner;

    // Còn hoạt động hay không
    @Column(nullable = false)
    private boolean active;

    @Column(nullable = false)
    private boolean approve;

    @Column(nullable = true)
    private Boolean status;

    @OneToMany(mappedBy = "shop")
    private List<Product> products;
    @OneToMany(mappedBy = "shop")
    private List<Voucher> vouchers;
    @OneToMany(mappedBy = "shop")
    private List<Promotion> promotions;
    @OneToMany(mappedBy = "shop")
    private List<Order> orders;
    @OneToMany(mappedBy = "shop")
    private List<ReportShop> reportShops;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;



}
