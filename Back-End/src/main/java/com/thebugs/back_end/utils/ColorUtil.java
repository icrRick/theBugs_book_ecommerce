package com.thebugs.back_end.utils;

public class ColorUtil
{
    public static final String RESET = "\u001B[0m";
    public static final String RED = "\u001B[31m";
    public static final String GREEN = "\u001B[32m";
    public static final String YELLOW = "\u001B[33m";
    public static final String BLUE = "\u001B[34m";

    public static void print(String color, String message)
    {
        System.out.println(color + message + RESET);
    }
}