package com.thebugs.back_end.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thebugs.back_end.entities.Publisher;

public interface PublisherJPA extends JpaRepository<Publisher, Integer> {
  
        @Query("SELECT g FROM Publisher g WHERE ?1 IS NULL OR g.name LIKE %?1%")
        Page<Publisher> findByName(String keyword, Pageable pageable);

        @Query("SELECT COUNT(g) FROM Publisher g WHERE ?1 IS NULL OR ?1 = '' OR g.name LIKE %?1%")
        int countfindByName(String keyword);

        @Query("SELECT g FROM Publisher g WHERE g.name = ?2 AND (g.id <> ?1 OR ?1 IS NULL)")
        Optional<Publisher> findByNameExist(Integer id, String name);

        @Query("SELECT COUNT(g) FROM Publisher g ")
        int countfindAll();


}

