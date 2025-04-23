package com.thebugs.back_end.utils;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import com.thebugs.back_end.services.user.EmailVerifierService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailUtil {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailVerifierService emailVerifierService;

    public boolean sendEmailForgotpassword(String toEmail, String token, int userId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Khôi phục mật khẩu");
            helper.setText(forgotContent(token, userId), true);
            helper.setFrom("lehqpc07896@fpt.edu.vn");
            mailSender.send(message);
            System.out.println("✅ HTML email sent to " + toEmail);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String orderContent(String email, String noted) {
        return "";
    }

    public String forgotContent(String token, int userId) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token + "&userId=" + userId;

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f2f2f2;
                            padding: 20px;
                        }
                        .container {
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 10px;
                            max-width: 600px;
                            margin: auto;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        }
                        .btn {
                            display: inline-block;
                            padding: 12px 20px;
                            background-color: #007BFF;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                        }
                        .btn:hover {
                            background-color: #0056b3;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 14px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>Yêu cầu đặt lại mật khẩu</h2>
                        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn.</p>
                        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn. Liên kết sẽ hết hạn sau <strong>15 phút</strong>.</p>
                        <a class='btn' href='%s'>Đặt lại mật khẩu</a>
                        <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
                        <div class='footer'>
                            <p>Trân trọng,<br><strong>The Bugs Team</strong></p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(resetLink);
    }

    public boolean sendEmailApprove(String toEmail, String title, String ma) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Thông báo");
            helper.setText(approveContent(title, ma), true);
            helper.setFrom("lehqpc07896@fpt.edu.vn");
            mailSender.send(message);
            System.out.println("✅ HTML email sent to " + toEmail);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendEmailReject(String toEmail, String title, String ma, List<String> reasons) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Thông báo");
            helper.setText(rejectContent(title, ma, reasons), true);
            helper.setFrom("lehqpc07896@fpt.edu.vn");
            mailSender.send(message);
            System.out.println("✅ HTML email sent to " + toEmail);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean sendEmailShopReject(String toEmail, String title, String ma, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Thông báo");
            helper.setText(rejectProductShop(title, ma, reason), true);
            helper.setFrom("lehqpc07896@fpt.edu.vn");
            mailSender.send(message);
            System.out.println("✅ HTML email sent to " + toEmail);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String approveContent(String title, String ma) {
        return """
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 30px;
                            }
                            .container {
                                max-width: 600px;
                                margin: auto;
                                background-color: #ffffff;
                                padding: 25px;
                                border-radius: 10px;
                                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                font-size: 22px;
                                font-weight: bold;
                                color: #2d8f2d;
                                margin-bottom: 15px;
                            }
                            .content {
                                font-size: 16px;
                                color: #333333;
                                line-height: 1.6;
                                margin-bottom: 25px;
                            }
                            .footer {
                                font-size: 14px;
                                color: #888888;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">Xác nhận duyệt %s</div>
                            <div class="content">
                                Kính chào Quý khách,<br><br>
                                Chúng tôi xin thông báo rằng <strong>%s</strong> mang mã <strong>%s</strong> của Quý khách đã được
                                <span style="color: green;"><strong>duyệt thành công</strong></span> và sẽ sớm được hiển thị trên hệ thống.<br><br>
                                Cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi.
                            </div>
                            <div class="footer">
                                Trân trọng,<br>
                                Đội ngũ hỗ trợ khách hàng
                            </div>
                        </div>
                    </body>
                </html>
                """
                .formatted(title, title, ma);
    }

    public String rejectContent(String title, String productCode, List<String> reasons) {
        // Chuyển List<String> thành một chuỗi HTML liệt kê các lý do
        StringBuilder reasonsHtml = new StringBuilder();
        for (String r : reasons) {
            reasonsHtml.append("<li>").append(r).append("</li>");
        }

        return """
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                            }
                            .container {
                                background-color: #ffffff;
                                padding: 25px;
                                border-radius: 8px;
                                max-width: 600px;
                                margin: auto;
                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                font-size: 22px;
                                font-weight: bold;
                                color: #e74c3c;
                                margin-bottom: 15px;
                            }
                            .content {
                                font-size: 16px;
                                color: #333333;
                                line-height: 1.6;
                            }
                            .product-name {
                                font-weight: bold;
                                color: #2c3e50;
                            }
                            .reason-box {
                                background-color: #fff3f3;
                                padding: 15px;
                                border-left: 4px solid #e74c3c;
                                margin: 15px 0;
                                font-style: italic;
                            }
                            .footer {
                                margin-top: 30px;
                                font-size: 14px;
                                color: #888888;
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">%s chưa được duyệt</div>
                            <div class="content">
                                Chào bạn,<br><br>
                                %s <span class="product-name">%s</span> của bạn hiện chưa được duyệt bởi Super Admin do những lý do sau:<br>
                                <div class="reason-box">
                                    <ul>%s</ul>
                                </div>
                                Vui lòng cập nhật lại nội dung và gửi lại để được xem xét duyệt lại nhé! 😊<br><br>
                                Nếu cần hỗ trợ thêm, bạn có thể liên hệ với đội ngũ kiểm duyệt bất cứ lúc nào.
                            </div>
                            <div class="footer">
                                Cảm ơn bạn đã đồng hành cùng chúng tôi!<br>
                                — Đội ngũ kiểm duyệt
                            </div>
                        </div>
                    </body>
                </html>
                """
                .formatted(title, title, productCode, reasonsHtml.toString());
    }

    public String rejectProductShop(String title, String ma, String reason) {
        return """
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 30px;
                            }
                            .container {
                                max-width: 600px;
                                margin: auto;
                                background-color: #ffffff;
                                padding: 25px;
                                border-radius: 10px;
                                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                font-size: 22px;
                                font-weight: bold;
                                color: #d9534f;
                                margin-bottom: 15px;
                            }
                            .content {
                                font-size: 16px;
                                color: #333333;
                                line-height: 1.6;
                                margin-bottom: 25px;
                            }
                            .footer {
                                font-size: 14px;
                                color: #888888;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">Thông báo cấm sản phẩm %s</div>
                            <div class="content">
                                Kính chào cửa hàng,<br><br>
                                Chúng tôi xin thông báo rằng sản phẩm <strong>%s</strong> mang mã <strong>%s</strong> của bạn đã bị
                                <span style="color: red;"><strong>cấm hiển thị</strong></span> do vi phạm chính sách của hệ thống.<br><br>
                                Lý do: <em>%s</em><br><br>
                                Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ.
                            </div>
                            <div class="footer">
                                Trân trọng,<br>
                                Đội ngũ quản lý sản phẩm
                            </div>
                        </div>
                    </body>
                </html>
                """
                .formatted(title, title, ma, reason);
    }

    public boolean checkEmail(String email) {

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        if (!Pattern.matches(emailRegex, email)) {
            throw new IllegalArgumentException("Email không đúng định dạng");
        }

        if (!emailVerifierService.isEmailValid(email)) {
            throw new IllegalArgumentException("Email không tồn tại");
        }

        return true;
    }

}