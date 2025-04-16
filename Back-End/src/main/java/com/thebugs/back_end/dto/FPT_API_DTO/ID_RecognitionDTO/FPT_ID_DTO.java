package com.thebugs.back_end.dto.FPT_API_DTO.ID_RecognitionDTO;

import java.util.List;

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
                "mrz_details", "pob", "pob_prob", "address_prob", "doe_prob"
})
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class FPT_Id_DTO {
        @JsonProperty("errorCode")
        private int errorCode;
        private List<FPT_Id_Data> data;
}
