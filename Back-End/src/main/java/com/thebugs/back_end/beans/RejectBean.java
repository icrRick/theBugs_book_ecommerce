package com.thebugs.back_end.beans;

import java.util.List;

import lombok.Data;

@Data
public class RejectBean {
    private String rejectCode;
    private List<String> reasons;
}
