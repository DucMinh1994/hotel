/**
 * room-502.js - Cấu hình chuyên biệt cho Phòng 502: Royal Presidential Sky Suite
 * Bao gồm:
 * 1. Không gian phòng khách Lounge phong cách hoàng gia cổ điển tại tầng 50
 * 2. Đèn chùm pha lê vintage, sofa nhung Dedar Milano, tủ gỗ gụ credenza
 * 3. Tầm nhìn Skyline thành phố đêm & vòm cửa dẫn vào phòng ngủ Master
 */

const ROOM_502 = {
  id: "502",
  name: "Phòng 502 - Royal Presidential Sky Suite",
  shortName: "Presidential Sky Suite",
  roomNumber: "502",
  tagline: "Đỉnh cao xa hoa tầng 50 với phòng khách Lounge phong cách Hoàng Gia cổ điển",
  price: 5900000,
  priceFormatted: "5.900.000₫",
  area: "92 m²",
  capacity: "3 Người lớn hoặc 2 Người lớn + 2 Trẻ em",
  bedType: "Phòng khách Suite hoàng gia + Phòng ngủ Master Super King",
  viewType: "Skyline Thành Phố Đêm Tầng 50",
  badge: "Hạng Phòng Tổng Thống Đẳng Cấp",
  roomImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
  panorama360Url: "anniversary_lounge_preview.jpg",
  panorama360FallbackUrl: "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/anniversary_lounge.jpg",
  theme: {
    wallColor: "#121721",
    woodTone: "ebony",
    accentColor: "#38bdf8",
    rugPattern: "presidential",
    isNightDefault: true
  },
  amenities: [
    {
      icon: "🏙️",
      label: "Tầng 50 view Skyline lộng lẫy"
    },
    {
      icon: "🛋️",
      label: "Phòng khách Lounge nhung quý tộc"
    },
    {
      icon: "✨",
      label: "Đèn chùm đồng hoa loa kèn"
    },
    {
      icon: "🏺",
      label: "Tủ búp-phê gỗ quý cổ điển"
    },
    {
      icon: "🪟",
      label: "Cửa sổ vòm & Rèm yếm sò"
    },
    {
      icon: "🤵",
      label: "Quản gia riêng 24/7 (Butler)"
    },
    {
      icon: "🚗",
      label: "Đưa đón sân bay bằng Maybach"
    },
    {
      icon: "🥂",
      label: "Tiệc trà chiều High Tea & Rượu vang"
    }
  ],
  items: [
    {
      id: "armchair",
      name: "Sofa Góc Lounge Velvet & Bàn Trà Kính",
      category: "Nội Thất Phòng Khách",
      icon: "🛋️",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      position: {
        x: 0.4,
        y: -2.17,
        z: -2.04
      },
      description: "Bộ sofa nhung vương giả góc chữ L màu xanh ngọc lục bảo kết hợp bàn trà mặt kính khung gỗ tự nhiên cao cấp, trải thảm dệt họa tiết nghệ thuật tạo nên không gian tiếp khách quý tộc đỉnh cao.",
      specs: [
        {
          key: "Chất liệu sofa",
          val: "Nhung nỉ cao cấp Dedar Milano phong cách quý tộc"
        },
        {
          key: "Bàn trà",
          val: "Gỗ sồi tự nhiên mặt kính cường lực trong suốt"
        },
        {
          key: "Thảm trải sàn",
          val: "Thảm dệt sợi tự nhiên hoa văn trừu tượng sang trọng"
        },
        {
          key: "Tiện ích",
          val: "Tạp chí thời trang quốc tế & bộ ly pha lê cao cấp"
        }
      ],
      shortName: "Sofa Lounge"
    },
    {
      id: "chair",
      name: "Ghế Bành Thư Giãn Vintage Emerald",
      category: "Nội Thất Thư Giãn",
      icon: "🪑",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
      position: {
        x: -0.81,
        y: -1.82,
        z: 2.24
      },
      description: "Ghế bành đơn đệm dày êm ái bọc nhung xanh cổ điển đi kèm bàn trà nhỏ bằng gỗ mộc, góc thư thái riêng tư để đọc sách, thưởng trà và nhâm nhi cocktail chiều.",
      specs: [
        {
          key: "Kiểu dáng",
          val: "Ghế bành đơn phong cách cổ điển đệm múi sâu êm ái"
        },
        {
          key: "Màu sắc",
          val: "Xanh ngọc lục bảo (Emerald Green) quý phái"
        },
        {
          key: "Bàn phụ",
          val: "Bàn trà vuông gỗ tự nhiên nhỏ gọn tiện dụng"
        },
        {
          key: "Không gian",
          val: "Tận hưởng không gian tĩnh lặng bên khung cửa sổ"
        }
      ],
      shortName: "Ghế Bành"
    },
    {
      id: "credenza",
      name: "Tủ Credenza Gỗ Quý & Bình Hoa Nghệ Thuật",
      category: "Nội Thất Cổ Điển",
      icon: "🏺",
      image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
      position: {
        x: -2.53,
        y: -0.58,
        z: 1.5
      },
      description: "Tủ búp-phê gỗ quý cổ điển với cánh pano chạm khắc tinh xảo, trên mặt tủ bài trí bình hoa nghệ thuật rực rỡ và các tác phẩm gốm sứ sưu tầm mang đậm dấu ấn hoàng gia.",
      specs: [
        {
          key: "Chất liệu tủ",
          val: "Gỗ gụ nguyên khối xử lý sơn bóng cổ điển"
        },
        {
          key: "Hoa trang trí",
          val: "Bình hoa lụa nghệ thuật cắm thủ công tinh tế"
        },
        {
          key: "Công năng",
          val: "Lưu trữ ly tách cao cấp, khay trà & phụ kiện tiệc"
        },
        {
          key: "Điểm nhấn",
          val: "Điểm nhấn đối xứng hoàn hảo giữa hai khung cửa sổ"
        }
      ],
      shortName: "Tủ Credenza"
    },
    {
      id: "window",
      name: "Cửa Sổ Vòm & Rèm Cổ Điển Hoàng Gia",
      category: "Kiến Trúc & Tầm Nhìn",
      icon: "🪟",
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      position: {
        x: -2.89,
        y: -0.12,
        z: -0.8
      },
      description: "Hệ thống cửa sổ vòm đón ánh sáng tự nhiên với rèm voan trắng thêu hoa kết hợp rèm yếm sò cổ điển hoa văn gấm dệt nhiều lớp kiêu sa.",
      specs: [
        {
          key: "Kiểu dáng cửa",
          val: "Cửa sổ vòm phong cách kiến trúc Châu Âu cổ điển"
        },
        {
          key: "Rèm yếm sò",
          val: "Rèm vải gấm dệt hoa văn hoàng gia may nhún xếp nếp"
        },
        {
          key: "Rèm voan",
          val: "Rèm voan thêu chỉ tơ tinh xảo khuếch tán ánh sáng"
        },
        {
          key: "Tầm nhìn",
          val: "Khung cảnh vườn cây và sân đón khách thoáng đãng"
        }
      ],
      shortName: "Cửa Sổ Vòm"
    },
    {
      id: "chandelier",
      name: "Đèn Chùm Đồng Pha Lê Tân Cổ Điển",
      category: "Hệ Thống Ánh Sáng",
      icon: "✨",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
      position: {
        x: 1.65,
        y: 2.31,
        z: -0.97
      },
      description: "Đèn chùm thân đồng đúc nguyên khối với tay đèn uốn lượn mang chao đèn thủy tinh hoa loa kèn, tỏa ánh sáng vàng dịu dàng ấm cúng khắp gian phòng khách suite.",
      specs: [
        {
          key: "Chất liệu",
          val: "Đồng thau đúc mạ vàng cổ kết hợp chao thủy tinh mờ"
        },
        {
          key: "Ánh sáng",
          val: "Bóng LED sợi đốt vintage nhiệt độ màu 2700K ấm áp"
        },
        {
          key: "Kiểu dáng",
          val: "Thiết kế đèn chùm hoa loa kèn tân cổ điển Châu Âu"
        },
        {
          key: "Hiệu ứng",
          val: "Tạo quầng sáng lung linh ấm áp cho các buổi tiệc tối"
        }
      ],
      shortName: "Đèn Chùm"
    },
    {
      id: "painting",
      name: "Tranh Sơn Dầu Phong Cảnh Cổ Điển",
      category: "Nghệ Thuật & Trang Trí",
      icon: "🖼️",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
      position: {
        x: 1.27,
        y: 0.45,
        z: -2.68
      },
      description: "Bức tranh sơn dầu phong cảnh rừng cây thiên nhiên đóng khung gỗ mạ vàng trang nhã, tạo nét lắng đọng nghệ thuật cho không gian tiếp khách quý tộc.",
      specs: [
        {
          key: "Thể loại",
          val: "Tranh sơn dầu vẽ tay phong cảnh Châu Âu cổ điển"
        },
        {
          key: "Khung tranh",
          val: "Khung gỗ tự nhiên chạm hoa văn thếp vàng kim"
        },
        {
          key: "Kích thước",
          val: "Khổ vừa hài hòa với diện tường phòng khách"
        },
        {
          key: "Ý nghĩa",
          val: "Tôn vinh gu thẩm mỹ sang trọng của gia chủ"
        }
      ],
      shortName: "Tranh Sơn Dầu"
    },
    {
      id: "foyer",
      name: "Lối Vào Đại Sảnh & Phòng Ngủ Suite",
      category: "Kiến Trúc Suite",
      icon: "🚪",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      position: {
        x: 2.98,
        y: -0.12,
        z: -0.33
      },
      description: "Vòm cửa thông phòng sang trọng kết nối phòng khách lounge với khu vực phòng ngủ Master Super King, phòng tắm Onsen và phòng ăn riêng tư của căn suite tổng thống.",
      specs: [
        {
          key: "Kiến trúc",
          val: "Vòm cửa gỗ uốn cong kết nối liên hoàn các gian phòng"
        },
        {
          key: "Kết nối",
          val: "Thông lối vào phòng ngủ Master & Phòng tắm đá riêng"
        },
        {
          key: "Riêng tư",
          val: "Cửa phân vùng đảm bảo sự riêng tư tuyệt đối cho gia chủ"
        },
        {
          key: "Đặc quyền",
          val: "Quản gia riêng phục vụ trực tiếp tại sảnh đón Suite"
        }
      ],
      shortName: "Lối Vào Suite"
    }
  ]
};

// Tự động đăng ký vào kho phòng chung
if (typeof HotelRooms !== 'undefined') {
  HotelRooms.register('502', ROOM_502);
} else if (typeof window !== 'undefined') {
  window.ROOMS_DATA = window.ROOMS_DATA || {};
  window.ROOMS_DATA['502'] = ROOM_502;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROOM_502;
}
