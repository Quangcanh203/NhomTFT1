using DoAn.Areas.Admin.Repository;
using DoAn.Models;
using DoAn.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DoAn.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly DataContext _dataContext;
        private readonly IEmailSender _emailSender;

        public CheckoutController(IEmailSender emailSender, DataContext context)
        {
            _emailSender = emailSender;
            _dataContext = context;
        }

        public async Task<IActionResult> Checkout()
        {
            // Kiểm tra xem người dùng đã đăng nhập chưa
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(userEmail))
            {
                return RedirectToAction("Login", "Account");
            }

            // Lấy giỏ hàng từ session
            var cartItems = HttpContext.Session.GetJson<List<CartItemModel>>("Cart") ?? new List<CartItemModel>();

            // Kiểm tra nếu giỏ hàng trống
            if (!cartItems.Any())
            {
                TempData["error"] = "Giỏ hàng của bạn đang trống!";
                return RedirectToAction("Index", "Cart");
            }

            // Tính tổng số tiền của đơn hàng
            decimal totalAmount = cartItems.Sum(item => item.Price * item.Quantily);

            // Kiểm tra lại giá trị từng sản phẩm trong giỏ hàng
            foreach (var cartItem in cartItems)
            {
                Console.WriteLine($"Product ID: {cartItem.ProductId}, Price: {cartItem.Price}, Quantity: {cartItem.Quantily}");
            }
            Console.WriteLine($"Total Amount Calculated: {totalAmount}");

            // Tạo mã đơn hàng
            var orderCode = Guid.NewGuid().ToString();

            // Tạo đối tượng đơn hàng mới với tổng tiền
            var order = new OrderModel
            {
                OrderCode = orderCode,
                UserName = userEmail,
                Status = 1, // Đơn hàng mới
                CreateDate = DateTime.Now,
                TotalAmount = totalAmount // Lưu tổng số tiền vào cột TotalAmount
            };

            // Thêm đơn hàng vào cơ sở dữ liệu
            _dataContext.Add(order);
            _dataContext.SaveChanges();

            // Tạo chi tiết đơn hàng cho mỗi sản phẩm trong giỏ
            foreach (var cartItem in cartItems)
            {
                var orderDetail = new OtherDetail
                {
                    UserName = userEmail,
                    OrderCode = orderCode,
                    ProductId = cartItem.ProductId,
                    Price = cartItem.Price,
                    Quantity = cartItem.Quantily
                };

                _dataContext.Add(orderDetail);
            }

            // Lưu tất cả chi tiết đơn hàng vào cơ sở dữ liệu
            _dataContext.SaveChanges();

            // Xóa giỏ hàng khỏi session
            HttpContext.Session.Remove("Cart");

            TempData["success"] = "Check out thành công, vui lòng chờ duyệt đơn hàng.";

            // Gửi email xác nhận
            var receiver = userEmail;
            var subject = "Đặt hàng thành công";
            var message = "Đặt hàng thành công, cảm ơn bạn đã mua sắm với chúng tôi!";

            await _emailSender.SendEmailAsync(receiver, subject, message);

            return RedirectToAction("Index", "Cart");
        }
    }
}
