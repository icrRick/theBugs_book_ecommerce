package com.thebugs.back_end.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailUtil {

    @Autowired
    private JavaMailSender mailSender;

   public boolean sendEmailForgotpassword(String toEmail, String token ,int userId) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(toEmail);
        helper.setSubject("Khôi phục mật khẩu");
        helper.setText(forgotContent(token,userId), true);
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

    public String forgotContent(String token,int userId) {
        String resetLink = "http://localhost:3000/reset-password?token=" + token+"&userId="+userId;
    
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
            """.formatted(resetLink);
    }
    
    
    

}
