package com.thebugs.back_end.resp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseData {
        private boolean status;
        private String message;
        private Object data;

        @JsonIgnore
        private int statusCode;

        public ResponseData(boolean status, String message, Object data) {
                this.status = status;
                this.message = message;
                this.data = data;
        }

}