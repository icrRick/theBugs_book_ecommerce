package com.thebugs.back_end.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false)
    private double rate;
    @Column(nullable = false)
    private String content;
    @Column(nullable = true)
    private String reply;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date createdAt;
    @Temporal(TemporalType.DATE)
    @Column(nullable = true)
    private Date replyAt;
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date updatedAt;
}
