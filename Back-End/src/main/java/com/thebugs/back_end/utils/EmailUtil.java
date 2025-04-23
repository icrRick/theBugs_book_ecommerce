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

    public void sendMailCancelReason(String setTo, String setSubject, String cancelReason) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(setTo);
            helper.setSubject(setSubject);

            String htmlContent = "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "  <meta charset=\"utf-8\">" +
                    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                    "  <title>Thông Báo Hủy Đơn Hàng</title>" +
                    "  <link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">"
                    +
                    "</head>" +
                    "<body style=\"margin: 0; padding: 0; font-family: 'Roboto', Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #333333; -webkit-font-smoothing: antialiased;\">"
                    +
                    "  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">" +
                    "    <tr>" +
                    "      <td align=\"center\" style=\"padding: 30px 0;\">" +
                    "        <table style=\"max-width: 600px; width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);\">"
                    +
                    "          <!-- Header with gradient -->" +
                    "          <tr>" +
                    "            <td style=\"background: linear-gradient(135deg, #ff6b6b, #ff8e8e); padding: 30px 0; text-align: center;\">"
                    +
                    "              <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">" +
                    "                <tr>" +
                    "                  <td align=\"center\">" +
                    "                    <div style=\"background-color: rgba(255,255,255,0.2); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto; display: inline-block; line-height: 70px; margin-bottom: 15px;\">"
                    +
                    "                      <img src=\"https://cdn-icons-png.flaticon.com/512/1828/1828843.png\" alt=\"Hủy\" style=\"width: 35px; height: 35px; vertical-align: middle; filter: invert(1);\">"
                    +
                    "                    </div>" +
                    "                    <h1 style=\"color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);\">Thông Báo Hủy Đơn Hàng</h1>"
                    +
                    "                  </td>" +
                    "                </tr>" +
                    "              </table>" +
                    "            </td>" +
                    "          </tr>" +
                    "          " +
                    "          <!-- Content -->" +
                    "          <tr>" +
                    "            <td style=\"padding: 40px 30px 20px;\">" +
                    "              <p style=\"margin-top: 0; text-align: center; font-size: 16px; line-height: 1.6; color: #555;\">Kính gửi quý khách,</p>"
                    +
                    "              <p style=\"text-align: center; font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;\">Chúng tôi rất tiếc phải thông báo rằng đơn hàng của quý khách đã bị hủy. Dưới đây là chi tiết:</p>"
                    +
                    "              " +
                    "              <!-- Reason Box -->" +
                    "              <div style=\"background-color: #fff8f8; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ff6b6b; box-shadow: 0 2px 8px rgba(255,107,107,0.1);\">"
                    +
                    "                <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">" +
                    "                  <tr>" +
                    "                    <td width=\"24\" valign=\"top\">" +
                    "                      <img src=\"https://cdn-icons-png.flaticon.com/512/1828/1828884.png\" alt=\"Info\" style=\"width: 20px; height: 20px; margin-right: 10px; filter: invert(60%) sepia(75%) saturate(1352%) hue-rotate(314deg) brightness(100%) contrast(97%);\">"
                    +
                    "                    </td>" +
                    "                    <td>" +
                    "                      <p style=\"margin: 0; font-weight: 500; color: #555; font-size: 16px;\">Lý do hủy: "
                    + cancelReason + "</p>" +
                    "                    </td>" +
                    "                  </tr>" +
                    "                </table>" +
                    "              </div>" +
                    "              " +
                    "              <!-- Message -->" +
                    "              <p style=\"text-align: center; margin-bottom: 30px; font-size: 16px; line-height: 1.6; color: #555;\">Nếu quý khách có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>"
                    +
                    "              " +
                    "              <!-- Button -->" +
                    "              <div style=\"text-align: center; margin-bottom: 40px;\">" +
                    "                <a href=\"https://yourwebsite.com/order-details\" style=\"display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 16px; box-shadow: 0 4px 10px rgba(255,107,107,0.3); transition: all 0.3s;\">Xem Chi Tiết</a>"
                    +
                    "              </div>" +
                    "            </td>" +
                    "          </tr>" +
                    "          " +
                    "          <!-- Divider -->" +
                    "          <tr>" +
                    "            <td style=\"padding: 0 30px;\">" +
                    "              <div style=\"height: 1px; background-color: #eeeeee;\"></div>" +
                    "            </td>" +
                    "          </tr>" +
                    "          " +
                    "          <!-- Footer -->" +
                    "          <tr>" +
                    "            <td style=\"padding: 30px; text-align: center; background-color: #fafafa;\">" +
                    "              <p style=\"margin: 0 0 15px; color: #777777; font-size: 15px;\">Trân trọng,</p>" +
                    "              <p style=\"margin: 0 0 20px; color: #555555; font-size: 16px; font-weight: 500;\">Đội ngũ My Company</p>"
                    +
                    "              " +
                    "              <!-- Social Icons -->" +
                    "              <div style=\"margin-bottom: 20px;\">" +
                    "                <a href=\"#\" style=\"display: inline-block; margin: 0 8px; text-decoration: none;\">"
                    +
                    "                  <img src=\"https://cdn-icons-png.flaticon.com/512/733/733547.png\" alt=\"Facebook\" style=\"width: 24px; height: 24px; opacity: 0.7;\">"
                    +
                    "                </a>" +
                    "                <a href=\"#\" style=\"display: inline-block; margin: 0 8px; text-decoration: none;\">"
                    +
                    "                  <img src=\"https://cdn-icons-png.flaticon.com/512/1384/1384063.png\" alt=\"Instagram\" style=\"width: 24px; height: 24px; opacity: 0.7;\">"
                    +
                    "                </a>" +
                    "                <a href=\"#\" style=\"display: inline-block; margin: 0 8px; text-decoration: none;\">"
                    +
                    "                  <img src=\"https://cdn-icons-png.flaticon.com/512/733/733579.png\" alt=\"Twitter\" style=\"width: 24px; height: 24px; opacity: 0.7;\">"
                    +
                    "                </a>" +
                    "              </div>" +
                    "              " +
                    "              <p style=\"margin: 0; color: #999999; font-size: 13px;\">© 2024 My Company. Tất cả các quyền được bảo lưu.</p>"
                    +
                    "            </td>" +
                    "          </tr>" +
                    "        </table>" +
                    "      </td>" +
                    "    </tr>" +
                    "  </table>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true); // Gắn nội dung HTML vào email
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    // return"""
    //             <!DOCTYPE html>
    //             <html>
    //             <head>
    //                 <meta charset='UTF-8'>
    //                 <style>
    //                     body {
    //                         font-family: Arial, sans-serif;
    //                         background-color: #f2f2f2;
    //                         padding: 20px;
    //                     }
    //                     .container {
    //                         background-color: #fff;
    //                         padding: 30px;
    //                         border-radius: 10px;
    //                         max-width: 600px;
    //                         margin: auto;
    //                         box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    //                     }
    //                     .btn {
    //                         display: inline-block;
    //                         padding: 12px 20px;
    //                         background-color: #007BFF;
    //                         color: white;
    //                         text-decoration: none;
    //                         border-radius: 5px;
    //                         margin-top: 20px;
    //                     }
    //                     .btn:hover {
    //                         background-color: #0056b3;
    //                     }
    //                     .footer {
    //                         margin-top: 30px;
    //                         font-size: 14px;
    //                         color: #666;
    //                     }
    //                 </style>
    //             </head>
    //             <body>
    //                 <div class='container'>
    //                     <h2>Yêu cầu đặt lại mật khẩu</h2>
    //                     <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn.</p>
    //                     <p>Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn. Liên kết sẽ hết hạn sau <strong>15 phút</strong>.</p>
    //                     <a class='btn' href='%s'>Đặt lại mật khẩu</a>
    //                     <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
    //                     <div class='footer'>
    //                         <p>Trân trọng,<br><strong>The Bugs Team</strong></p>
    //                     </div>
    //                 </div>
    //             </body>
    //             </html>
    //             """.formatted(resetLink);

    // }

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