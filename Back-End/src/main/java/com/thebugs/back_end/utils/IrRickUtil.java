package com.thebugs.back_end.utils;

public class IrRickUtil {
    public static void addBreakLineForMessage(StringBuffer messageO, String messageAdd) {
        if (!messageO.isEmpty()) {
            messageO.append("\n");
        }
        messageO.append(messageAdd);
    }
}
