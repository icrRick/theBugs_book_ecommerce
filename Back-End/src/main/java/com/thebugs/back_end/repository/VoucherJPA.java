package com.thebugs.back_end.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.Voucher;

public interface VoucherJPA extends JpaRepository<Voucher, Integer> {

        @Query("SELECT v FROM Voucher v WHERE v.id=?1 AND v.shop.id=?2")
        Optional<Voucher> getVoucherIdByShopId(Integer Id, Integer shopId);

        @Query("SELECT p FROM Voucher p WHERE " +
                        "p.shop.id = ?1 AND " +
                        "(?2 IS NULL OR p.startDate >= ?2) AND " +
                        "(?3 IS NULL OR p.expireDate <= ?3)")
        Page<Voucher> findByShopAndDateRange(Integer shopId, Date startDate, Date expireDate, Pageable pageable);

        @Query("SELECT COUNT(p) FROM Voucher p WHERE " +
                        "p.shop.id = ?1 AND " +
                        "(?2 IS NULL OR p.startDate >= ?2) AND " +
                        "(?3 IS NULL OR p.expireDate <= ?3)")
        int countByShopAndDateRange(Integer shopId, Date startDate, Date expireDate);

        @Query("SELECT v FROM Voucher v WHERE v.shop.id = ?1 AND v.active = true AND v.quantity > 0 AND v.startDate <= CURRENT_DATE AND v.expireDate >= CURRENT_DATE")
        List<Voucher> findByShopId(Integer shopId);

}
