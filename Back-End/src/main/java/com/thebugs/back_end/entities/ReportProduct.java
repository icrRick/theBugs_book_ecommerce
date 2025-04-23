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
@Table(name = "report_products")
public class ReportProduct {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @ManyToOne
        @JoinColumn(name = "product_id", nullable = false)
        private Product product;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Temporal(TemporalType.DATE)
        @Column(nullable = false)
        private Date createAt;

        @Temporal(TemporalType.DATE)
        @Column(nullable = false)
        private Date approvalDate;

        @Column(nullable = false)
        private String note;
        @Column(nullable = false)
        private String url;
        @Column
        private Boolean active;

        @OneToMany(mappedBy = "reportProduct")
        private List<ReportProductImage> reportProductImages;
}
