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
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "vouchers")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false, length = 60)
    private String codeVoucher;

    @Column(nullable = false)
    private Double minTotalOrder;

    @Column(nullable = false)
    private Double maxDiscount;

    @Column(nullable = false)
    private Double discountPercentage;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date expireDate;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date createAt;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Boolean active;

    @OneToMany(mappedBy = "voucher")
    private List<Order> orders;
}
