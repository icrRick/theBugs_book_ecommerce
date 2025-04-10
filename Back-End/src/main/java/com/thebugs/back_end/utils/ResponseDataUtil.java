package com.thebugs.back_end.utils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.thebugs.back_end.resp.ResponseData;

public class ResponseDataUtil {
    public static ResponseEntity<ResponseData> OK(String message,Object data){
        return ResponseEntity.ok(new ResponseData(true, message,data));
    } 
    public static ResponseEntity<ResponseData> badRequest(String message){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseData(false, message,null));
    }



}
