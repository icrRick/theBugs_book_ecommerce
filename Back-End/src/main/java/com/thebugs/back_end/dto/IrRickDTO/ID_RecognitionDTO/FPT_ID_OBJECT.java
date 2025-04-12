package com.thebugs.back_end.dto.IrRickDTO.ID_RecognitionDTO;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties({
                "errorMessage", "id_prob", "name_prob", "dob_prob", "sex_prob", "nationality_prob",
                "home_prob", "address_prob", "doe_prob", "overall_score", "number_of_name_lines",
                "address_entities", "type", "features", "features_prob", "mrz_prob", "issue_loc_prob",
                "mrz_details", "pob", "pob_prob", "address_prob", "doe", "doe_prob"
})
@AllArgsConstructor
@NoArgsConstructor
public class FPT_ID_OBJECT {
        private int errorCode;
        private String message;
        private List<FPT_ID_DTO> data;

        public FPT_ID_OBJECT(String errorCode, String message, List<FPT_ID_DTO> data) {
                this.errorCode = Integer.parseInt(errorCode);
                this.message = message;
                this.data = data;
        }

        public int getErrorCode() {
                return this.errorCode;
        }

        public void setErrorCode(String errorCode) {
                this.errorCode = Integer.parseInt(errorCode);
        }
        
        public void setErrorCode(int errorCode) {
                this.errorCode = errorCode;
        }

        public String getMessage() {
                return this.message;
        }

        public void setMessage(String message) {
                this.message = message;
        }

        public List<FPT_ID_DTO> getData() {
                return this.data;
        }

        public void setData(List<FPT_ID_DTO> data) {
                this.data = data;
        }

}
