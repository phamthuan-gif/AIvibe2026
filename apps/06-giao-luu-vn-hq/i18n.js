(() => {
  const STORAGE_KEY = "cau-noi-vh-lang";

  const dict = {
    vi: {
      "meta.title.home": "Cầu Nối Việt–Hàn — Giao lưu văn hóa",
      "meta.title.intro": "Giới thiệu — Cầu Nối Việt–Hàn",
      "meta.title.culture": "Văn hóa Việt Nam — Cầu Nối Việt–Hàn",
      "meta.title.cultureKr": "Văn hóa Hàn Quốc — Cầu Nối Việt–Hàn",
      "meta.title.places": "Địa danh Việt Nam — Cầu Nối Việt–Hàn",
      "meta.title.placesKr": "Địa danh Hàn Quốc — Cầu Nối Việt–Hàn",
      "brand": "Cầu Nối Việt–Hàn",
      "nav.home": "Trang chủ",
      "nav.intro": "Giới thiệu",
      "nav.culture": "Văn hóa VN",
      "nav.cultureKr": "Văn hóa HQ",
      "nav.places": "Địa danh VN",
      "nav.placesKr": "Địa danh HQ",
      "nav.facesort": "FaceSort",
      "nav.diplomacy": "Ngoại giao",
      "nav.coop": "Hợp tác",
      "nav.exchange": "Giao lưu",
      "nav.main": "Điều hướng chính",
      "nav.open": "Mở menu",
      "lang.label": "Chọn ngôn ngữ",

      "home.kicker": "한·베 문화교류",
      "home.lead": "Không gian giao lưu văn hóa giữa Việt Nam và Hàn Quốc — từ lịch sử ngoại giao đến hợp tác hôm nay.",
      "home.cta.intro": "Xem trang giới thiệu",
      "home.cta.culture": "Văn hóa Việt Nam",
      "home.cta.cultureKr": "Văn hóa Hàn Quốc",
      "home.cta.places": "Địa danh Việt Nam",
      "home.cta.placesKr": "Địa danh Hàn Quốc",
      "home.cta.facesort": "Nhận diện gương mặt",
      "home.hero.alt": "Cầu Vàng tại Bà Nà Hills, Đà Nẵng",

      "places.eyebrow": "Du lịch & khám phá",
      "places.title": "Địa danh Việt Nam",
      "places.lead": "Chọn một địa danh để xem giới thiệu, rồi nhập địa chỉ của bạn để hiện chỉ đường trên Google Maps.",
      "places.form.label": "Chỉ đường đến địa danh này",
      "places.form.origin": "Địa chỉ của bạn",
      "places.form.placeholder": "Nhập địa chỉ của bạn (vd: 41 Lê Duẩn, Đà Nẵng)",
      "places.form.submit": "Xem chỉ đường",
      "places.form.note": "Nhập địa chỉ xuất phát — bản đồ sẽ hiện lộ trình tới địa danh đang chọn.",
      "places.map.open": "Mở trên Google Maps",
      "place.nav.hoian": "Hội An",
      "place.nav.banahill": "Cầu Vàng",
      "place.nav.hanoi": "Hà Nội",
      "place.nav.sapa": "Ruộng bậc thang",
      "place.nav.taxua": "Tà Xùa",
      "place.nav.hue": "Huế",

      "placesKr.eyebrow": "Du lịch & khám phá",
      "placesKr.title": "Địa danh Hàn Quốc",
      "placesKr.lead": "Chọn một địa danh để xem giới thiệu, rồi nhập địa chỉ của bạn để hiện chỉ đường trên Google Maps.",
      "placesKr.form.placeholder": "Nhập địa chỉ của bạn (vd: Incheon Airport, Seoul)",
      "placeKr.nav.gyeongbok": "Gyeongbokgung",
      "placeKr.nav.bukchon": "Bukchon",
      "placeKr.nav.nseoul": "N Seoul Tower",
      "placeKr.nav.busan": "Busan",
      "placeKr.nav.jeju": "Jeju",
      "placeKr.nav.gyeongju": "Gyeongju",

      "intro.eyebrow": "Trang giới thiệu",
      "intro.title": "Việt Nam & Hàn Quốc",
      "intro.lead": "Hành trình ngoại giao, các lĩnh vực hợp tác và dòng chảy giao lưu văn hóa giữa hai dân tộc.",
      "intro.back": "← Về trang chủ",

      "diplomacy.eyebrow": "Lịch sử ngoại giao",
      "diplomacy.title": "Từ hữu nghị đến đối tác chiến lược toàn diện",
      "diplomacy.lead": "Ngày 22/12/1992, Việt Nam và Hàn Quốc chính thức thiết lập quan hệ ngoại giao. Hơn ba thập kỷ sau, quan hệ hai nước đã nâng lên mức cao nhất trong thang bậc đối tác.",
      "diplomacy.t1.title": "Thiết lập quan hệ ngoại giao",
      "diplomacy.t1.text": "Hai nước mở cửa chương mới: đại sứ quán, trao đổi chính thức và nền tảng pháp lý cho hợp tác.",
      "diplomacy.t2.title": "Đối tác toàn diện",
      "diplomacy.t2.text": "Quan hệ được nâng cấp, mở rộng hợp tác kinh tế, đầu tư và giao lưu nhân dân.",
      "diplomacy.t3.title": "Đối tác hợp tác chiến lược",
      "diplomacy.t3.text": "Hai bên củng cố tin cậy chính trị và phối hợp trên nhiều lĩnh vực then chốt.",
      "diplomacy.t4.title": "Đối tác chiến lược toàn diện",
      "diplomacy.t4.text": "Nhân kỷ niệm 30 năm quan hệ, hai nước nâng cấp lên mức cao nhất — mở rộng hợp tác chính trị, kinh tế, văn hóa, giáo dục và kết nối cộng đồng.",

      "coop.eyebrow": "Các trụ cột hợp tác",
      "coop.title": "Kinh tế · Văn hóa · Giáo dục · Con người",
      "coop.lead": "Hợp tác Việt–Hàn ngày càng sâu rộng, từ thương mại đầu tư đến lớp học ngôn ngữ và những buổi giao lưu văn hóa trên đường phố hai nước.",
      "coop.econ.title": "Kinh tế & đầu tư",
      "coop.econ.text": "Hàn Quốc thuộc nhóm đối tác đầu tư và thương mại hàng đầu của Việt Nam; doanh nghiệp Hàn hiện diện mạnh ở công nghiệp, điện tử, xây dựng.",
      "coop.culture.title": "Văn hóa & giải trí",
      "coop.culture.text": "Làn sóng Hallyu (K-pop, phim, ẩm thực) lan rộng tại Việt Nam; văn hóa Việt cũng ngày càng được giới thiệu tại Hàn Quốc.",
      "coop.edu.title": "Giáo dục & ngôn ngữ",
      "coop.edu.text": "Du học, trao đổi sinh viên, dạy tiếng Hàn và tiếng Việt mở rộng cơ hội hiểu biết lẫn nhau giữa thế hệ trẻ.",
      "coop.people.title": "Kết nối cộng đồng",
      "coop.people.text": "Cộng đồng người Việt tại Hàn Quốc và người Hàn tại Việt Nam là cầu nối sống động của quan hệ hai nước.",

      "exchange.eyebrow": "Giao lưu văn hóa",
      "exchange.title": "Khi hai nền văn hóa gặp nhau",
      "exchange.lead": "Giao lưu văn hóa không chỉ là lễ hội hay biểu diễn — mà là những trải nghiệm đời thường: món ăn, ngôn ngữ, âm nhạc, và sự tôn trọng khác biệt.",
      "exchange.t1.time": "Ẩm thực",
      "exchange.t1.title": "Bàn ăn chung",
      "exchange.t1.text": "Kimchi và phở, BBQ và bánh mì — ẩm thực trở thành ngôn ngữ dễ gần nhất giữa hai dân tộc.",
      "exchange.t2.time": "Nghệ thuật",
      "exchange.t2.title": "Âm nhạc & màn ảnh",
      "exchange.t2.text": "K-drama, K-pop cùng điện ảnh, âm nhạc Việt tạo nên dòng chảy sáng tạo hai chiều.",
      "exchange.t3.time": "Thanh niên",
      "exchange.t3.title": "Thế hệ kết nối",
      "exchange.t3.text": "Sinh viên, tình nguyện viên và các chương trình giao lưu là lực lượng làm sống động quan hệ Việt–Hàn.",
      "exchange.quote": "“Quan hệ tốt đẹp bắt đầu từ sự hiểu biết — và hiểu biết bắt đầu khi chúng ta lắng nghe câu chuyện của nhau.”",

      "closing.intro.title": "Cùng tìm hiểu · Cùng tôn trọng · Cùng kết nối",
      "closing.intro.text": "Cầu Nối Việt–Hàn là lời mời khám phá lịch sử hữu nghị và vẻ đẹp văn hóa của hai đất nước.",
      "closing.home": "Về trang chủ",

      "footer.line": "<strong>Cầu Nối Việt–Hàn</strong> — Giao lưu văn hóa Việt Nam &amp; Hàn Quốc",
      "footer.meta": "Vietnam · Republic of Korea · Cultural Exchange",

      "culture.eyebrow": "Khám phá",
      "culture.title": "Văn hóa Việt Nam",
      "culture.lead": "Từ dòng chảy lịch sử đến bàn ăn, lễ hội và di sản — những nét văn hóa để bạn bè Hàn Quốc và mọi người cùng tìm hiểu.",
      "toc.history": "Lịch sử",
      "toc.food": "Ẩm thực",
      "toc.festival": "Lễ hội",
      "toc.costume": "Trang phục",
      "toc.heritage": "Di sản",
      "back.top": "↑ Về đầu trang",

      "history.eyebrow": "01 · Lịch sử",
      "history.title": "Một đất nước với bề dày nghìn năm",
      "history.p1": "Việt Nam mang dấu ấn của nền văn minh sông Hồng, các triều đại phong kiến, kháng chiến giữ nước và công cuộc đổi mới. Từ Văn Lang – Âu Lạc đến Đại Việt, lịch sử được kể bằng cả sử sách và di tích còn sống trong đời thường.",
      "history.p2": "Thế kỷ XX đánh dấu các bước ngoặt lớn: giành độc lập năm 1945, thống nhất đất nước năm 1975, và Đổi mới từ 1986 mở cửa hội nhập. Ngày nay, Việt Nam là điểm đến của giao lưu quốc tế — trong đó có quan hệ hữu nghị Việt–Hàn ngày càng sâu sắc.",
      "history.li1": "<strong>Biểu tượng</strong> — trống đồng Đông Sơn, Quốc tử giám, Hoàng thành Thăng Long",
      "history.li2": "<strong>Tinh thần</strong> — đoàn kết, hiếu học, gắn bó với làng xóm và gia đình",
      "history.li3": "<strong>Hiện đại</strong> — hội nhập kinh tế, du lịch và hợp tác quốc tế",
      "history.alt": "Đường mòn trên núi cao phía Bắc Việt Nam với trang phục dân tộc",

      "food.eyebrow": "02 · Ẩm thực",
      "food.title": "Bếp Việt — cân bằng và gần gũi",
      "food.p1": "Ẩm thực Việt chú trọng sự hài hòa: mặn – ngọt – chua – cay – umami, kèm rau sống và nước chấm. Mỗi vùng miền mang một “giọng” riêng — Bắc thanh đạm, Trung đậm đà, Nam ngọt dịu.",
      "food.pho.title": "Phở",
      "food.pho.text": "Nước dùng ninh xương, bánh phở mềm, ăn kèm rau thơm — món quốc hồn được yêu thích toàn cầu.",
      "food.street.title": "Bún chả / Bánh mì",
      "food.street.text": "Từ bún chả Hà Nội đến bánh mì giòn tan — ẩm thực đường phố đầy sức sống.",
      "food.coffee.title": "Cà phê sữa đá",
      "food.coffee.text": "Nhịp sống chậm ở quán cóc: đậm, ngọt, mát — đặc sản giao tiếp xã hội của người Việt.",
      "food.central.title": "Món miền Trung",
      "food.central.text": "Mì Quảng, bánh xèo, hải sản Đà Nẵng — hương vị đặc trưng của miền Trung Việt Nam.",
      "food.alt": "Tô phở Việt Nam trên bàn ăn tại Hà Nội",

      "festival.eyebrow": "03 · Lễ hội",
      "festival.title": "Nhịp vui của cộng đồng",
      "festival.p1": "Lễ hội Việt Nam gắn với nông lịch, tín ngưỡng và đoàn tụ. Tết Nguyên Đán là dịp lớn nhất trong năm: gói bánh chưng, chúc Tết, lì xì, và khởi đầu mới cho gia đình.",
      "festival.p2": "Ngoài Tết còn có Trung Thu với đèn ông sao, lễ hội đền chùa, và các lễ hội địa phương như đêm phố cổ Hội An — nơi văn hóa sống động giữa du khách và người bản địa.",
      "festival.li1": "<strong>Tết</strong> — đoàn tụ, hoa đào / hoa mai, mâm ngũ quả",
      "festival.li2": "<strong>Trung Thu</strong> — thiếu nhi, đèn lồng, bánh nướng bánh dẻo",
      "festival.li3": "<strong>Lễ hội địa phương</strong> — đền Hùng, chùa Hương, Hội An...",
      "festival.alt": "Hai người mặc trang phục truyền thống trước hàng đèn lồng Hội An",

      "costume.eyebrow": "04 · Trang phục",
      "costume.title": "Áo dài — nét thanh lịch Việt",
      "costume.p1": "Áo dài là biểu tượng trang phục Việt: dáng dài, tà mềm, tôn vẻ thanh lịch. Học sinh, sinh viên thường mặc áo dài trắng trong ngày lễ; áo dài màu được chọn cho cưới hỏi và biểu diễn.",
      "costume.p2": "Bên cạnh áo dài còn có áo tứ thân, khăn mỏ quạ của phụ nữ Bắc Bộ xưa, và trang phục dân tộc của 54 cộng đồng — mỗi sắc màu kể một câu chuyện vùng miền.",
      "costume.li1": "<strong>Áo dài</strong> — biểu tượng hiện đại và truyền thống",
      "costume.li2": "<strong>Nón lá</strong> — hình ảnh gắn với làng quê và nắng gió",
      "costume.li3": "<strong>Đa dạng dân tộc</strong> — thổ cẩm, trang sức, nghi lễ riêng",
      "costume.alt": "Hai người phụ nữ mặc áo dài truyền thống Việt Nam",

      "heritage.eyebrow": "05 · Di sản",
      "heritage.title": "Danh thắng và ký ức chung",
      "heritage.p1": "Việt Nam sở hữu nhiều di sản được UNESCO ghi danh: Vịnh Hạ Long, Phong Nha – Kẻ Bàng, phố cổ Hội An, thánh địa Mỹ Sơn, nhã nhạc cung đình Huế, và nhiều không gian văn hóa khác.",
      "heritage.p2": "Từ miền núi phía Bắc đến biển miền Trung và đồng bằng sông Cửu Long — mỗi vùng đất mang một lớp ký ức văn hóa riêng để bạn bè quốc tế khám phá.",
      "heritage.li1": "<strong>Thiên nhiên</strong> — vịnh, hang động, ruộng bậc thang",
      "heritage.li2": "<strong>Đô thị cổ</strong> — Hội An, Hà Nội phố cổ, Huế",
      "heritage.li3": "<strong>Miền Trung</strong> — Đà Nẵng, Mỹ Sơn, sông Thu Bồn",
      "heritage.alt": "Phố đường tàu Hà Nội với cờ Việt Nam và cây xanh",

      "closing.culture.title": "Hiểu văn hóa — để kết nối sâu hơn",
      "closing.culture.text": "Mỗi món ăn, lễ hội hay di sản là một lời chào. Cầu Nối Việt–Hàn mời bạn mang sự tò mò ấy vào hành trình giao lưu hai nước.",
      "closing.culture.intro": "Xem trang giới thiệu",

      "cultureKr.eyebrow": "Khám phá",
      "cultureKr.title": "Văn hóa Hàn Quốc",
      "cultureKr.lead": "Từ lịch sử bán đảo đến ẩm thực, lễ hội, hanbok và di sản — những nét văn hóa để bạn bè Việt Nam và mọi người cùng tìm hiểu.",
      "kr.history.eyebrow": "01 · Lịch sử",
      "kr.history.title": "Bán đảo với bề dày lịch sử",
      "kr.history.p1": "Lịch sử Hàn Quốc trải dài từ các vương quốc cổ Gojoseon, thời Tam Quốc (Goguryeo, Baekje, Silla), đến các triều đại Goryeo và Joseon. Chữ Hangul do vua Sejong sáng tạo vào thế kỷ XV là di sản tư tưởng và ngôn ngữ đặc biệt của dân tộc Hàn.",
      "kr.history.p2": "Thế kỷ XX mang những biến động lớn: kết thúc thuộc địa, chiến tranh Triều Tiên, rồi sự trỗi dậy của Đại Hàn Dân Quốc hiện đại. Ngày nay Seoul là trung tâm kinh tế — văn hóa toàn cầu, nơi truyền thống và đổi mới cùng tồn tại.",
      "kr.history.li1": "<strong>Biểu tượng</strong> — Hangul, cung điện Joseon, tinh thần “hongik ingan”",
      "kr.history.li2": "<strong>Tinh thần</strong> — hiếu học, kỷ luật, gắn bó cộng đồng",
      "kr.history.li3": "<strong>Hiện đại</strong> — công nghệ, giải trí toàn cầu, hội nhập quốc tế",
      "kr.history.alt": "Toà tháp Lotte World Tower và khung cảnh Seoul lúc hoàng hôn",
      "kr.food.eyebrow": "02 · Ẩm thực",
      "kr.food.title": "Bếp Hàn — đậm đà và sẻ chia",
      "kr.food.p1": "Ẩm thực Hàn Quốc nổi bật với vị lên men, cay vừa phải và bàn ăn nhiều món phụ (banchan). Kimchi, nước tương, tương ớt gochujang tạo nên “ngôn ngữ vị” đặc trưng của bán đảo.",
      "kr.food.bibimbap.title": "Bibimbap",
      "kr.food.bibimbap.text": "Cơm trộn rau, thịt và trứng — cân bằng màu sắc, dinh dưỡng và hương vị.",
      "kr.food.kimchi.title": "Kimchi",
      "kr.food.kimchi.text": "Món lên men biểu tượng, có mặt gần như mọi bữa ăn Hàn Quốc.",
      "kr.food.bbq.title": "Korean BBQ",
      "kr.food.bbq.text": "Thịt nướng tại bàn, ăn kèm rau và sốt — trải nghiệm xã hội ấm áp.",
      "kr.food.street.title": "Ẩm thực đường phố",
      "kr.food.street.text": "Tteokbokki, hotteok, kimbap — nhịp sống nhanh của phố Hàn.",
      "kr.food.alt": "Bàn ăn Hàn Quốc với bibimbap, kimchi và các món banchan",
      "kr.festival.eyebrow": "03 · Lễ hội",
      "kr.festival.title": "Nhịp vui của năm Hàn",
      "kr.festival.p1": "Seollal (Tết âm lịch) và Chuseok (Tết Trung thu) là hai kỳ lễ lớn nhất: đoàn tụ gia đình, mâm cỗ truyền thống, và nghi thức tưởng nhớ tổ tiên.",
      "kr.festival.p2": "Bên cạnh đó còn có lễ hội hoa anh đào, lễ hội đèn lồng, và nhịp sống văn hóa đô thị — từ concert K-pop đến các khu phố đêm đầy màu sắc ở Seoul.",
      "kr.festival.li1": "<strong>Seollal</strong> — Tết, sebæ, bánh gạo tteokguk",
      "kr.festival.li2": "<strong>Chuseok</strong> — đoàn tụ mùa thu, songpyeon, tạ ơn mùa màng",
      "kr.festival.li3": "<strong>Đời sống đô thị</strong> — lễ hội hiện đại, âm nhạc, phố đêm",
      "kr.festival.alt": "Phố đêm Seoul lung linh biển hiệu Hangul",
      "kr.costume.eyebrow": "04 · Trang phục",
      "kr.costume.title": "Hanbok — vẻ đẹp truyền thống Hàn",
      "kr.costume.p1": "Hanbok là trang phục truyền thống với đường nét mềm, màu sắc hài hòa. Ngày nay, người Hàn mặc hanbok vào ngày lễ, đám cưới, và khi tham quan cung điện — đồng thời phiên bản hiện đại xuất hiện trên sàn diễn và phố thị.",
      "kr.costume.p2": "Thời trang Hàn đương đại (K-fashion) cùng làn sóng Hallyu đã đưa phong cách Seoul ra thế giới, nhưng hanbok vẫn là biểu tượng gốc rễ của bản sắc văn hóa.",
      "kr.costume.li1": "<strong>Hanbok</strong> — jeogori, chima / baji, sắc màu ngũ hành",
      "kr.costume.li2": "<strong>Nghi lễ</strong> — Tết, cưới hỏi, thăm cung điện",
      "kr.costume.li3": "<strong>K-fashion</strong> — giao thoa truyền thống và street style",
      "kr.costume.alt": "Phố Seoul với biển hiệu Hangul — nơi truyền thống và hiện đại giao thoa",
      "kr.heritage.eyebrow": "05 · Di sản",
      "kr.heritage.title": "Cung điện, làng cổ và đô thị hiện đại",
      "kr.heritage.p1": "Hàn Quốc có nhiều di sản UNESCO: cung Changdeokgung, làng dân tộc Hahoe và Yangdong, đền Jongmyo, và các không gian văn hóa sống như pansori hay kimjang (làm kimchi cộng đồng).",
      "kr.heritage.p2": "Song song với di sản cổ là hình ảnh Seoul hiện đại — từ Bukchon hanok đến các biểu tượng kiến trúc mới — kể câu chuyện một quốc gia vừa giữ gốc, vừa hướng tương lai.",
      "kr.heritage.li1": "<strong>Cung điện</strong> — Gyeongbokgung, Changdeokgung, Deoksugung",
      "kr.heritage.li2": "<strong>Làng cổ</strong> — Hahoe, Bukchon, Jeonju Hanok",
      "kr.heritage.li3": "<strong>Thành phố</strong> — Seoul, Busan, Jeju",
      "kr.heritage.alt": "Đường chân trời Seoul với Lotte World Tower",
      "closing.cultureKr.title": "Hiểu Hàn Quốc — để kết nối sâu hơn",
      "closing.cultureKr.text": "Mỗi món ăn, lễ hội hay di sản là một lời chào. Cầu Nối Việt–Hàn mời bạn mang sự tò mò ấy vào hành trình giao lưu hai nước.",
    },

    ko: {
      "meta.title.home": "한·베 연결다리 — 문화교류",
      "meta.title.intro": "소개 — 한·베 연결다리",
      "meta.title.culture": "베트남 문화 — 한·베 연결다리",
      "meta.title.cultureKr": "한국 문화 — 한·베 연결다리",
      "meta.title.places": "베트남 명소 — 한·베 연결다리",
      "meta.title.placesKr": "한국 명소 — 한·베 연결다리",
      "brand": "한·베 연결다리",
      "nav.home": "홈",
      "nav.intro": "소개",
      "nav.culture": "베트남 문화",
      "nav.cultureKr": "한국 문화",
      "nav.places": "베트남 명소",
      "nav.placesKr": "한국 명소",
      "nav.facesort": "FaceSort",
      "nav.diplomacy": "외교",
      "nav.coop": "협력",
      "nav.exchange": "교류",
      "nav.main": "주요 메뉴",
      "nav.open": "메뉴 열기",
      "lang.label": "언어 선택",

      "home.kicker": "한·베 문화교류",
      "home.lead": "베트남과 한국을 잇는 문화교류 공간 — 외교의 역사부터 오늘의 협력까지.",
      "home.cta.intro": "소개 페이지 보기",
      "home.cta.culture": "베트남 문화",
      "home.cta.cultureKr": "한국 문화",
      "home.cta.places": "베트남 명소",
      "home.cta.placesKr": "한국 명소",
      "home.cta.facesort": "얼굴 인식",
      "home.hero.alt": "다낭 바나힐스의 골든브리지",

      "places.eyebrow": "여행 & 탐험",
      "places.title": "베트남 명소",
      "places.lead": "명소를 선택한 뒤, 출발 주소를 입력하면 Google Maps에서 길찾기를 볼 수 있습니다.",
      "places.form.label": "이 명소까지 길찾기",
      "places.form.origin": "출발 주소",
      "places.form.placeholder": "주소를 입력하세요 (예: 다낭 레주언 41)",
      "places.form.submit": "길찾기 보기",
      "places.form.note": "출발 주소를 입력하면 선택한 명소까지의 경로가 지도에 표시됩니다.",
      "places.map.open": "Google Maps에서 열기",
      "place.nav.hoian": "호이안",
      "place.nav.banahill": "골든브리지",
      "place.nav.hanoi": "하노이",
      "place.nav.sapa": "계단식 논",
      "place.nav.taxua": "따쑤아",
      "place.nav.hue": "후에",

      "placesKr.eyebrow": "여행 & 탐험",
      "placesKr.title": "한국 명소",
      "placesKr.lead": "명소를 선택한 뒤, 출발 주소를 입력하면 Google Maps에서 길찾기를 볼 수 있습니다.",
      "placesKr.form.placeholder": "주소를 입력하세요 (예: 인천공항, 서울)",
      "placeKr.nav.gyeongbok": "경복궁",
      "placeKr.nav.bukchon": "북촌",
      "placeKr.nav.nseoul": "N서울타워",
      "placeKr.nav.busan": "부산",
      "placeKr.nav.jeju": "제주",
      "placeKr.nav.gyeongju": "경주",

      "intro.eyebrow": "소개 페이지",
      "intro.title": "베트남 & 대한민국",
      "intro.lead": "양국의 외교 여정, 협력 분야, 그리고 국민 간 문화교류의 흐름을 소개합니다.",
      "intro.back": "← 홈으로",

      "diplomacy.eyebrow": "외교의 역사",
      "diplomacy.title": "우호에서 포괄적 전략 동반자 관계로",
      "diplomacy.lead": "1992년 12월 22일, 베트남과 한국은 공식 외교 관계를 수립했습니다. 30여 년이 지난 오늘, 양국 관계는 파트너십의 가장 높은 단계로 발전했습니다.",
      "diplomacy.t1.title": "수교",
      "diplomacy.t1.text": "대사관 개설, 공식 교류, 협력을 위한 법적 기반과 함께 새로운 장을 열었습니다.",
      "diplomacy.t2.title": "포괄적 동반자 관계",
      "diplomacy.t2.text": "관계가 격상되며 경제·투자·국민 교류가 확대되었습니다.",
      "diplomacy.t3.title": "전략적 협력 동반자 관계",
      "diplomacy.t3.text": "정치적 신뢰를 강화하고 핵심 분야에서 협력을 심화했습니다.",
      "diplomacy.t4.title": "포괄적 전략 동반자 관계",
      "diplomacy.t4.text": "수교 30주년을 맞아 최고 수준으로 격상 — 정치, 경제, 문화, 교육, 지역사회 연결을 넓혀 갑니다.",

      "coop.eyebrow": "협력의 축",
      "coop.title": "경제 · 문화 · 교육 · 사람",
      "coop.lead": "한·베 협력은 무역·투자에서 언어 교실, 거리의 문화 행사까지 점점 더 깊어지고 있습니다.",
      "coop.econ.title": "경제 & 투자",
      "coop.econ.text": "한국은 베트남의 주요 투자·무역 파트너이며, 한국 기업은 산업·전자·건설 분야에서 활발합니다.",
      "coop.culture.title": "문화 & 엔터테인먼트",
      "coop.culture.text": "한류(K-pop, 드라마, 음식)가 베트남에 널리 퍼졌고, 베트남 문화도 한국에서 점점 더 소개되고 있습니다.",
      "coop.edu.title": "교육 & 언어",
      "coop.edu.text": "유학, 학생 교환, 한국어·베트남어 교육이 젊은 세대의 상호 이해를 넓힙니다.",
      "coop.people.title": "지역사회 연결",
      "coop.people.text": "한국 거주 베트남인과 베트남 거주 한국인은 양국 관계를 잇는 살아있는 다리입니다.",

      "exchange.eyebrow": "문화교류",
      "exchange.title": "두 문화가 만날 때",
      "exchange.lead": "문화교류는 축제나 공연만이 아닙니다. 음식, 언어, 음악, 그리고 차이를 존중하는 일상의 경험입니다.",
      "exchange.t1.time": "음식",
      "exchange.t1.title": "함께하는 식탁",
      "exchange.t1.text": "김치와 퍼, 바비큐와 반미 — 음식은 두 민족을 가장 가깝게 잇는 언어입니다.",
      "exchange.t2.time": "예술",
      "exchange.t2.title": "음악 & 스크린",
      "exchange.t2.text": "K-드라마·K-pop과 베트남 영화·음악이 양방향으로 창의의 흐름을 만듭니다.",
      "exchange.t3.time": "청년",
      "exchange.t3.title": "연결의 세대",
      "exchange.t3.text": "학생, 봉사자, 교류 프로그램이 한·베 관계를 생생하게 만듭니다.",
      "exchange.quote": "“좋은 관계는 이해에서 시작되고, 이해는 서로의 이야기를 들을 때 시작됩니다.”",

      "closing.intro.title": "함께 배우고 · 함께 존중하고 · 함께 연결하다",
      "closing.intro.text": "한·베 연결다리는 우호의 역사와 두 나라 문화의 아름다움을 탐험하도록 초대합니다.",
      "closing.home": "홈으로",

      "footer.line": "<strong>한·베 연결다리</strong> — 베트남·한국 문화교류",
      "footer.meta": "Vietnam · Republic of Korea · Cultural Exchange",

      "culture.eyebrow": "탐험",
      "culture.title": "베트남 문화",
      "culture.lead": "역사의 흐름부터 음식, 축제, 유산까지 — 한국 친구들과 모두가 함께 알아가는 베트남의 모습입니다.",
      "toc.history": "역사",
      "toc.food": "음식",
      "toc.festival": "축제",
      "toc.costume": "의상",
      "toc.heritage": "유산",
      "back.top": "↑ 맨 위로",

      "history.eyebrow": "01 · 역사",
      "history.title": "천 년의 깊이를 지닌 나라",
      "history.p1": "베트남은 홍하 문명, 왕조 시대, 독립을 위한 투쟁, 그리고 개혁의 흔적을 품고 있습니다. 문랑·아우락에서 대월에 이르는 역사는 기록과 살아 있는 유적 속에 남아 있습니다.",
      "history.p2": "20세기는 큰 전환점이었습니다. 1945년 독립, 1975년 통일, 1986년 도이머이 개방. 오늘날 베트남은 국제 교류의 장이며, 한·베 우호 관계도 더욱 깊어지고 있습니다.",
      "history.li1": "<strong>상징</strong> — 동손 청동북, 국자감, 탕롱 황성",
      "history.li2": "<strong>정신</strong> — 단결, 배움, 마을과 가족에 대한 유대",
      "history.li3": "<strong>현대</strong> — 경제 통합, 관광, 국제 협력",
      "history.alt": "베트남 북부 고산 지역의 오솔길과 민족 의상",

      "food.eyebrow": "02 · 음식",
      "food.title": "베트남 주방 — 균형과 친근함",
      "food.p1": "베트남 음식은 짠맛·단맛·신맛·매운맛·감칠맛의 조화를 중시하며, 생채소와 소스와 함께합니다. 북부는 담백하고, 중부는 진하며, 남부는 달콤한 맛이 특징입니다.",
      "food.pho.title": "퍼(Phở)",
      "food.pho.text": "뼈를 고아 낸 육수와 부드러운 쌀국수, 향신 허브 — 세계가 사랑하는 국민 음식입니다.",
      "food.street.title": "분짜 / 반미",
      "food.street.text": "하노이 분짜부터 바삭한 반미까지 — 활기찬 길거리 음식 문화입니다.",
      "food.coffee.title": "카페스어다",
      "food.coffee.text": "작은 카페의 느린 리듬: 진하고 달콤하고 시원함 — 베트남식 사교의 상징입니다.",
      "food.central.title": "중부 요리",
      "food.central.text": "미꽝, 반세오, 다낭 해산물 — 베트남 중부를 대표하는 맛입니다.",
      "food.alt": "하노이에서 즐기는 베트남 쌀국수 퍼",

      "festival.eyebrow": "03 · 축제",
      "festival.title": "공동체의 즐거운 리듬",
      "festival.p1": "베트남 축제는 농경과 신앙, 가족 모임과 이어집니다. 가장 큰 명절은 テト(설)로, 반쯩을 만들고 세배를 하며 세뱃돈을 주고 새해를 엽니다.",
      "festival.p2": "추석에는 별등, 사원 축제, 그리고 호이안 옛거리의 밤처럼 지역 축제도 있습니다. 관광객과 현지인이 함께 문화를 누리는 공간입니다.",
      "festival.li1": "<strong>テト</strong> — 가족 모임, 복숭아꽃/매화, 오과 상차림",
      "festival.li2": "<strong>추석</strong> — 어린이, 등불, 월병",
      "festival.li3": "<strong>지역 축제</strong> — 흥왕 사당, 흐엉 사원, 호이안...",
      "festival.alt": "호이안 등불 앞에서 전통 의상을 입은 두 사람",

      "costume.eyebrow": "04 · 의상",
      "costume.title": "아오자이 — 베트남의 우아함",
      "costume.p1": "아오자이는 긴 자락과 부드러운 실루엣으로 우아함을 드러내는 베트남 대표 의상입니다. 학생들은 기념일에 흰 아오자이를, 결혼식과 공연에는 색색의 아오자이를 입습니다.",
      "costume.p2": "아오자이 외에도 북부 여성의 뜨턴(áo tứ thân), 모콰(khăn mỏ quạ), 그리고 54개 민족의 전통 의상이 있습니다. 각각의 색이 지역의 이야기를 전합니다.",
      "costume.li1": "<strong>아오자이</strong> — 전통과 현대의 상징",
      "costume.li2": "<strong>논라(모자)</strong> — 시골과 햇살의 이미지",
      "costume.li3": "<strong>민족의 다양성</strong> — 직물, 장신구, 고유 의례",
      "costume.alt": "전통 아오자이를 입은 두 여성",

      "heritage.eyebrow": "05 · 유산",
      "heritage.title": "명소와 공유된 기억",
      "heritage.p1": "베트남에는 유네스코가 인정한 유산이 많습니다. 하롱베이, 퐁냐케방, 호이안 옛거리, 미선 성지, 후에 궁중 아악 등입니다.",
      "heritage.p2": "북부 산지부터 중부 해변, 메콩 델타까지 — 각 지역은 국제 친구들이 발견할 고유한 문화 기억을 품고 있습니다.",
      "heritage.li1": "<strong>자연</strong> — 만, 동굴, 계단식 논",
      "heritage.li2": "<strong>고도시</strong> — 호이안, 하노이 옛거리, 후에",
      "heritage.li3": "<strong>중부</strong> — 다낭, 미선, 투본강",
      "heritage.alt": "베트남 국기와 녹음이 있는 하노이 기차길 거리",

      "closing.culture.title": "문화를 이해하며 더 깊이 연결되다",
      "closing.culture.text": "음식, 축제, 유산 하나하나가 인사입니다. 한·베 연결다리는 그 호기심을 양국 교류의 여정으로 초대합니다.",
      "closing.culture.intro": "소개 페이지 보기",

      "cultureKr.eyebrow": "탐험",
      "cultureKr.title": "한국 문화",
      "cultureKr.lead": "한반도의 역사부터 음식, 축제, 한복, 유산까지 — 베트남 친구들과 모두가 함께 알아가는 한국의 모습입니다.",
      "kr.history.eyebrow": "01 · 역사",
      "kr.history.title": "깊은 역사를 지닌 한반도",
      "kr.history.p1": "한국 역사는 고조선, 삼국 시대(고구려·백제·신라), 고려와 조선으로 이어집니다. 15세기 세종대왕이 창제한 한글은 한민족의 특별한 언어·사상 유산입니다.",
      "kr.history.p2": "20세기는 큰 격변의 시기였습니다. 식민 지배의 종식, 한국전쟁, 그리고 현대 대한민국의 성장. 오늘날 서울은 전통과 혁신이 공존하는 세계적 경제·문화 중심지입니다.",
      "kr.history.li1": "<strong>상징</strong> — 한글, 조선 궁궐, 홍익인간 정신",
      "kr.history.li2": "<strong>정신</strong> — 배움, 규율, 공동체 유대",
      "kr.history.li3": "<strong>현대</strong> — 기술, 글로벌 엔터테인먼트, 국제 통합",
      "kr.history.alt": "석양 아래 롯데월드타워와 서울의 풍경",
      "kr.food.eyebrow": "02 · 음식",
      "kr.food.title": "한식 — 깊고 나누는 맛",
      "kr.food.p1": "한식은 발효의 맛, 적당한 매운맛, 그리고 다양한 반찬이 특징입니다. 김치, 간장, 고추장이 한반도의 고유한 미각을 만듭니다.",
      "kr.food.bibimbap.title": "비빔밥",
      "kr.food.bibimbap.text": "채소, 고기, 계란을 섞은 밥 — 색과 영양, 맛의 균형입니다.",
      "kr.food.kimchi.title": "김치",
      "kr.food.kimchi.text": "거의 모든 식사에 함께하는 상징적 발효 음식입니다.",
      "kr.food.bbq.title": "한국식 BBQ",
      "kr.food.bbq.text": "테이블에서 굽는 고기와 채소·소스 — 따뜻한 사교의 경험입니다.",
      "kr.food.street.title": "길거리 음식",
      "kr.food.street.text": "떡볶이, 호떡, 김밥 — 한국 거리의 빠른 리듬입니다.",
      "kr.food.alt": "비빔밥과 김치, 반찬이 차려진 한식 상차림",
      "kr.festival.eyebrow": "03 · 축제",
      "kr.festival.title": "한국의 즐거운 한 해",
      "kr.festival.p1": "설날과 추석이 가장 큰 명절입니다. 가족 모임, 전통 음식, 조상을 기리는 예식이 이어집니다.",
      "kr.festival.p2": "벚꽃 축제, 연등 행사, 그리고 K-pop 공연부터 서울의 밤거리까지 — 도시의 문화 리듬도 함께합니다.",
      "kr.festival.li1": "<strong>설날</strong> — 세배, 떡국",
      "kr.festival.li2": "<strong>추석</strong> — 가을 가족 모임, 송편, 수확에 대한 감사",
      "kr.festival.li3": "<strong>도시 생활</strong> — 현대 축제, 음악, 밤거리",
      "kr.festival.alt": "한글 간판이 빛나는 서울의 밤거리",
      "kr.costume.eyebrow": "04 · 의상",
      "kr.costume.title": "한복 — 한국의 전통미",
      "kr.costume.p1": "한복은 부드러운 선과 조화로운 색을 지닌 전통 의상입니다. 명절, 결혼식, 궁궐 방문에 입고, 현대적 한복은 런웨이와 거리에서 다시 살아납니다.",
      "kr.costume.p2": "K-패션과 한류가 서울 스타일을 세계에 알렸지만, 한복은 여전히 문화 정체성의 뿌리입니다.",
      "kr.costume.li1": "<strong>한복</strong> — 저고리, 치마/바지, 오방색",
      "kr.costume.li2": "<strong>의례</strong> — 설·추석, 혼례, 궁궐 방문",
      "kr.costume.li3": "<strong>K-패션</strong> — 전통과 스트리트 스타일의 만남",
      "kr.costume.alt": "전통과 현대가 교차하는 서울의 거리",
      "kr.heritage.eyebrow": "05 · 유산",
      "kr.heritage.title": "궁궐, 고마을, 현대 도시",
      "kr.heritage.p1": "한국에는 창덕궁, 하회·양동 마을, 종묘 등 유네스코 유산과 판소리, 김장 같은 살아있는 문화유산이 있습니다.",
      "kr.heritage.p2": "북촌 한옥부터 새로운 건축 상징까지 — 현대 서울은 뿌리를 지키며 미래를 향하는 이야기를 들려줍니다.",
      "kr.heritage.li1": "<strong>궁궐</strong> — 경복궁, 창덕궁, 덕수궁",
      "kr.heritage.li2": "<strong>고마을</strong> — 하회, 북촌, 전주 한옥마을",
      "kr.heritage.li3": "<strong>도시</strong> — 서울, 부산, 제주",
      "kr.heritage.alt": "롯데월드타워가 있는 서울 스카이라인",
      "closing.cultureKr.title": "한국을 이해하며 더 깊이 연결되다",
      "closing.cultureKr.text": "음식, 축제, 유산 하나하나가 인사입니다. 한·베 연결다리는 그 호기심을 양국 교류의 여정으로 초대합니다.",
    },
  };

  const getLang = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ko" || saved === "vi") return saved;
    const legacy = localStorage.getItem("cau-noi-it-lang");
    return legacy === "ko" || legacy === "vi" ? legacy : "vi";
  };

  const applyLanguage = (lang) => {
    const pack = dict[lang] || dict.vi;
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || pack[key] == null) return;
      const ico = el.querySelector(".topic-ico");
      if (ico) {
        el.replaceChildren(ico, document.createTextNode(pack[key]));
      } else {
        el.textContent = pack[key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key || pack[key] == null) return;
      el.innerHTML = pack[key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key || pack[key] == null) return;
      el.setAttribute("aria-label", pack[key]);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (!key || pack[key] == null) return;
      el.setAttribute("alt", pack[key]);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key || pack[key] == null) return;
      el.setAttribute("placeholder", pack[key]);
    });

    const titleKey = document.body?.dataset?.titleKey;
    if (titleKey && pack[titleKey]) {
      document.title = pack[titleKey];
    }

    document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  };

  const initLangSwitch = () => {
    document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });
    applyLanguage(getLang());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLangSwitch);
  } else {
    initLangSwitch();
  }
})();
