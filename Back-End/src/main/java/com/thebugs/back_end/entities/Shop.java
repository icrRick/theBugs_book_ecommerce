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

    @Column(name = "account_number", nullable = false, length = 100)
    private String accoutNumber;

    @Column(name = "account_name", nullable = false, length = 100)
    private String accoutName;

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "total_payout", nullable = false)
    private Double totalPayout;

    @Column(length = 100)
    private String image;
    
    // Còn hoạt động hay không
    @Column(nullable = false)
    private boolean active;

    @Column(nullable = false)
    private boolean approve;

    @Column(nullable = false)
    private boolean status;

    @Column(nullable = false)
    private String shopSlug;

    @OneToMany(mappedBy = "shop")
    private List<Product> products;
    @OneToMany(mappedBy = "shop")
    private List<Voucher> vouchers;
    @OneToMany(mappedBy = "shop")
    private List<Promotion> promotions;
    @OneToMany(mappedBy = "shop")
    private List<Order> orders;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
