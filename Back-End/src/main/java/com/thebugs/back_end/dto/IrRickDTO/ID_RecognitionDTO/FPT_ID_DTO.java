package com.thebugs.back_end.dto.IrRickDTO.ID_RecognitionDTO;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

// @JsonIgnoreProperties({ "errorMessage", "id_prob", "name_prob", "dob_prob", "sex_prob", "nationality_prob", "home_prob",
//         "address_prob", "doe_prob", "overall_score", "number_of_name_lines", "address_entities", "type", "features",
//         "features_prob", "mrz_prob", "issue_loc_prob", "mrz_details" })
@JsonIgnoreProperties({
        "errorMessage", "id_prob", "name_prob", "dob_prob", "sex_prob", "nationality_prob",
        "home_prob", "address_prob", "doe_prob", "overall_score", "number_of_name_lines",
        "address_entities", "type", "features", "features_prob", "mrz_prob", "issue_loc_prob",
        "mrz_details", "pob", "pob_prob", "address_prob", "doe", "doe_prob", "issue_date_prob", "mrz"
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FPT_ID_DTO {
    private String id;
    private String name;
    private LocalDate dob;
    private LocalDate doe;
    private boolean sex;
    private String nationality;
    private String home;
    private String address;
    private String type_new;
    private LocalDate issue_date;
    private String issue_loc;

    public FPT_ID_DTO(String id, String name, String dob, String doe, String sex, String nationality, String home,
            String address, String type_new, String issue_date, String issue_loc) {
        this.id = id;
        this.name = name;
        this.dob = parseToDate(dob);
        this.doe = parseToDate(doe);
        this.sex = Boolean.parseBoolean(sex);
        this.nationality = nationality;
        this.home = home;
        this.address = address;
        this.type_new = type_new;
        this.issue_date = parseToDate(issue_date);
        this.issue_loc = issue_loc;
    }

    // Setter ép kiểu cho String -> kiểu thực tế
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDob(String dob) {
        this.dob = parseToDate(dob);
    }

    public void setDoe(String doe) {
        this.doe = parseToDate(doe);
    }

    public void setSex(String sex) {
        this.sex = Boolean.parseBoolean(sex); // Ép String "true"/"false" thành boolean
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public void setHome(String home) {
        this.home = home;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setType_new(String type_new) {
        this.type_new = type_new;
    }

    public void setIssue_date(String issue_date) {
        this.issue_date = parseToDate(issue_date);
    }

    public void setIssue_loc(String issue_loc) {
        this.issue_loc = issue_loc;
    }

    // Helper method: String -> LocalDate
    private LocalDate parseToDate(String dateString) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); // Định dạng chuẩn
            return LocalDate.parse(dateString, formatter);
        } catch (Exception e) {
            return null; // Hoặc throw exception nếu cần xử lý lỗi
        }
    }

    // Các setter thông thường: Truyền kiểu đúng
    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public void setDoe(LocalDate doe) {
        this.doe = doe;
    }

    public void setSex(boolean sex) {
        this.sex = sex;
    }

    public void setIssue_date(LocalDate issue_date) {
        this.issue_date = issue_date;
    }

}
