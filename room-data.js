/**
 * room-data.js - Cấu hình dữ liệu chi tiết cho 2 phòng khách sạn & các vật dụng 3D tương tác
 * Đã hiệu chuẩn tọa độ 3D chính xác 100% theo ảnh chụp thực tế 360° Panorama
 */

const ROOMS_DATA = {
  "301": {
    "id": "301",
    "name": "Phòng 301 - Deluxe Grand Ocean Suite",
    "shortName": "Deluxe Ocean Suite",
    "roomNumber": "301",
    "tagline": "Tầm nhìn hoàng hôn vịnh biển vô cực & Nội thất gỗ óc chó ấm cúng",
    "price": 2850000,
    "priceFormatted": "2.850.000₫",
    "area": "48 m²",
    "capacity": "2 Người lớn + 1 Trẻ em",
    "bedType": "1 Giường King-Size (2m x 2m2)",
    "viewType": "Hướng biển Panorama 180°",
    "badge": "Phòng Bán Chạy Nhất",
    "roomImage": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    "panorama360Url": "hotel_room_preview.jpg",
    "panorama360FallbackUrl": "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/hotel_room.jpg",
    "theme": {
      "wallColor": "#23201d",
      "woodTone": "walnut",
      "accentColor": "#d4af37",
      "rugPattern": "deluxe",
      "isNightDefault": false
    },
    "amenities": [
      {
        "icon": "🌊",
        "label": "View biển trực diện"
      },
      {
        "icon": "🛏️",
        "label": "Giường King nệm cao su non"
      },
      {
        "icon": "🛁",
        "label": "Phòng tắm En-suite sang trọng"
      },
      {
        "icon": "📺",
        "label": "Smart TV 65\" 4K"
      },
      {
        "icon": "💼",
        "label": "Bàn làm việc doanh nhân"
      },
      {
        "icon": "🍸",
        "label": "Mini Bar & Khay cà phê"
      },
      {
        "icon": "📶",
        "label": "Wi-Fi 6 siêu tốc"
      },
      {
        "icon": "🍽️",
        "label": "Ăn sáng Buffet 5 sao"
      }
    ],
    "items": [
      {
        "id": "bath",
        "name": "Cửa Phòng Tắm Kính Mờ & En-suite Master",
        "category": "Phòng Tắm & Spa",
        "icon": "🛁",
        "isPortal": true,
        "targetRoom": "bathroom",
        "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 2.92,
          "y": -0.05,
          "z": -0.67
        },
        "description": "Cửa kính cường lực mờ cao cấp với tay nắm gạt sang trọng, mở lối vào phòng tắm master en-suite bọc đá cẩm thạch trắng Carrara với bồn tắm thư giãn, cabin tắm kính đứng và đầy đủ tiện nghi vệ sinh 5 sao.",
        "specs": [
          {
            "key": "Cửa phòng tắm",
            "val": "Kính cường lực mờ chống nước viền hợp kim nhôm xám"
          },
          {
            "key": "Trang thiết bị",
            "val": "Bồn tắm nằm thư giãn & Vòi sen tắm đứng Grohe Đức"
          },
          {
            "key": "Vật liệu ốp lát",
            "val": "Đá cẩm thạch trắng Carrara chống trơn trượt"
          },
          {
            "key": "Tương tác 3D",
            "val": "Nhấp vào để mở cửa bước vào khám phá bên trong phòng tắm!"
          }
        ],
        "shortName": "Phòng Tắm"
      },
      {
        "id": "bed",
        "name": "Giường Ngủ Hoàng Gia King-Size",
        "category": "Nội Thất Phòng Ngủ",
        "icon": "🛏️",
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 0.85,
          "y": -1.11,
          "z": -2.65
        },
        "description": "Giường cỡ King chuẩn 5 sao với kích thước 2.0m x 2.2m. Nệm lò xo túi Dunlopillo nâng đỡ 7 vùng cột sống, bọc drap trải giường lụa sợi Tencel 1000TC êm ái mát mịn, kèm tấm trải trang trí tông xanh olive thanh lịch.",
        "specs": [
          {
            "key": "Kích thước",
            "val": "200cm x 220cm x 65cm (Cỡ King chuẩn quốc tế)"
          },
          {
            "key": "Chất liệu nệm",
            "val": "Lò xo túi độc lập & Cao su non Dunlopillo Anh Quốc"
          },
          {
            "key": "Gối & Chăn",
            "val": "4 gối lông vũ Microfiber & Chăn lụa Tencel 1000TC"
          },
          {
            "key": "Thiết kế đầu giường",
            "val": "Gương ốp tường lớn kết hợp hệ tủ gỗ óc chó 2 bên"
          }
        ],
        "shortName": "Giường King"
      },
      {
        "id": "lamp",
        "name": "Tab Đầu Giường & Đèn Đọc Sách",
        "category": "Hệ Thống Ánh Sáng",
        "icon": "💡",
        "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 2.12,
          "y": -1.05,
          "z": -1.82
        },
        "description": "Tab đầu giường gỗ tự nhiên tích hợp đèn đọc sách LED cổ ngỗng linh hoạt, ổ cắm sạc điện thoại thoại và công tắc master điều khiển hệ thống chiếu sáng toàn phòng ngủ.",
        "specs": [
          {
            "key": "Đèn đọc sách",
            "val": "Đèn LED cổ ngỗng xoay 360 độ ánh sáng ấm 3000K"
          },
          {
            "key": "Đèn thả trần",
            "val": "Cặp đèn pha lê khói Art Deco buông rủ từ trần"
          },
          {
            "key": "Cổng tiện ích",
            "val": "Ổ cắm điện thoại, sạc nhanh USB-C tại đầu giường"
          },
          {
            "key": "Chất liệu",
            "val": "Gỗ óc chó walnut phối phụ kiện kim loại cao cấp"
          }
        ],
        "shortName": "Tab Đầu Giường"
      },
      {
        "id": "tv",
        "name": "Smart TV 65\" 4K Treo Tường",
        "category": "Thiết Bị Điện Tử",
        "icon": "📺",
        "image": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": -1.27,
          "y": 0.22,
          "z": 2.71
        },
        "description": "Smart TV màn hình lớn 65 inch độ phân giải 4K sắc nét gắn tường đối diện giường ngủ, tích hợp sẵn các ứng dụng giải trí Netflix, YouTube, Apple AirPlay 2 và hệ thống dịch vụ khách sạn trực tuyến.",
        "specs": [
          {
            "key": "Kích thước màn hình",
            "val": "65 inch 4K Ultra HD HDR tấm nền cao cấp"
          },
          {
            "key": "Âm thanh",
            "val": "Dàn loa vòm vòm Stereo sống động"
          },
          {
            "key": "Kết nối thông minh",
            "val": "AirPlay 2, Chromecast, Bluetooth 5.2, Wi-Fi 6"
          },
          {
            "key": "Dịch vụ phòng",
            "val": "Menu điện tử & Đặt món In-Room Dining trực tiếp"
          }
        ],
        "shortName": "Smart TV"
      },
      {
        "id": "desk",
        "name": "Bàn Làm Việc Doanh Nhân & Ghế Xoay Da",
        "category": "Góc Làm Việc",
        "icon": "💼",
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": -0.19,
          "y": -1.73,
          "z": 2.44
        },
        "description": "Khu vực bàn làm việc uốn lượn phong cách hiện đại với ghế xoay công thái học bọc da cao cấp chân sao kim loại mạ chrome, đi kèm đèn bàn đọc sách và trạm sạc đa năng.",
        "specs": [
          {
            "key": "Mặt bàn",
            "val": "Gỗ sồi đen uốn cong phủ sơn mờ chống trầy xước"
          },
          {
            "key": "Ghế làm việc",
            "val": "Ghế xoay da lưng trung chân hợp kim chrome có bánh xe"
          },
          {
            "key": "Đèn bàn",
            "val": "Đèn bàn kim loại bóng vòm chụp điều chỉnh góc chiếu"
          },
          {
            "key": "Kết nối",
            "val": "Trạm cắm điện âm bàn, cổng USB và mạng LAN tốc độ cao"
          }
        ],
        "shortName": "Bàn Làm Việc"
      },
      {
        "id": "minibar",
        "name": "Quầy Mini Bar & Khay Trà Cà Phê",
        "category": "Tiện Ích Ẩm Thực",
        "icon": "☕",
        "image": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": -2.12,
          "y": -1,
          "z": 1.88
        },
        "description": "Tủ lạnh minibar siêu êm tích hợp kín đáo dưới góc bàn làm việc. Mặt quầy bố trí ấm siêu tốc inox, khay tách trà sứ trắng, cà phê túi lọc, trà thảo mộc cao cấp và nước suối đóng chai miễn phí.",
        "specs": [
          {
            "key": "Tủ mát minibar",
            "val": "Tủ lạnh mini công nghệ hấp thụ nhiệt 0dB không tiếng ồn"
          },
          {
            "key": "Thiết bị đun",
            "val": "Ấm siêu tốc inox 304 giữ nhiệt an toàn"
          },
          {
            "key": "Miễn phí mỗi ngày",
            "val": "2 chai nước khoáng, trà Ô Long & cà phê hòa tan cao cấp"
          },
          {
            "key": "Đồ uống phục vụ",
            "val": "Nước ngọt, bia nhập khẩu, hạt điều & snack theo bảng giá"
          }
        ],
        "shortName": "Mini Bar"
      },
      {
        "id": "armchair",
        "name": "Ghế Bành Thư Giãn Màu Vàng Cốm",
        "category": "Nội Thất Thư Giãn",
        "icon": "🛋️",
        "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": -2.47,
          "y": -1.64,
          "z": 0.47
        },
        "description": "Ghế bành đơn bọc nỉ màu vàng cốm thời thượng tựa lưng cao êm ái đặt sát khung cửa sổ, là góc lý tưởng để ngắm nhìn bình minh, đọc sách và thưởng thức trà thơm.",
        "specs": [
          {
            "key": "Chất liệu nỉ",
            "val": "Vải nỉ cao cấp dệt sợi tự nhiên chống bám bẩn"
          },
          {
            "key": "Đệm mút",
            "val": "Mút đúc định hình mật độ cao êm ái nâng đỡ cơ thể"
          },
          {
            "key": "Màu sắc",
            "val": "Vàng cốm (Chartreuse) tạo điểm nhấn nghệ thuật"
          },
          {
            "key": "Chân ghế",
            "val": "Gỗ sồi tiện tròn phủ sơn đen mờ sang trọng"
          }
        ],
        "shortName": "Ghế Thư Giãn"
      },
      {
        "id": "window",
        "name": "Cửa Trượt Kính Ban Công Panorama View Biển",
        "category": "Ban Công & Tầm Nhìn",
        "icon": "🌊",
        "isPortal": true,
        "targetRoom": "balcony",
        "image": "balcony_preview.jpg",
        "position": {
          "x": -2.07,
          "y": 0.22,
          "z": -2.16
        },
        "description": "Cửa trượt kính cường lực kịch trần mở lối bước ra ban công riêng view biển. Nơi bạn đứng ngắm trọn vẹn vịnh biển xanh ngắt bao la và đại lộ sầm uất phía dưới chân tòa nhà.",
        "specs": [
          {
            "key": "Cửa ban công",
            "val": "Cửa kính hộp Low-E 3 lớp trượt êm ái cách âm tuyệt đối"
          },
          {
            "key": "Tầm nhìn ban công",
            "val": "Trực diện biển xanh bao la & Đại lộ ven biển phía dưới"
          },
          {
            "key": "Trải nghiệm 3D",
            "val": "Nhấp vào để mở cửa trượt kính bước ra ban công ngắm cảnh!"
          }
        ],
        "shortName": "Ban Công View Biển"
      },
      {
        "id": "door",
        "name": "Cửa Chính Ra Vào & Sảnh Phòng",
        "category": "Kiến Trúc & An Ninh",
        "icon": "🚪",
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 2.08,
          "y": -0.12,
          "z": 2.16
        },
        "description": "Lối vào phòng suite với cửa gỗ chống cháy cách âm, khóa thẻ từ RFID thông minh, chốt an toàn kép, kệ để hành lý gấp gọn tiện lợi và tủ treo quần áo âm tường.",
        "specs": [
          {
            "key": "Cửa ra vào",
            "val": "Cửa gỗ sồi chống cháy 60 phút cách âm cao cấp"
          },
          {
            "key": "Hệ thống khóa",
            "val": "Khóa thẻ từ RFID công nghệ mã hóa bảo mật cao"
          },
          {
            "key": "Tiện ích sảnh",
            "val": "Kệ để vali hành lý, tủ móc áo & gương soi toàn thân"
          },
          {
            "key": "An toàn",
            "val": "Mắt thần quan sát góc rộng & chốt khóa an toàn bên trong"
          }
        ],
        "shortName": "Cửa Ra Vào"
      }
    ],
    "subRooms": {
      "bathroom": {
        "id": "301_bathroom",
        "name": "Phòng 301 - Phòng Tắm Master En-suite",
        "shortName": "Phòng Tắm Master",
        "tagline": "Không gian Spa & Thư giãn riêng tư bọc đá cẩm thạch trắng Carrara",
        "panorama360Url": "bathroom_preview.jpg",
        "panorama360FallbackUrl": "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/bathroom.jpg",
        "initialTarget": { "x": -2.57, "y": -1.54, "z": -0.11 },
        "items": [
          {
            "id": "bathtub",
            "name": "Bồn Tắm Nằm Thư Giãn Bục Đá",
            "shortName": "Bồn Tắm Nằm",
            "category": "Thiết Bị Thư Giãn",
            "icon": "🛁",
            "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": -2.57,
              "y": -1.54,
              "z": -0.11
            },
            "description": "Bồn tắm nằm âm sàn đặt trên bục đá cẩm thạch kiêu sa với thành bồn uốn cong công thái học nâng đỡ cơ thể. Trang bị vòi xả nước thác chảy, vòi sen cầm tay Grohe mạ chrome bóng và khay xà phòng âm tường.",
            "specs": [
              {
                "key": "Kích thước bồn",
                "val": "175cm x 85cm x 60cm sâu rộng thoải mái"
              },
              {
                "key": "Chất liệu",
                "val": "Acrylic cao cấp tráng men kháng khuẩn & Đá cẩm thạch"
              },
              {
                "key": "Thiết bị cấp nước",
                "val": "Vòi sen tắm cầm tay & Bộ trộn nhiệt Grohe Đức"
              },
              {
                "key": "Tiện ích trị liệu",
                "val": "Set muối khoáng ngâm bồn thảo mộc & tinh dầu hoa hồng"
              }
            ]
          },
          {
            "id": "shower",
            "name": "Cabin Tắm Kính Đứng & Sen Cây Tăng Áp",
            "shortName": "Cabin Tắm Kính",
            "category": "Khu Vực Tắm Đứng",
            "icon": "🚿",
            "image": "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": 2.89,
              "y": -0.12,
              "z": 0.80
            },
            "description": "Buồng tắm đứng vách kính cường lực trong suốt chống tràn nước, trang bị hệ thống sen cây trần tạo mưa nhân tạo (Rain Shower) và sen tay điều chỉnh 3 chế độ phun massage thư giãn cơ bắp.",
            "specs": [
              {
                "key": "Vách kính",
                "val": "Kính cường lực 10mm phủ Nano chống bám cặn nước"
              },
              {
                "key": "Hệ thống sen",
                "val": "Sen cây Grohe Rainshower đường kính lớn 310mm"
              },
              {
                "key": "Điều nhiệt thông minh",
                "val": "Van hằng nhiệt kiểm soát chuẩn xác 38°C chống bỏng"
              },
              {
                "key": "Sàn cabin",
                "val": "Gạch mosaic ceramic chống trơn trượt tuyệt đối"
              }
            ]
          },
          {
            "id": "vanity",
            "name": "Bàn Lavabo Đá Cẩm Thạch & Chậu Rửa Mặt",
            "shortName": "Bàn Lavabo",
            "category": "Bàn Trang Điểm & Vệ Sinh",
            "icon": "🪞",
            "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": 0.10,
              "y": -1.23,
              "z": 2.73
            },
            "description": "Bàn trang điểm và rửa mặt mặt đá cẩm thạch trắng tự nhiên với chậu rửa âm bàn sứ tráng men nano cao cấp, vòi nước nóng lạnh Hansgrohe và tủ gỗ lưu trữ khăn dự phòng bên dưới.",
            "specs": [
              {
                "key": "Mặt bàn đá",
                "val": "Đá cẩm thạch Marble Carrara trắng vân mây tự nhiên"
              },
              {
                "key": "Chậu rửa mặt",
                "val": "Sứ vệ sinh Toto CeFiONtect chống bám bẩn siêu nhẵn"
              },
              {
                "key": "Vòi rửa",
                "val": "Vòi gạt một tay Hansgrohe mạ chrome bóng sang trọng"
              },
              {
                "key": "Tủ lưu trữ dưới",
                "val": "Tủ gỗ phủ sơn chống ẩm 2 cánh rộng rãi"
              }
            ]
          },
          {
            "id": "toiletries",
            "name": "Bộ Mỹ Phẩm & Khay Tiện Nghi 5 Sao",
            "shortName": "Mỹ Phẩm Tiện Nghi",
            "category": "Tiện Nghi Vệ Sinh",
            "icon": "🧴",
            "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": 1.00,
              "y": -0.46,
              "z": 2.79
            },
            "description": "Bộ tiện ích cá nhân chuẩn khách sạn 5 sao đặt trên mặt bàn đá bao gồm dầu gội, sữa tắm hữu cơ, dầu xả dưỡng tóc, dao cạo râu, bàn chải sợi tre, mũ tắm và cốc thủy tinh pha lê.",
            "specs": [
              {
                "key": "Bộ mỹ phẩm tắm",
                "val": "Set dầu gội & sữa tắm hữu cơ L'Occitane chiết xuất thảo mộc"
              },
              {
                "key": "Đồ dùng cá nhân",
                "val": "Bàn chải sợi tre, kem đánh răng, dao cạo râu, tăm bông"
              },
              {
                "key": "Tiêu chuẩn xanh",
                "val": "Bao bì giấy kraft tái chế thân thiện môi trường (Eco-Friendly)"
              },
              {
                "key": "Dịch vụ phòng",
                "val": "Được nhân viên buồng phòng bổ sung đầy đủ mỗi ngày"
              }
            ]
          },
          {
            "id": "towels",
            "name": "Giá Treo Khăn Đôi & Khăn Tắm Cotton",
            "shortName": "Khăn Tắm Cao Cấp",
            "category": "Đồ Vải Khách Sạn",
            "icon": "🧣",
            "image": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": 2.43,
              "y": -0.46,
              "z": -1.69
            },
            "description": "Giá treo khăn kim loại mạ chrome kép trang bị sẵn khăn tắm lớn cotton Ai Cập 800 GSM mềm mại thấm hút tốt, khăn mặt, khăn lau tay và giỏ mây đựng đồ giặt tiện lợi.",
            "specs": [
              {
                "key": "Chất liệu khăn",
                "val": "100% Cotton chải kỹ Ai Cập 800 GSM siêu dày và mềm"
              },
              {
                "key": "Số lượng trang bị",
                "val": "2 khăn tắm đại, 2 khăn mặt & 2 khăn lau tay khử khuẩn"
              },
              {
                "key": "Giỏ đồ giặt",
                "val": "Giỏ mây đan tự nhiên lót vải thô thoáng khí"
              },
              {
                "key": "Dịch vụ giặt ủi",
                "val": "Túi giặt ủi đồ khách sạn lấy nhanh trong 4 giờ"
              }
            ]
          },
          {
            "id": "back_to_bedroom",
            "name": "Cửa Quay Lại Phòng Ngủ Suite 301",
            "shortName": "Về Phòng Ngủ",
            "category": "Điều Hướng Không Gian",
            "icon": "🚪",
            "isBackPortal": true,
            "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": -0.10,
              "y": -0.12,
              "z": -3.00
            },
            "description": "Cánh cửa phòng tắm mở lối quay trở lại không gian phòng ngủ Deluxe Grand Ocean Suite 301 với giường King-size và ban công ngắm biển.",
            "specs": [
              {
                "key": "Điểm đến",
                "val": "Phòng ngủ Master P.301 - Deluxe Grand Ocean Suite"
              },
              {
                "key": "Thao tác",
                "val": "Nhấp vào để mở cửa bước ra ngoài phòng ngủ"
              }
            ]
          }
        ]
      },
      "balcony": {
        "id": "balcony",
        "name": "Ban Công Panorama View Biển",
        "panorama360Url": "balcony_preview.jpg",
        "panorama360FallbackUrl": "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/fish_hoek_beach.jpg",
        "initialTarget": {
          "x": 0.2,
          "y": 0.15,
          "z": -2.95
        },
        "items": [
          {
            "id": "sea_view",
            "name": "Tầm Nhìn Vịnh Biển Vô Cực",
            "shortName": "View Biển Xanh",
            "category": "Cảnh Quan Ngoại Cảnh",
            "icon": "🌊",
            "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": 0.2,
              "y": 0.15,
              "z": -2.95
            },
            "description": "Tầm nhìn không giới hạn hướng ra vịnh biển xanh ngọc bích, bờ cát trắng trải dài và những con sóng êm đềm. Nơi đón ánh bình minh và chiêm ngưỡng hoàng hôn rực rỡ nhất đảo ngọc.",
            "specs": [
              {
                "key": "Hướng nhìn",
                "val": "Chính diện biển (Direct Ocean View)"
              },
              {
                "key": "Khung cảnh",
                "val": "Bờ biển trong xanh, đường chân trời vô cực"
              },
              {
                "key": "Không khí",
                "val": "Gió biển tự nhiên trong lành thoáng đãng"
              }
            ]
          },
          {
            "id": "street_view",
            "name": "Đại Lộ Ven Biển & Tuyến Phố Đi Bộ",
            "shortName": "Đường Phố Phía Dưới",
            "category": "Cảnh Quan Ngoại Cảnh",
            "icon": "🛣️",
            "image": "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": 1.7,
              "y": -1.7,
              "z": -1.7
            },
            "description": "Góc nhìn từ ban công nhìn thẳng xuống đại lộ ven biển rợp bóng dừa, làn đường xe chạy êm đềm và vỉa hè lát đá hoa cương dành cho du khách tản bộ ngắm cảnh ven bờ vịnh.",
            "specs": [
              {
                "key": "Góc nhìn",
                "val": "Từ ban công tầng cao nhìn xuống đại lộ dưới chân tòa nhà"
              },
              {
                "key": "Hạ tầng",
                "val": "Đường ven biển 4 làn xe, vỉa hè lát đá và hàng dừa mát rượi"
              },
              {
                "key": "Ánh sáng đêm",
                "val": "Hệ thống đèn đường LED vàng ấm cúng lung linh về đêm"
              }
            ]
          },
          {
            "id": "balcony_table",
            "name": "Bàn Trà & Ghế Mây Thư Giãn Ngoài Trời",
            "shortName": "Bàn Ghế Ban Công",
            "category": "Tiện Nghi Ban Công",
            "icon": "☕",
            "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": -2.2,
              "y": -1.5,
              "z": -0.9
            },
            "description": "Bộ bàn trà tròn mặt kính cường lực kèm 2 ghế tựa mây nhựa đan thủ công kháng tia UV và chống chịu thời tiết biển. Thích hợp cho việc thưởng thức ly cà phê sáng hoặc ly rượu vang lúc hoàng hôn.",
            "specs": [
              {
                "key": "Chất liệu",
                "val": "Mây nhựa cao cấp kháng nước biển & Khung hợp kim nhôm sơn tĩnh điện"
              },
              {
                "key": "Nệm ngồi",
                "val": "Nệm chống thấm nước chuyên dụng ngoài trời Sunbrella"
              },
              {
                "key": "Tiện ích",
                "val": "Set trà chiều hoặc bữa sáng ngắm biển phục vụ tận phòng"
              }
            ]
          },
          {
            "id": "glass_railing",
            "name": "Lan Can Kính Cường Lực Không Viền",
            "shortName": "Lan Can Kính 1.2m",
            "category": "An Toàn & Kiến Trúc",
            "icon": "🛡️",
            "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            "position": {
              "x": -0.2,
              "y": -1.2,
              "z": -2.7
            },
            "description": "Hệ lan can kính cường lực an toàn dày 15mm cao 1.2m với tay vịn inox 316 chống ăn mòn muối biển, thiết kế không viền giúp tối ưu trọn vẹn 100% tầm nhìn ra biển và đường phố bên dưới.",
            "specs": [
              {
                "key": "Chiều cao lan can",
                "val": "1.2m đạt tiêu chuẩn an toàn nghỉ dưỡng 5 sao quốc tế"
              },
              {
                "key": "Kính",
                "val": "Kính cường lực an toàn 2 lớp dán phim PVB chống nứt vỡ"
              },
              {
                "key": "Tay vịn",
                "val": "Thép không gỉ Inox 316 mạ satin sang trọng"
              }
            ]
          },
          {
            "id": "back_to_bedroom_from_balcony",
            "name": "Cửa Trượt Quay Lại Phòng Ngủ Suite 301",
            "shortName": "Vào Lại Phòng Ngủ",
            "category": "Điều Hướng Không Gian",
            "icon": "🚪",
            "isBackPortal": true,
            "image": "hotel_room_preview.jpg",
            "position": {
              "x": 0.1,
              "y": 0.0,
              "z": 2.95
            },
            "description": "Cửa kính trượt cách âm 3 lớp dẫn ngược trở lại không gian phòng ngủ Deluxe Grand Ocean Suite ấm cúng với máy lạnh và giường King-size.",
            "specs": [
              {
                "key": "Điểm đến",
                "val": "Phòng ngủ Master Suite 301"
              },
              {
                "key": "Cửa kính",
                "val": "Kính hộp cách âm cách nhiệt Low-E 3 lớp"
              },
              {
                "key": "Thao tác",
                "val": "Nhấp vào để bước vào lại phòng ngủ"
              }
            ]
          }
        ]
      }
    }
  },
  "502": {
    "id": "502",
    "name": "Phòng 502 - Royal Presidential Sky Suite",
    "shortName": "Presidential Sky Suite",
    "roomNumber": "502",
    "tagline": "Đỉnh cao xa hoa tầng 50 với phòng khách Lounge phong cách Hoàng Gia cổ điển",
    "price": 5900000,
    "priceFormatted": "5.900.000₫",
    "area": "92 m²",
    "capacity": "3 Người lớn hoặc 2 Người lớn + 2 Trẻ em",
    "bedType": "Phòng khách Suite hoàng gia + Phòng ngủ Master Super King",
    "viewType": "Skyline Thành Phố Đêm Tầng 50",
    "badge": "Hạng Phòng Tổng Thống Đẳng Cấp",
    "roomImage": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    "panorama360Url": "anniversary_lounge_preview.jpg",
    "panorama360FallbackUrl": "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/anniversary_lounge.jpg",
    "theme": {
      "wallColor": "#121721",
      "woodTone": "ebony",
      "accentColor": "#38bdf8",
      "rugPattern": "presidential",
      "isNightDefault": true
    },
    "amenities": [
      {
        "icon": "🏙️",
        "label": "Tầng 50 view Skyline lộng lẫy"
      },
      {
        "icon": "🛋️",
        "label": "Phòng khách Lounge nhung quý tộc"
      },
      {
        "icon": "✨",
        "label": "Đèn chùm đồng hoa loa kèn"
      },
      {
        "icon": "🏺",
        "label": "Tủ búp-phê gỗ quý cổ điển"
      },
      {
        "icon": "🪟",
        "label": "Cửa sổ vòm & Rèm yếm sò"
      },
      {
        "icon": "🤵",
        "label": "Quản gia riêng 24/7 (Butler)"
      },
      {
        "icon": "🚗",
        "label": "Đưa đón sân bay bằng Maybach"
      },
      {
        "icon": "🥂",
        "label": "Tiệc trà chiều High Tea & Rượu vang"
      }
    ],
    "items": [
      {
        "id": "armchair",
        "name": "Sofa Góc Lounge Velvet & Bàn Trà Kính",
        "category": "Nội Thất Phòng Khách",
        "icon": "🛋️",
        "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 0.4,
          "y": -2.17,
          "z": -2.04
        },
        "description": "Bộ sofa nhung vương giả góc chữ L màu xanh ngọc lục bảo kết hợp bàn trà mặt kính khung gỗ tự nhiên cao cấp, trải thảm dệt họa tiết nghệ thuật tạo nên không gian tiếp khách quý tộc đỉnh cao.",
        "specs": [
          {
            "key": "Chất liệu sofa",
            "val": "Nhung nỉ cao cấp Dedar Milano phong cách quý tộc"
          },
          {
            "key": "Bàn trà",
            "val": "Gỗ sồi tự nhiên mặt kính cường lực trong suốt"
          },
          {
            "key": "Thảm trải sàn",
            "val": "Thảm dệt sợi tự nhiên hoa văn trừu tượng sang trọng"
          },
          {
            "key": "Tiện ích",
            "val": "Tạp chí thời trang quốc tế & bộ ly pha lê cao cấp"
          }
        ],
        "shortName": "Sofa Lounge"
      },
      {
        "id": "chair",
        "name": "Ghế Bành Thư Giãn Vintage Emerald",
        "category": "Nội Thất Thư Giãn",
        "icon": "🪑",
        "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": -0.81,
          "y": -1.82,
          "z": 2.24
        },
        "description": "Ghế bành đơn đệm dày êm ái bọc nhung xanh cổ điển đi kèm bàn trà nhỏ bằng gỗ mộc, góc thư thái riêng tư để đọc sách, thưởng trà và nhâm nhi cocktail chiều.",
        "specs": [
          {
            "key": "Kiểu dáng",
            "val": "Ghế bành đơn phong cách cổ điển đệm múi sâu êm ái"
          },
          {
            "key": "Màu sắc",
            "val": "Xanh ngọc lục bảo (Emerald Green) quý phái"
          },
          {
            "key": "Bàn phụ",
            "val": "Bàn trà vuông gỗ tự nhiên nhỏ gọn tiện dụng"
          },
          {
            "key": "Không gian",
            "val": "Tận hưởng không gian tĩnh lặng bên khung cửa sổ"
          }
        ],
        "shortName": "Ghế Bành"
      },
      {
        "id": "credenza",
        "name": "Tủ Credenza Gỗ Quý & Bình Hoa Nghệ Thuật",
        "category": "Nội Thất Cổ Điển",
        "icon": "🏺",
        "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": -2.53,
          "y": -0.58,
          "z": 1.5
        },
        "description": "Tủ búp-phê gỗ quý cổ điển với cánh pano chạm khắc tinh xảo, trên mặt tủ bài trí bình hoa nghệ thuật rực rỡ và các tác phẩm gốm sứ sưu tầm mang đậm dấu ấn hoàng gia.",
        "specs": [
          {
            "key": "Chất liệu tủ",
            "val": "Gỗ gụ nguyên khối xử lý sơn bóng cổ điển"
          },
          {
            "key": "Hoa trang trí",
            "val": "Bình hoa lụa nghệ thuật cắm thủ công tinh tế"
          },
          {
            "key": "Công năng",
            "val": "Lưu trữ ly tách cao cấp, khay trà & phụ kiện tiệc"
          },
          {
            "key": "Điểm nhấn",
            "val": "Điểm nhấn đối xứng hoàn hảo giữa hai khung cửa sổ"
          }
        ],
        "shortName": "Tủ Credenza"
      },
      {
        "id": "window",
        "name": "Cửa Sổ Vòm & Rèm Cổ Điển Hoàng Gia",
        "category": "Kiến Trúc & Tầm Nhìn",
        "icon": "🪟",
        "image": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": -2.89,
          "y": -0.12,
          "z": -0.8
        },
        "description": "Hệ thống cửa sổ vòm đón ánh sáng tự nhiên với rèm voan trắng thêu hoa kết hợp rèm yếm sò cổ điển hoa văn gấm dệt nhiều lớp kiêu sa.",
        "specs": [
          {
            "key": "Kiểu dáng cửa",
            "val": "Cửa sổ vòm phong cách kiến trúc Châu Âu cổ điển"
          },
          {
            "key": "Rèm yếm sò",
            "val": "Rèm vải gấm dệt hoa văn hoàng gia may nhún xếp nếp"
          },
          {
            "key": "Rèm voan",
            "val": "Rèm voan thêu chỉ tơ tinh xảo khuếch tán ánh sáng"
          },
          {
            "key": "Tầm nhìn",
            "val": "Khung cảnh vườn cây và sân đón khách thoáng đãng"
          }
        ],
        "shortName": "Cửa Sổ Vòm"
      },
      {
        "id": "chandelier",
        "name": "Đèn Chùm Đồng Pha Lê Tân Cổ Điển",
        "category": "Hệ Thống Ánh Sáng",
        "icon": "✨",
        "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 1.65,
          "y": 2.31,
          "z": -0.97
        },
        "description": "Đèn chùm thân đồng đúc nguyên khối với tay đèn uốn lượn mang chao đèn thủy tinh hoa loa kèn, tỏa ánh sáng vàng dịu dàng ấm cúng khắp gian phòng khách suite.",
        "specs": [
          {
            "key": "Chất liệu",
            "val": "Đồng thau đúc mạ vàng cổ kết hợp chao thủy tinh mờ"
          },
          {
            "key": "Ánh sáng",
            "val": "Bóng LED sợi đốt vintage nhiệt độ màu 2700K ấm áp"
          },
          {
            "key": "Kiểu dáng",
            "val": "Thiết kế đèn chùm hoa loa kèn tân cổ điển Châu Âu"
          },
          {
            "key": "Hiệu ứng",
            "val": "Tạo quầng sáng lung linh ấm áp cho các buổi tiệc tối"
          }
        ],
        "shortName": "Đèn Chùm"
      },
      {
        "id": "painting",
        "name": "Tranh Sơn Dầu Phong Cảnh Cổ Điển",
        "category": "Nghệ Thuật & Trang Trí",
        "icon": "🖼️",
        "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 1.27,
          "y": 0.45,
          "z": -2.68
        },
        "description": "Bức tranh sơn dầu phong cảnh rừng cây thiên nhiên đóng khung gỗ mạ vàng trang nhã, tạo nét lắng đọng nghệ thuật cho không gian tiếp khách quý tộc.",
        "specs": [
          {
            "key": "Thể loại",
            "val": "Tranh sơn dầu vẽ tay phong cảnh Châu Âu cổ điển"
          },
          {
            "key": "Khung tranh",
            "val": "Khung gỗ tự nhiên chạm hoa văn thếp vàng kim"
          },
          {
            "key": "Kích thước",
            "val": "Khổ vừa hài hòa với diện tường phòng khách"
          },
          {
            "key": "Ý nghĩa",
            "val": "Tôn vinh gu thẩm mỹ sang trọng của gia chủ"
          }
        ],
        "shortName": "Tranh Sơn Dầu"
      },
      {
        "id": "foyer",
        "name": "Lối Vào Đại Sảnh & Phòng Ngủ Suite",
        "category": "Kiến Trúc Suite",
        "icon": "🚪",
        "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "position": {
          "x": 2.98,
          "y": -0.12,
          "z": -0.33
        },
        "description": "Vòm cửa thông phòng sang trọng kết nối phòng khách lounge với khu vực phòng ngủ Master Super King, phòng tắm Onsen và phòng ăn riêng tư của căn suite tổng thống.",
        "specs": [
          {
            "key": "Kiến trúc",
            "val": "Vòm cửa gỗ uốn cong kết nối liên hoàn các gian phòng"
          },
          {
            "key": "Kết nối",
            "val": "Thông lối vào phòng ngủ Master & Phòng tắm đá riêng"
          },
          {
            "key": "Riêng tư",
            "val": "Cửa phân vùng đảm bảo sự riêng tư tuyệt đối cho gia chủ"
          },
          {
            "key": "Đặc quyền",
            "val": "Quản gia riêng phục vụ trực tiếp tại sảnh đón Suite"
          }
        ],
        "shortName": "Lối Vào Suite"
      }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ROOMS_DATA };
}
