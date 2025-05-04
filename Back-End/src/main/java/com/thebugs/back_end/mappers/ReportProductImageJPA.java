package com.thebugs.back_end.mappers;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thebugs.back_end.entities.ReportProductImage;

public interface ReportProductImageJPA  extends JpaRepository<ReportProductImage, Long> {


    
}