package com.thebugs.back_end.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.User;

public interface UserJPA extends JpaRepository<User, Integer> {
        @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.active = true")
        Optional<User> findByEmail(String email);

        @Query("SELECT u FROM User u  WHERE u.email = ?2 AND (u.id <> ?1 OR ?1 IS NULL)")
        Optional<User> findByEmailExist(Integer id, String email);

        @Query("SELECT u FROM User u  WHERE u.email = ?2 AND (u.id <> ?1 OR ?1 IS NULL)")
        Optional<User> findByPhoneExist(Integer id, String phone);

        @Query("SELECT u FROM User u WHERE u.role.id = 3 AND u.active = true")
        List<User> findEmailAdmin();

        @Query("SELECT u FROM User u  WHERE u.cccd = ?1")
        Optional<User> findByIdCCCDExist(String cccd);
}
