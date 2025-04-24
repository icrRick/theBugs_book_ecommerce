package com.thebugs.back_end.beans;

import java.util.List;
import lombok.Data;

@Data
public class ReportRejectBean {
    private Integer id;
    private List<String> reasons;
}
