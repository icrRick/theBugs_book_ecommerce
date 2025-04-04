package com.thebugs.back_end.utils;

import java.text.Normalizer;
import java.util.Random;
import java.util.regex.Pattern;

public class ReplaceName {
        public static String generateRandomColor() {
                Random rand = new Random();
                int r = rand.nextInt(256);
                int g = rand.nextInt(256);
                int b = rand.nextInt(256);

                return String.format("#%02X%02X%02X", r, g, b);
        }

        public static String getInitials(String fullName) {
                String[] nameParts = fullName.trim().split("\\s+");
                StringBuilder initials = new StringBuilder();
                for (String part : nameParts) {
                        if (!part.isEmpty()) {
                                String normalizedPart = removeAccents(part);

                                char firstChar = normalizedPart.charAt(0);
                                initials.append(Character.toUpperCase(firstChar)); // Đảm bảo chữ cái là chữ hoa
                        }
                }

                return initials.toString();
        }

        private static String removeAccents(String input) {
                String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
                Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
                return pattern.matcher(normalized).replaceAll("");
        }

        public static String generatePlaceholderUrl(String fullName) {
                String randomColor = generateRandomColor();
                return "https://placehold.co/60x60/" + randomColor.substring(1) + "/ffffff?text="
                                + getInitials(fullName);
        }
}
