package com.thebugs.back_end.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String email;
    @Column(name = "phone", length = 10)
    private String phone;
    @Column
    private String avatar;
    @Column(nullable = false)

    private String fullName;
    @Column(name = "gender")
    private Boolean gender;
    @Column(name = "cccd")
    private String cccd;
    @Column(name = "verify")
    private Boolean verify;
    @Column(name = "dob")
    @Temporal(TemporalType.DATE)
    private Date dob;
    @Column(name = "active", nullable = false)
    private boolean active;

    @Column(name = "address")
    private String address;

    @OneToMany(mappedBy = "user")
    private List<Address> addresses;

    @OneToMany(mappedBy = "user")
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;

    @OneToMany(mappedBy = "user")
    private List<Review> reviews;

    @OneToMany(mappedBy = "user")
    private List<Favorite> favorites;

    @OneToMany(mappedBy = "user")
    private List<ReportProduct> reportProducts;

    @OneToMany(mappedBy = "user")
    private List<ReportShop> reportShops;

    @OneToOne(mappedBy = "user")
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;
}
