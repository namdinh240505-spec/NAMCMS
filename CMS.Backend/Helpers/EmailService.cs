using System.Net;
using System.Net.Mail;

namespace CMS.Backend.Helpers
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SmtpClient CreateSmtpClient()
        {
            var smtpHost = _configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            var senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "";
            var senderPassword = _configuration["EmailSettings:SenderPassword"] ?? "";

            var client = new SmtpClient(smtpHost)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = true
            };

            return client;
        }

        private MailMessage CreateMailMessage(string toEmail, string subject, string htmlBody)
        {
            var senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "";
            var senderName = _configuration["EmailSettings:SenderName"] ?? "NamTech Shop";

            var message = new MailMessage
            {
                From = new MailAddress(senderEmail, senderName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);
            return message;
        }

        // ==========================================
        // GỬI MÃ OTP QUÊN MẬT KHẨU
        // ==========================================
        public async Task SendPasswordResetEmailAsync(string toEmail, string code)
        {
            var subject = "🔐 Mã xác thực đặt lại mật khẩu - NamTech";
            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f4f5f7; }}
    .container {{ max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #F97316, #EA580C); padding: 32px; text-align: center; }}
    .header h1 {{ color: #fff; margin: 0; font-size: 24px; font-weight: 700; }}
    .header p {{ color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }}
    .body {{ padding: 32px; }}
    .body p {{ color: #374151; line-height: 1.6; margin: 0 0 16px; }}
    .code-box {{ background: #FFF7ED; border: 2px dashed #F97316; border-radius: 12px; text-align: center; padding: 24px; margin: 24px 0; }}
    .code {{ font-size: 36px; font-weight: 800; color: #EA580C; letter-spacing: 8px; font-family: 'Courier New', monospace; }}
    .note {{ font-size: 13px; color: #6B7280; background: #F9FAFB; padding: 12px 16px; border-radius: 8px; margin-top: 20px; }}
    .footer {{ text-align: center; padding: 20px 32px; background: #F9FAFB; color: #9CA3AF; font-size: 12px; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>NamTech</h1>
      <p>Đặt lại mật khẩu của bạn</p>
    </div>
    <div class='body'>
      <p>Xin chào,</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản NamTech. Vui lòng sử dụng mã xác thực bên dưới:</p>
      <div class='code-box'>
        <div class='code'>{code}</div>
      </div>
      <p>Mã này có hiệu lực trong <strong>15 phút</strong>.</p>
      <div class='note'>
        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
      </div>
    </div>
    <div class='footer'>
      &copy; 2026 NamTech Shop. All rights reserved.
    </div>
  </div>
</body>
</html>";

            using var client = CreateSmtpClient();
            using var message = CreateMailMessage(toEmail, subject, htmlBody);
            await client.SendMailAsync(message);
        }

        // ==========================================
        // GỬI EMAIL XÁC NHẬN ĐẶT HÀNG
        // ==========================================
        public async Task SendOrderConfirmationEmailAsync(
            string toEmail,
            string customerName,
            int orderId,
            DateTime orderDate,
            string shippingName,
            string shippingPhone,
            string shippingAddress,
            string paymentMethod,
            List<OrderItemInfo> items,
            decimal totalAmount)
        {
            var subject = $"✅ Xác nhận đơn hàng #{orderId} - NamTech";

            var itemRows = string.Join("", items.Select(item =>
                $@"<tr>
                    <td style='padding: 12px 16px; border-bottom: 1px solid #F3F4F6;'>{item.ProductName}</td>
                    <td style='padding: 12px 16px; border-bottom: 1px solid #F3F4F6; text-align: center;'>{item.Quantity}</td>
                    <td style='padding: 12px 16px; border-bottom: 1px solid #F3F4F6; text-align: right;'>{item.UnitPrice:N0}₫</td>
                    <td style='padding: 12px 16px; border-bottom: 1px solid #F3F4F6; text-align: right; font-weight: 600;'>{(item.Quantity * item.UnitPrice):N0}₫</td>
                  </tr>"
            ));

            var paymentText = paymentMethod == "VNPay" ? "Thanh toán trực tuyến (VNPay)" : "Thanh toán khi nhận hàng (COD)";

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f4f5f7; }}
    .container {{ max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #10B981, #059669); padding: 32px; text-align: center; }}
    .header h1 {{ color: #fff; margin: 0; font-size: 24px; font-weight: 700; }}
    .header p {{ color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }}
    .body {{ padding: 32px; }}
    .body p {{ color: #374151; line-height: 1.6; margin: 0 0 16px; }}
    .order-id {{ background: #ECFDF5; color: #065F46; font-weight: 700; padding: 16px; border-radius: 12px; text-align: center; font-size: 18px; margin: 20px 0; }}
    .info-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }}
    .info-box {{ background: #F9FAFB; padding: 14px 16px; border-radius: 10px; }}
    .info-label {{ font-size: 11px; text-transform: uppercase; color: #9CA3AF; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 4px; }}
    .info-value {{ font-size: 14px; color: #1F2937; font-weight: 600; }}
    table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
    thead th {{ background: #F9FAFB; padding: 10px 16px; font-size: 12px; text-transform: uppercase; color: #6B7280; font-weight: 600; text-align: left; }}
    .total-row {{ background: #FFF7ED; }}
    .total-row td {{ padding: 16px; font-weight: 700; font-size: 16px; color: #EA580C; }}
    .footer {{ text-align: center; padding: 20px 32px; background: #F9FAFB; color: #9CA3AF; font-size: 12px; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>⚡ NamTech</h1>
      <p>Đặt hàng thành công!</p>
    </div>
    <div class='body'>
      <p>Xin chào <strong>{customerName}</strong>,</p>
      <p>Cảm ơn bạn đã đặt hàng tại NamTech! Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
      
      <div class='order-id'>🛒 Mã đơn hàng: #{orderId}</div>

      <table cellpadding='0' cellspacing='0'>
        <tr>
          <td style='padding: 0 4px 0 0; vertical-align: top; width: 50%;'>
            <div class='info-box'>
              <div class='info-label'>Người nhận</div>
              <div class='info-value'>{shippingName}</div>
            </div>
          </td>
          <td style='padding: 0 0 0 4px; vertical-align: top; width: 50%;'>
            <div class='info-box'>
              <div class='info-label'>Số điện thoại</div>
              <div class='info-value'>{shippingPhone}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan='2' style='padding: 8px 0 0 0;'>
            <div class='info-box'>
              <div class='info-label'>Địa chỉ giao hàng</div>
              <div class='info-value'>{shippingAddress}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan='2' style='padding: 8px 0 0 0;'>
            <div class='info-box'>
              <div class='info-label'>Phương thức thanh toán</div>
              <div class='info-value'>{paymentText}</div>
            </div>
          </td>
        </tr>
      </table>

      <table cellpadding='0' cellspacing='0'>
        <thead>
          <tr>
            <th style='text-align: left;'>Sản phẩm</th>
            <th style='text-align: center;'>SL</th>
            <th style='text-align: right;'>Đơn giá</th>
            <th style='text-align: right;'>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {itemRows}
        </tbody>
        <tfoot>
          <tr class='total-row'>
            <td colspan='3' style='text-align: right;'>Tổng cộng:</td>
            <td style='text-align: right;'>{totalAmount:N0}₫</td>
          </tr>
        </tfoot>
      </table>

      <p style='font-size: 13px; color: #6B7280;'>Ngày đặt hàng: {orderDate:dd/MM/yyyy HH:mm}</p>
    </div>
    <div class='footer'>
      &copy; 2026 NamTech Shop. All rights reserved.<br/>
      Cảm ơn bạn đã tin tưởng và mua sắm tại NamTech!
    </div>
  </div>
</body>
</html>";

            using var client = CreateSmtpClient();
            using var message = CreateMailMessage(toEmail, subject, htmlBody);
            await client.SendMailAsync(message);
        }
    }

    // DTO cho thông tin sản phẩm trong email
    public class OrderItemInfo
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
