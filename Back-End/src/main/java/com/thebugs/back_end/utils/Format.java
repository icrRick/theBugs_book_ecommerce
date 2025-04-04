package com.thebugs.back_end.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Format {
        public static Date formatDate(Date dob) throws ParseException {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(dob);
                return sdf.parse(formattedDate);
        }
}
