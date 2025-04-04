package com.thebugs.back_end.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String fullName;
    @Column(nullable = false, length = 10)
    private String phone;
    @Column(nullable = false)
    private int provinceId;
    @Column(nullable = false)
    private int wardId;
    @Column(nullable = false)
    private int districtId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String street;
    @Column(name = "is_shop", length = 50)
    private String isShop;

}
