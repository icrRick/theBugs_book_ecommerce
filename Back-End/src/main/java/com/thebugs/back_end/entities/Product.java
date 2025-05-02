package com.thebugs.back_end.entities;

import java.util.List;
import java.time.LocalDate;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false)
    private double weight;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private boolean active;

    @Column
    private Boolean approve;

    @Column
    private Boolean status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String product_code;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt = LocalDate.now(); //

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    @OneToMany(mappedBy = "product")
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "product")
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductGenre> productGenres;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductAuthor> productAuthors;

    @OneToMany(mappedBy = "product")
    private List<Favorite> favorites;

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PromotionProduct> promotionProducts;

    @OneToMany(mappedBy = "product")
    private List<ReportProduct> reportProducts;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @ManyToOne
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    public String getFirstImageName() {
        if (images != null && !images.isEmpty()) {
            return images.get(0).getImageName();
        }
        return null;
    }
    public String getLastImageName() {
        if (images != null && !images.isEmpty()) {
            return images.getLast().getImageName();
        }
        return null;
    }
}