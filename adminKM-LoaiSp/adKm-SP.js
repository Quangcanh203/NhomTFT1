
function showLoaiSanPham(data) {
  var s = "";
  for (var i = 0; i < data.length; i++) {
    var p = data[i];
    s += `<option value="` + p.MaLSP + `">` + p.TenLSP + `</option>`;
  }
  document.getElementsByName("chonCompany")[0].innerHTML = s;
}

function ajaxKhuyenMai() {
  $.ajax({
    type: "POST",
    url: "php/xulykhuyenmai.php",
    dataType: "json",
    // timeout: 1500, // sau 1.5 giây mà không phản hồi thì dừng => hiện lỗi
    data: {
      request: "getall",
    },
    success: function (data, status, xhr) {
      showKhuyenMai(data);
      showGTKM(data);
    },
    error: function (e) {},
  });
}

function showKhuyenMai(data) {
  var s =
    `
        <option selected="selected" value="` +
    data[0].MaKM +
    `">Không</option>
        <option value="` +
    data[1].MaKM +
    `">Trả góp</option>
        <option value="` +
    data[2].MaKM +
    `">Giảm giá</option>
        <option value="` +
    data[3].MaKM +
    `">Giá rẻ online</option>
        <option value="` +
    data[4].MaKM +
    `">Mởi ra mắt</option>`;
  document.getElementsByName("chonKhuyenMai")[0].innerHTML = s;
}

function showGTKM() {
  var giaTri = document.getElementsByName("chonKhuyenMai")[0].value;
  switch (giaTri) {
    // lấy tất cả khuyến mãi
    case "1":
      document.getElementById("giatrikm").value = 0;
      break;

    case "2":
      document.getElementById("giatrikm").value = 500000;
      break;

    case "3":
      document.getElementById("giatrikm").value = 650000;
      break;

    case "4":
      document.getElementById("giatrikm").value = 0;
      break;

    case "5":
      document.getElementById("giatrikm").value = 0;
      break;

    default:
      break;
  }
}

// ======================= Các Tab =========================
function addEventChangeTab() {
  var sidebar = document.getElementsByClassName("sidebar")[0];
  var list_a = sidebar.getElementsByTagName("a");
  for (var a of list_a) {
    if (!a.onclick) {
      a.addEventListener("click", function () {
        turnOff_Active();
        this.classList.add("active");
        var tab = this.childNodes[1].data.trim();
        openTab(tab);
      });
    }
  }
}

function turnOff_Active() {
  var sidebar = document.getElementsByClassName("sidebar")[0];
  var list_a = sidebar.getElementsByTagName("a");
  for (var a of list_a) {
    a.classList.remove("active");
  }
}

function openTab(nameTab) {
  // ẩn hết
  var main = document.getElementsByClassName("main")[0].children;
  for (var e of main) {
    e.style.display = "none";
  }

  // mở tab
  switch (nameTab) {
    case "Home":
      document.getElementsByClassName("home")[0].style.display = "block";
      break;
    case "Sản Phẩm":
      document.getElementsByClassName("sanpham")[0].style.display = "block";
      break;
    case "Đơn Hàng":
      document.getElementsByClassName("donhang")[0].style.display = "block";
      break;
    case "Khách Hàng":
      document.getElementsByClassName("khachhang")[0].style.display = "block";
      break;
    case "Thống Kê":
      document.getElementsByClassName("thongke")[0].style.display = "block";
      break;
  }
}

// ========================== Sản Phẩm ========================
// Vẽ bảng danh sách sản phẩm
function addTableProducts(list_products) {
  var tc = document
    .getElementsByClassName("sanpham")[0]
    .getElementsByClassName("table-content")[0];
  var s = `<table class="table-outline hideImg">`;

  for (var i = 0; i < list_products.length; i++) {
    var p = list_products[i];
    s +=
      `<tr>
            <td style="width: 5%">` +
      (i + 1) +
      `</td>
            <td style="width: 10%">` +
      p.MaSP +
      `</td>
            <td style="width: 40%">
                <a title="Xem chi tiết" target="_blank" href="chitietsanpham.php?` +
      p.TenSP.split(" ").join("-") +
      `">` +
      p.TenSP +
      `</a>
                <img src="` +
      p.HinhAnh +
      `"></img>
            </td>
            <td style="width: 15%">` +
      parseInt(p.DonGia).toLocaleString() +
      `</td>
            <td style="width: 10%">` +
      /*promoToStringValue(*/ p.KM.TenKM /*)*/ +
      `</td>
            <td style="width: 10%">` +
      (p.TrangThai == 1 ? "Hiện" : "Ẩn") +
      `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <i class="fa fa-wrench" onclick="addKhungSuaSanPham('` +
      p.MaSP +
      `')"></i>
                    <span class="tooltiptext">Sửa</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-trash" onclick="xoaSanPham('` +
      p.TrangThai +
      `', '` +
      p.MaSP +
      `', '` +
      p.TenSP +
      `')"></i>
                    <span class="tooltiptext">Xóa</span>
                </div>
            </td>
        </tr>`;
  }

  s += `</table>`;

  tc.innerHTML = s;
}
