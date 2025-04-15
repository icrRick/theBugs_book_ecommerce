package com.thebugs.back_end.dto.FPT_API_DTO.ID_RecognitionDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@JsonIgnoreProperties({
        "errorMessage", "id_prob", "name_prob", "dob_prob", "sex_prob", "nationality_prob",
        "home_prob", "address_prob", "doe_prob", "overall_score", "number_of_name_lines",
        "address_entities", "type", "features", "features_prob", "mrz_prob", "issue_loc_prob",
        "mrz_details", "pob", "pob_prob", "address_prob", "doe_prob", "issue_date_prob", "mrz"
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FPT_ID_DTO {
    private String id;
    private String name;
    private String dob;
    private String doe;
    @JsonProperty("sex")
    private boolean sex;
    private String nationality;
    private String home;
    private String address;
    private String type_new;
    private String issue_date;
    private String issue_loc;

    public void setSex(String sex) {
        this.sex = parseGenderToBoolean(sex); // Ép String "true"/"false" thành boolean
    }

    private boolean parseGenderToBoolean(String sex) {
        return sex.equalsIgnoreCase("NAM");
    }

}
