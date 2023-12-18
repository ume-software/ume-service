import {
    BookingStatus,
    BalanceSettingType,
    BalanceType,
    Gender,
    LoginType,
    PaymentSystemPlatform,
    ProviderStatus,
    UnitCurrency,
    DepositRequestDataStringType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { bcryptService, utilService } from "@/services";
import { vietnamAddress } from "./data-seed/vietnamAddress";
import prisma from "../base.prisma";
import { balanceSettingRepository } from "@/repositories";
const userDefault = [
    {
        id: "9985b3de-3963-49a4-a6ac-aa5f273fd2b4",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1462729/16717899518529566.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/66f8b716-ee52-4590-aa0a-73bd28590f5f__e1cd3020-803b-11ed-a19f-23a3b10d190e__audio_voice.mp3",
        name: "Báo đời 🐮",
        description: `💜𝑩𝒂̂́𝒎 𝒕𝒉𝒖𝒆̂ đ𝒆̂̉ 𝒃𝒊𝒆̂́𝒕 𝒏𝒉𝒊𝒆̂̀𝒖 𝒉𝒐̛𝒏 𝒗𝒆̂̀ 𝒏𝒉𝒂𝒖 𝒏𝒉𝒆́ 💜

        Sản phẩm này không phải là thuốc nhưng có tác dụng làm ngiu anh 🙆
        
        🤷Mình tên Bối
        
        𝑶𝒏𝒍 𝑪𝒂𝒎( Mở cam sẽ tùy) + 𝑨𝒍𝒍 𝒈𝒂𝒎𝒆
        
        call video, mở cam 10.000.000vnđ/1h mess giá (KHÔNG 18+)
        
        Onl cam discord x10
        
        - 𝐍𝐀𝐑𝐀𝐊𝐀 ( Chơi vui vẻ, tay be bé)
        
        - 𝐓𝐅𝐓-LOL(rank nào cũng chơi tay vừa vừa ạ)
        
        - Xem phim và trò chuyện nghe nhạc ở Discord
        
        🌞🌞Mình có nhận các game chơi giải trí, sinh tồn, kinh dị, bla bla:
        
        - Party animal, Goose Goose Duck (zịt), Business Tour (cờ tỷ phú), Scrible it (vẽ), Agrou (ma sói), Among us.....
        
        (Mình có thể Down game trên Steam theo yêu cầu nếu được hướng dẫn chơi ạ)
        
        🎮Vui tính nhưng hơi ít nói
        
        🌸 Chơi game từ 11h đêm đổ đi thì thuê giúp tớ 70k/giờ (thuê 2h giúp tớ nhé). Chơi đêm hơi mất sức!
        
        Ước được bụt rent 24h ạ . xin cảm ơn :3`,
    },
    {
        id: "b5aa3ace-19da-4112-b41f-f93edb5b8a11",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/367563/16780986636345719.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/3482c1e2-5d2e-4499-8d5c-4819c30b6497__88944a10-cf01-11ed-a19f-23a3b10d190e__audio_voice.mp3",
        name: "Kanhdababiez",
        description: `🌸 Mic nhà không ồn ạ.

        🌸 Tớ nhận chơi game dzui dzẻ thui, không hard được ạ ^.^
        
        🌸 GAME : - Valorant ( Sea, NA ) rank bạc vàng
        
        - LOL ( biết chơi mỗi sp thôi ạ, hơi gà... )
        
        - PUBG PC ( Tớ bắn còn hơi yếu tay có gì mn bỏ qua nhen <3 )
        
        - Steam : Agrou, Among us, Brawhalla, Dead by daylight, Deceit, Dying light 1 + 2 , Fall guys, Pacify, Prop and Seek, Raft, .... Có thể tải game theo yêu cầu ^.^
        
        ❌ Không nhận ON CAM vì không có cam ạ :'D
        
        🌸 Thank you for reading this❤`,
    },
    {
        id: "4fe8aae9-9d63-4683-baad-d3590ced2598",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1974032/16848702165217550.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/852f7007-0d22-4a3a-9d7b-12fed963866f__ec2da9c0-e34b-11eb-9157-1d40c57aa487__audio_voice.mp3",
        name: "Hà Monn 💕👑",
        description: `Tên :Hà Monn

        🌸LOL (VN-đi ,Sp,Mid lane nào đi cũng tốt ( đơn dôi-flex- rank vàng)
        
        🌸 PUBG :, bắn tự lo đc cho bản thân, có khi để user lo :))
        
        🌸 Valorant : rank bạc gì mới tập chơi ( bắn được)😊
        
        🌸 Có thể chơi game theo yêu cầu, dạy là chơi
        
        🌸 Có thể chơi hard hay không hard vẫn đx chơi theo user :)))
        
        🌸 Không nhận call video
        
        Máy nhà mic không ồn ( cảm ơn mn đã ghé và đọc nha ) ủng hộ mình nhé <3`,
    },
    {
        id: "802eedc0-2c37-46cb-a857-d311a6251a13",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1605774/16747326300495711.jpeg",
        voiceUrl: null,
        name: "Chin ☘",
        description: `🍨 Hello mọi người , mình có vài lời giới thiệu về bản thân ❤️

        🍨 Mọi người hay gọi là : Nhú
        
        🍨 Ngày tháng năm : 20/06/199x
        
        🍨 Sống tại : TP.HCM ( giọng nói lai nam bắc )
        
        🍨 Mình chơi ở nhà , mic không ồn đâu nèe
        
        🍨 Nhận chơi game : LIÊN MINH HUYỀN THOẠI - PUBG PC - AUDITION - GTA V - CỜ TỶ PHÚ - PROP AND SEEK - CRAB GAME - THE FOREST -SONS OF THE FOREST - LEFT 4 DEAD 2 - RAFT - HAND SIMULATOR SURVIVAI - GOOSE GOOSE DUCK - MINECRAFT - IT TAKES TWO - FARM TOGETHER ( Có thể tải game theo yêu cầu , không biết sẽ học hỏi ạ )
        
        🍨 Em có nhận duo combo tuần/tháng ( có khuyến mãi / tặng thêm giờ )
        
        🍨 Liên Minh Huyền Thoại : One champ sp , cover AD đến chết =)) đi được lane MID , AD ( Nhận cày kỉ vật ) Thách đú Aram
        
        🍨 Nhận treo FC Online ( 15 > 30 trận )
        
        🍨 PUBG PC : Game này tớ đang tập chơi , tự lo cho bản thân được , lâu lâu cũng bị ngu , công láo =)))
        
        🍨 NHẬN : Call - nhắn tin - lắng nghe - mở nhạc - xem phim
        
        🍨 KHÔNG ON CAM - KHÔNG 18+ ( SCAM RÁNG CHỊU )
        
        🍨 KHÔNG NỢ - KHÔNG DUO TRƯỚC TRẢ SAU ( bị scam nhiều rồi mn thông cảm nhé :< )
        
        🍨 Không thích tâm linh , bạn im re tui cũng im ru luôn =))))
        
        🍨 Online từ : 09h00 sáng đến 04:00 đêm ( Nhận 2 giờ trở lên ) Qua 23h tối 70k/1h , thức đêm mệt nên mong user thông cảm ạ
        
        🍨 Đây là link của bạn mình , nếu bạn hông thuê mình , thì thuê bạn này , hoặc có thể thuê cả 2 chúng mình cho vui nhaaa : https://playerduo.net/maiimeoo98 ❤️
        
        🍨 𝐌ọ𝐢 𝐧𝐠ườ𝐢 𝐠𝐡é 𝐪𝐮𝐚 𝐜𝐡𝐨 𝐍𝐡ú 𝐱𝐢𝐧 𝟏 𝐟𝐥𝐨𝐰 𝐡𝐨ặ𝐜 𝐭𝐡𝐮ê ủ𝐧𝐠 𝐡ộ 𝐯à 𝐜ả𝐦 𝐧𝐡ậ𝐧 𝐧𝐡é ạ
        
        🍨 𝐂ả𝐦 ơ𝐧 𝐚𝐢 đó đ𝐚𝐧𝐠 đọ𝐜 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐜ủ𝐚 𝐦ì𝐧𝐡 , 𝐜𝐡ú𝐜 𝐛ạ𝐧 𝐜ó 𝟏 𝐧𝐠à𝐲 𝐯𝐮𝐢 𝐯ẻ 𝐯à 𝐛ì𝐧𝐡 𝐲ê𝐧 ❤️
        
        🌽🍞🍖🍻🍔🍡🍚🍣🍜🥗🍥🍰🍩🍺🍷🥙🌮🍹🍿🍬🍠🍮🥞🍛🍱🍲🍝🥃🍶🍵☕🧀🥛`,
    },
    {
        id: "1c5dafeb-13b0-4c5a-80ba-ea40b2a460ba",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/157645/16848332689635966.jpeg",
        voiceUrl: null,
        name: "🌸 M E O W 🌸",
        description: `🍓Hellooooo mọi người mình là newbie tên hay gọi là M E O W

        🍓Giọng miền Trung
        
        🍓Mình nhận chơi game PUBG(MB ) LIÊN QUÂN, LOL ( bạn dám chỉ thì mình dám chơi ) Chơi vịt nữa ạ 🤣
        
        🍓 Sẵn sàng tâm sự buồn vui với user ngày đêmmm
        
        🍓Chơi game khong hay nhưng hứa vui vẻ + nhiệt tình
        
        🍓Sau 12h 🥹 e xin thêm 15k phụ phí ạ❤️
        
        🍓 Oncam x5
        
        🍓 Em có nhận nhậu onl cháy hết mình với user ( 100% zoo)
        
        🍓 KHÔNG NHẬN NCH 18+ đọc kĩ bio giúp em <3
        
        🍓 Mong sẽ được mọi người ủng hộ. Xia xìaaaaaa`,
    },
    {
        id: "3c61af82-187f-449f-9b23-8bca5f2186a2",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1684413/16786883962963700.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/e4ccaedd-f9f2-4148-be15-b5309460be28__43531090-1b68-11ee-a657-a54d6be1d46a__audio_voice.mp3",
        name: "Baka Hime 👀",
        description: `💕𝑯𝒆𝒍𝒍𝒐,

        Có thể gọi tui là Bơ nhaaa !!
        
        💕 Nhận game
        
        (❁.◡.❁) Từ 12h đêm tớ xin để 80k /1h ạ . vì làm đêm thực sự rất là mệt ạ :< mong User thông cảm cho tớ nhenn (┬┬﹏┬┬)
        
        💕 Normal , rank, aram, chế độ luân phiên , ai chỉ tui chơi chess tui cũng nhận (●’◡’●)
        
        💕 Chuyên đi AD , có thể sp và mid
        
        💕 cần được lắng nghe và chia sẻ 'OwO'
        
        💕 Vui vẻ , nhiệt tình, thân thiện, hay cười=))
        
        💕 Rất vui nếu được chơi cùng bạn , nếu bạn cần tryhard có tryhard , cần tấu hài có tấu hài nhaa!!!
        
        ⛔ Không thuê nợ , thuê = chơi , không chơi trước trả sau
        
        ⛔ không ib nói chuyện 18+
        
        ⛔ Không nhận call video!
        
        ……………………
        
        💕 Nhận hỗ trợ trên phương diện học tập như các môn toán, lý , hóa , văn , ….. nếu như bài là bài khó khó siêu khó tui vẫn sẽ cố gắng nếu trong khả năng 🤣`,
    },
    {
        id: "848f0816-b39a-4b0d-a3a2-cea5d83e21ba",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/376803/16859521050006272.jpeg?",
        voiceUrl: null,
        name: "Linh SoNa",
        description: `💕Linh SoNa tuổi 18 ^^

        💕 Mình cao gần 1m6 cụ thể là 1m48 >.<
        
        💕 Quê ở Hà Nam ( gái Hà Nam dịu dàng lắm )
        
        💕 Nhận chơi LOL - CHESS ( NA ) ( Chưa ngán ai bao giờ )
        
        💕 PUBG PC - Valorant ( có cho đủ người )
        
        💕 PUBG mb - liên quân - tốc chiến có nhận tải game mb theo yêu cầu ^^
        
        💕 Call video - onl cam discord tâm sự mỏng đời tư ( 500k ) hỏi call 18 là block thẳng tay !
        
        💕 Bé Nhận nhậu online chấp mọi kèo hehe
        
        💕 Nói chuyện - xem phim - nghe nhạc nhẹ nhàng hiểu chuyện ^^
        
        💕 Tuy không xinh nhưng được cái nhà nghèo😜😜😜😜 =))))
        
        💕 Ngoan Ngoãn -Dễ Gần - Chiều user ❤❤❤
        
        💕 Mình không nhận duo của streamer ạ !
        
        💕Không Biết Hát - Yêu Tất Cả Mọi Người <3 :*`,
    },
    {
        id: "dd43d7d8-87e0-4699-b829-89b6f5e2863b",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1462729/16700667856147708.jpeg",
        voiceUrl: null,
        name: null,
        description: `Cốc cốc cốc!!!

        👑XIN CHÀO TẤT CẢ MỌI NGƯỜI !!!
        
        💬 Gọi mình Là Mèo 3K hoặc Vân Anh nhé!
        
        💬 Game mình không giỏi, mình biết điều và giỏi nói chuyện ^^.
        
        💬 Mình là người miền Nam nhưng nói được luôn giọng Bắc và Nam
        
        💬 Game:
        
        - Liên Minh: chơi ở mức rank bạc rách đi lane linh hoạt trừ rừng
        
        -TFT(chess): sever Việt và NA, chắc cũng đang vàng bạc đá quý gì đó á
        
        - Cờ tỷ phú: hên lắm nhưng mà là hên xui lắm =))
        
        - Naraka: à thì ít khi nhận lắm tại bỏ game lâu òi :((
        
        - Dota 2: hmmmmm chơi cho có tụ hoi chứ biết j đâu =)))
        
        - Pubg giả lập: vẫn như trên nhưng nhiều đóng ngoặc hơn =))))))))))))))
        
        - Gta: hổng ai dẫn đi đâu hết nên cũng ít chơi game này lắm
        
        - Liên quân: tui cầm con lauriel đi đâu cũng được á tại rank kc mà =D
        
        💬 Oncam:
        
        - Discord x4 (cần khoảng 15p để chỉnh chu hơn)
        
        ⚠️ chơi mọi loại game nếu bạn thích (à không ý tui là cả tui và bạn á >A<)
        
        ⚠️ Nếu không thấy mình trả lời thì phiền mn một chút nhắn tin vào link face mình để ở dưới nha :(( đôi khi mình treo máy nhưng nó ko reo chuông ấy, thông cảm giúp mình nha <3`,
    },
    {
        id: "2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1973809/16862433098586045.jpeg",
        voiceUrl: null,
        name: null,
        description: `- lol chess nhân phẩm khá tốt

        -liên minh cũng tàm tạm vui vẻ thì uki hihi
        
        -Gta5 giải trí tấu hài
        
        -Có thể hát rap =]] à rap love nhannnn
        
        -Oncam x5 (không 18+)
        
        -mở nhạc, xem phim, tâm sự,...
        
        -biết lắng nghe và thấu hiểu
        
        nói nhiều,hay bắt chuyện, nếu user ko thích nói nhiều có thể yêu cầu mình im mồm chẳng hạn ahihi
        
        -Thử mới biết ko thử sao biết ^^
        
        Thích thì thuê hông thích thì thuê !!! love <3000`,
    },
    {
        id: "eb8728a0-aaeb-4190-b475-519728e532ca",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1684413/1673325015493547.jpeg",
        voiceUrl: null,
        name: "Gạo 🍀",
        description: `Giao diện bad girl nhưng tâm hồn ngây thơ :))

        ❥ Mình là newbie nên có gì sai sót mong mọi người thông cảm hoặc góp ý nhẹ nhàng nhé .
        
        ❥ Mình giọng miền Nam, cái nết loi choi, nói nhiều trừ những lúc chơi ngu quá bị trầm cẻm .
        
        ❥ MÌNH CHỈ NHẬN :
        
        ❥ LOL : chán liên minh rùi nên chỉ nhận Aram với TFT ạ.
        
        ❥ VALORANT : rank gì cũng triển.
        
        ❥ TFT : chúa tể lót đường.
        
        ❥ Naraka : newbie..
        
        ❥ Onlcam x4
        
        ❥ Sau 12h đêm mình không có nhận ạ .
        
        ❥ MÌNH KHÔNG NHẬN : chat sex, 18+, hát , không rent nợ .`,
    },
    {
        id: "a47aeac8-a730-4f42-a1aa-c072d1e96ab7",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/376803/16833767097816821.jpeg",
        voiceUrl: null,
        name: "❤Yến Munn❤️ 🫶🏻",
        description: `Hiiii 🌻 Mình là Yến nè

        ❌ KHÔNG NHẬN BẤT CỨ GÌ 18+ 🔞
        
        ❌ KHÔNG ONCAM SEXY, 18+ 🔞
        
        ✅ Sau 22h mình xin phép chỉ nhận duo trên 2h hoy ạ
        
        ✅ Mình nhận chơi
        
        - Liên Minh Huyền Thoại (mid,sup)
        
        - TFT
        
        - Liên Quân Mobile ( mid, sup )
        
        ✅ Mình có thể học chơi các thể loại game khác nếu được hướng dẫn 🥰
        
        ✅ Nhận xem phim và tâm sự cùng user`,
    },
    {
        id: "6d1f0910-f53a-4784-969c-69cdefef61e9",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1227048/16605565132718799.jpeg",
        voiceUrl: null,
        name: "HimeChan",
        description: `Player mới của app nên mong các a bụt giúp đỡ ạ❤️

        ✏️ Nhận pubg
        
        ✏️ Nhận ĐTCL
        
        ✏️ Nhận Liên quân
        
        ✏️ Nhận Call of duty
        
        ✏️ Nhận tán gẫu, call, xem phim
        
        ✏️Nhận chơi game vô tri như play TOGETHER, ma sói,amongus, hago,weplay…..
        
        📌Có thể chơi tất cả các game MOBILE theo yêu cầu của boss , nếu được boss chỉ dẫn…
        
        ❌ KHÔNG NHẬN CALL 18+ , CALL BODY HAY NÓI CHUYỆN VỚI CHỦ ĐỀ KHÔNG PHÙ HỢP
        
        Mong sẽ được mọi người ủng hộ , còn gì thiếu sót các boss cứ góp ý để có trải nghiệm vui vẻ cùng nhau nha❤️
        
        👉Vì app lâu lâu hơi lỗi nên khi nhắn tin trên app không hiện thông báo em không thể rep liền được , các boss thông cảm và có thể liên hệ qua fb em ạ`,
    },
    {
        id: "ac124683-8268-49fa-83bf-5180ab3ce980",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1011755/16697279953677315.jpeg",
        voiceUrl: null,
        name: "✨ Gấu 🐼 ✨",
        description: `Gấu.

        Mình chơi được hầu hết các game nhá
        
        💘 Liên minh Huyền thoại ( Nor, chess, rank ... đánh ổn, call team tốt)
        
        💘 PUBG PC ( Bắn gà, làm y tá thôi nhưng được cái hay ăn gà ké hihi)
        
        💘 PUBG Moblie ( con bot cuteee biết giết người...)
        
        💋 Liên quân Mobile
        
        💋 Tốc chiến cũng okk
        
        💋 Valorant ( Không rank, chơi vui vẻ thôi á)
        
        💋 Prop and seek, deceit, Sucribble It, Business Tour...
        
        💋 Mình nhận tải game theo ý use ...
        
        💎 Máy nhà mic không ồn nè.
        
        💎 Mình k nhận chơi nợ nha`,
    },
    {
        id: "816c1899-c65e-4819-86d0-a3357173848d",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1962700/16850082812127061.jpeg",
        voiceUrl: null,
        name: "Vịt Mủ",
        description: `Mình tên Lan Anh hoặc bạn có thể gọi là Shingu cũng được, giọng Nam ạ.

        ✦ 𝗩𝗔𝗟𝗢𝗥𝗔𝗡𝗧: Trình bạc vàng thui ạ
        
        ✦ 𝗟𝗢𝗟: Mình đi được mid/adc/sp, mình không nhận đơn đôi nhé
        
        ✦ 𝗔𝗥𝗔𝗠: Thách đú ARAM hên xui có thể gánh được user
        
        ✦ 𝗧𝗙𝗧: Chơi ngu lót top 8 =))
        
        ✦ 𝗦𝗧𝗘𝗔𝗠: Raft, DST, Vịt, Apex, Naraka, Phasmophobia, ...
        
        ✦ Nhận on cam giá x3, sau 21h thứ 2/4/6 hehe`,
    },
    {
        id: "82cfafb0-ea31-45dc-8639-63a673569436",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/655708/16726452431573402.jpeg",
        voiceUrl: null,
        name: "Lulii cute siêu cấp zũ trụ",
        description: `MUỐN CHƠI GAME VUI VẺ MÀ VẪN WIN Ạ??? TÌM ĐÚNG NƠI RỒI MẤY CẬU ƠI :3

        - ON CAM DISCORD GIÁ X3
        
        - QUA 12H x2 GIÁ (Vui lòng THANH TOÁN tiền thuê trc, nhận được tiền em vào trong tích tắc, vì đã bị Scam nên mọi ng thông cảm nhé)
        
        *KHÔNG NHẬN VIDEO CALL*
        
        - NHẬN AUDIO CALL TÂM SỰ VÀ TƯ VẤN TÌNH CẢM
        
        Mình vui vẻ thân thiện, có trách nhiệm nên mọi người cứ thuê và cảm nhận nha, sẽ không thất vọng đâu nè :3. Hong cần nói nhìu, hí :3.`,
    },
    {
        id: "7091f5cb-2b63-4aa6-a3c8-17cf8763258f",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1940378/16987011149783694.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/d9918033-153e-4386-89fc-9f56c066b60d__7c154860-d340-11ec-a334-4d8c20a0c7ee__audio_voice.mp3",
        name: "Mẫn Mẫn",
        description: `Hiii, mình là Mẫn Mẫn, giọng Sài Gòn

        LOL, TFT ALL SEVER : mình đi được all lane .
        
        Valorant : for fun thôi nhé mình bắn thì thôi luôn !
        
        Game trên STEAM : goose goose duck, deceit, don't starve together, vài game sinh tồn khác. Mình có thể tải game, mình cảm game khá ok :3
        
        Xem phim mình có nf , mình có bật nhạc lun nhoéee.
        
        https://www.facebook.com/Morderbui , love u cám ơn vì đã bỏ thời gian đọc :3
        
        Sau 12h thuê 2h trở lên giúp mình nhéee, 80k 1h nhooo
        
        Xem phim, nghe nhạc, chơi gemmm !!!
        
        Không nhận onl cam !!!`,
    },
    {
        id: "373f7281-4a4d-4b4e-a60b-771e089800d0",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1948854/1684047373300316.jpeg",
        name: "Pun Thuỷ ♥",
        description: `☔ Tên mình là Pun Thuỷ, sinh sống ở Sài Gòn ( ੭•͈ω•͈)੭

        Mình hiếm khi onl playerduo nên ít đánh giá ạ, chỉ nhận nói chuyện qua discord.
        
        👾 Chủ yếu chơi game co-op trên Steam: Goose Goose Duck, Among Us, Left 4 Dead 2, Business Tour, Party Animals, Pummel Party, Don’t Starve Together, Dead by Daylight, Minecraft, Roblox,...
        
        ❅ LOL: sp, aram hoặc unranked 4fun không try hard
        
        ❆ TFT: chiến thần lót đường cho bạn top 1
        
        ❅ VALORANT: team deathmatch hoặc unrated 4fun
        
        ❆ Tốc chiến: support zui zẻ, buff máu bạn đến khi nào mỏi tay thì thôi (๑˃ᴗ˂)ﻭ
        
        𖤐 Nhận mở phim, bật nhạc, xem anime, manga, netflix.
        
        XEM TAROT KHÔNG CHUYÊN NHƯNG ĐẢM BẢO CÓ TÂM (giá tùy tâm ≥ 1h duo là được nhé).
        
        Không có soundcard nhưng hát được 3 thứ tiếng Việt Anh Nhật (tùy hứng)
        
        🍒 Tư vấn anime, manga, thời trang, âm nhạc, du học, làm bài tập Tiếng Anh (deal)
        
        ❣❣ Tâm sự: quan trọng là sự tin tưởng <꒰˵•ω •˵꒱ｂ
        
        ※ Không 18+ plz, kinh dị máu me thì được (｢✧ω✧)｢`,
    },
    {
        id: "42ce1830-14a3-48f7-8f08-e86a6a15c14e",
        avatarUrl:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",

        name: "Shinn Shinn",
        description: `MIỄN BẠN VUI LÀ MÌNH VUI.

        Thông tin
        
        Tớ đang sống ở ĐẮK LẮK
        
        . Máy nhà mic không ồn ❤
        
        . Mình giọng bắc hoặc giọng nam tùy bạn cảm nhận
        
        . Mình chơi pubg pc,
        
        . LIÊN QUÂN
        
        . VALORAN
        
        . SONS OF THE FOREST….
        
        . CHƠI CỜ TỶ PHÚ đẳng cấp vĩ mô không thể mô tả bằng lời
        
        ❌ Mình không nhận call video
        
        ❌ Mình cũng hông nhận hát vì có biết hát đâu mà
        
        ❌ MÌNH KHÔNG NHẬN CALL VIDEO SEXY HAY 18+
        
        QUA 12H ĐÊM EM NHẬN DUO 70K , TRÊN 2 TIẾNG NHÉ HIHI , MÃI IUU
        
        CẢM ƠN VÌ ĐÃ ĐỌC, CHÚC BẠN 1 NGÀY VUI VẺ.`,
    },
    {
        id: "365d2fbc-662d-483e-a3bc-d82f6241fe78",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1948854/16872779154687276.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/b11cb3bb-be54-46b8-90b5-309ba4d01d23__a9b7d7d0-f9fe-11ec-92ac-1b8d2f5bc2b5__audio_voice.mp3",
        name: "💕Bơ nèee 💕",
        description: `Có thể gọi tắt là "Bơ nèee" ✌

        Bé nhận những thứ sau ạ:
        
        Nhận trade rút tiền và nạp
        
        📹 ON CAM: (Onl cam là 250k/1h, sau 12h bé nhận 300k/h. Không 18+, không sexy ạ.)
        
        🐧 TFT: - VN (Rank cao nhất từng chơi là cao thủ ạ, còn mùa này hiện đang bạch kim ạ) - NA k có nick cho mượn thì e vẫn nhận chơi ạ
        
        @ LIÊN QUÂN: (Rank cao nhất là chiến tướng ạ, mùa này thì đang ct :v vì lười leo rank quá nên ai muốn leo rank chung thì rent bé nha)
        
        @ ARAM: (Cái này hơi gà ạ)
        
        CỜ TỈ PHÚ : Nhân phẩm xxx
        
        Chơi được các game trên steam: Pummal party, among us, Scribble It, over cooked, it take two, prop and seek, human fall flat, devour...
        
        Có thể rent theo hình thức donate. Donate trước không nhận chơi trước trả sau.
        
        Gốc ở Hạ Long và hiện tại ở Hà Nội
        
        Cao 1m66 nặng 46kg
        
        Chơi thì bình thường nhưng được cái gáy tốt ạ!!!`,
    },
    {
        id: "c676d677-9cd1-4079-a944-26b46f9ebc96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1992068/1687268874434137.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/05a9716a-d354-4818-aefa-47093bfe1cc5__fd766ec0-7530-11ec-911d-399f024e5d9b__audio_voice.mp3",
        name: "Bé Tis",
        description: `Bé Tis from Sai Gon 🎸

        •LOL champ Jinx 1 triệu thông thạo, mình đi all lane, đánh nor,aram,rank,flex,tft đều ok
        
        •FO4 barca full +5 nhóe
        
        •Valorant chỉ bắn 4fun không hard
        
        ⭐️ Sau 12h mình nhận duo 70k/1h ⭐️
        
        Inb cho mình qua fb, ins hoặc cứ bấm rent thẳng nếu mình không rep playduo nhé thank u <3
        
        Mình chơi eguitar với bass (mình chơi funk và rock indie ae nào có chơi nhạc thì jam cùng mình ha)
        
        I will say sweet thing to u
        
        Rent n feel 🦋`,
    },
    {
        id: "228f379c-2dfe-4c80-8e1b-98e0fa6f6324",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/267432/16786204537404882.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/30468c40-e677-4600-a1cc-a7319781e0db__343e98b0-e2ce-11eb-b986-5b405e6f2788__audio_voice.mp3",
        name: "Chaos",
        description: `-Em tên: Chaos (miền Nam)

        -Game: PUBG PC (8000h). Rank (Bk-Vàng)
        
        +Truykich Pc: tạm ổn hong có ngu lắm🥹
        
        +CSGO: cằm súng và biết bắn
        
        +Valorant: mới tập chơiii
        
        - Em còn nhận nghe nhạc,mở nhạc, stream game or netflix và chơi các game giải trí( cờ tỉ phú,game ma, amongus,...)
        
        -Combo đêm 00h-7h sáng 400k ( khách nghỉ trước em không back lại số tiền ạ)
        
        -ig: SNE_VyChopper
        
        -Tự lo được bản thân😶. Tấu hài or tryhard đều được zui zẻ là chính:D
        
        -Con người em chơi game ko biết cọc là gì =))) zui zẻ hong quạoo :>>>>
        
        -Em nhận những lúc e rep mn🥹🥹🥹🥹
        
        - Em có máy nhà nên không ồn.
        
        -Đêm thuê giúp em trên 2 giờ nheee:3
        
        -Cảm ơn mn đã đọc. Mong rằng được mọi người ủng hộ em🥰`,
    },
    {
        id: "4211702b-5387-4c06-a019-b785a8f0be49",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1462729/16700667856147708.jpeg",
        description: `KHÔNG NHẬN SEXY KHÔNG NHẬN 18+

            KHÔNG NHẬN SEXY KHÔNG NHẬN 18+
            
            KHÔNG NHẬN SEXY KHÔNG NHẬN 18+
            
            ( cái gì quan trọng lặp lại 3 lần)
            
            Chào các bạn, biệt danh của mình là Tiu
            
            - Mic nhà không ồn ạ
            
            - Mình giọng miền Tây áa
            
            - Mình nhận TFT (rank vàng ạ), LOL(aram,nor) ( mình mới chơi nên chơi vui hoy nhaa)
            
            - Naraka ( rank 2k5
            
            - goose goose duck ( mình mới chơi chưa rành role)
            
            - Mình có thể tải game theo yêu cầu của user ạ
            
            - Mình nhận onl cam mes X4 ạ (không sexy không 18 không cosplay khỏi hỏi ạ)
            
            - Mình có thể chơi các game mb cùng các bạn 💋( LQ,PUBG mb,Zing speed MB)
            
            - Tính mình hoà đồng , cực kì dễ gần ạ
            
            -Nói chuyện, tâm sự, mở nhạc, mở phim ( có tk netflix ạ), tư vấn tình cảm cùng các bạn
            
            - Mình không nhận 18+`,
    },
    {
        id: "9fdba5fc-fb7b-4717-8b08-1214367e2899",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1925126/16858913098309040.jpeg",
        name: "Cún ❤",
        description: `Tên: Cún (Vui vẻ, dễ gần, dễ nghiện)

            Livestream 19h mỗi tối tại: https://www.tiktok.com/@cuncun812
            
            join discord: https://discord.gg/cominhhieuxinhh
            
            -Em nhận chơi:
            
            *TFT ( có thể coaching cho user nếu cần )
            
            * NARAKA siu gà nhưng zuiii
            
            * liên quân ( mụt con gà mờ hay gáy)
            
            * Câu cá ( play together)
            
            *Liên minh ( all lane )
            
            *Among us
            
            *Chơi cờ tỉ phú
            
            *Scribble it
            
            *Tâm sự mọi chuyện trên đời trừ 18+ ( call, discord, chat)
            
            *ON CAM (*4)
            
            * nhận mở nhạc + mở phim( neflix),....
            
            ( nói được giọng miền Bắc, Trung, Nam )
            
            Rent or donate xong chơi chứ đừng nợ, em ngại đòi lúm lúm :(`,
    },
    {
        id: "2a5745c1-a230-4ac8-a6ed-683f1f151899",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1121715/1668255749464521.jpeg",
        name: "$ℂ𝕚ℂ𝕚❤️",
        description: `MIỄN BẠN VUI LÀ MÌNH VUI.

            👀Thông tin
            
            👻 Máy nhà mic không ồn ❤ Sau 12h đêm thì mình nhận 2h trở lên.
            
            👻 Mình giọng bắc hoặc giọng nam tùy bạn cảm nhận
            
            👻 GAME mình chơi
            
            👻 NARAKA
            
            👻 GUNFIRE REBORN
            
            👻 HUMAN FALL FLAT
            
            👻 LOL, TFT
            
            👻 GOOSE GOOSE DUCK
            
            👻 SONS OF THE FOREST….
            
            👻 LOL chơi gà lắm đánh FLEX vui vẻ không nhận đánh rank không toxi (vì chơi ngu lên vui thì nhận )
            
            👻 PUBG PC 4000h bắn ok tấu hài là chính top 1 là 10
            
            👻 TFT
            
            👻 CHƠI CỜ TỶ PHÚ đẳng cấp vĩ mô không thể mô tả bằng lời
            
            👻 Nhận tâm sự vui vẻ, xem phim ( có NETFLIX ) nói chuyện, bên bạn.
            
            ❌ Mình không nhận call video đừng hỏi tại sao, đơn giả vì hông thích thế thôi
            
            ❌ Mình cũng hông nhận hát vì có biết hát đâu mà nhận lên đừng hỏi mất công
            
            ❌ MÌNH KHÔNG NHẬN DUO CỦA CÁC BẠN ĐANG STREAM
            
            ❌ MÌNH KHÔNG NHẬN CALL VIDEO SEXY HAY 18+ LÀM ƠN ĐỪNG HỎI MÌNH NỮA
            
            => NẾU THẤY LÂU QUÁ KHÔNG CHẤP NHẬN THÌ PM FB, ĐỪNG HỦY TỘI MÌNH !
            
            CẢM ƠN VÌ ĐÃ ĐỌC, CHÚC BẠN 1 NGÀY VUI VẺ.`,
    },
    {
        id: "2e9f3fc0-9f7a-4c26-8021-7d7d38679b02",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/984537/16826079776944261.jpeg",
        name: "Ume Ume",
        description: `Một chiếc player giọng miền Nam chỉ chơi Liên Minh Huyền Thoại.

        Bạn muốn một MID LANER ổn áp hay một SP thích ks ô tô của ADC ạ?!
        
        Ngoài chơi game mình còn nhận vẽ tranh chibi đơn giản, giá chỉ bằng một giờ thuê thui ạ :3
        
        Mình không nhận các vấn đề 18+
        
        Vui lòng không thuê nợ và thanh toán trước khi vào việc ạ.
        
        Cảm ơn bạn User dễ thương đã ghé qua bio của mình nè :3 :3 :3`,
    },
    {
        id: "02056642-6166-40a3-9563-8a960e6ff45d",
        avatarUrl:
            "https://global-oss.epal.gg/image/ablum/16423074615829127.jpg",
        name: "!? Thỏ 🐰🎀",
        description: `⚠️ Giọng Hà Nội, lưu ý vì giọng mình không dễ thương đâu =)))

            🌸 On cam 250k/h khi nào vui và xinh thì nhận 😘
            
            _____________________________
            
            🎮 Game mình chơi
            
            ☁️ LOL TFT (VN - NA ping ổn, biết chơi game)
            
            ☁️ Pubg PC (chỉ nhận 1 tiếng do buồn nôn)
            
            ☁️ Valorant
            
            ☁️ Csgo 2
            
            ☁️ Overwatch 2
            
            ☁️ Pubg Mobile
            
            ☁️ Goose Goose Duck
            
            ☁️ Party Animals (cười 24/24) =))
            
            _____________________________
            
            🌷 𝑵𝒉𝒐̛́ 𝒅𝒆̂̉ 𝒍𝒂̣𝒊 𝒅𝒂́𝒏𝒉 𝒈𝒊𝒂́ 𝒄𝒉𝒐 𝒃𝒆́ 😋
            
            💤 More About Me On Tiktok 📥`,
    },
    {
        id: "f653228d-3967-4707-9d2e-1f7d4e76187c",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1044455/16819834871407986.jpeg",
        name: "Raven the Bunny",
        description: `🎀 Chào cậu mình là Bunnyy!

            Không có gì tuyệt vời hơn việc chúng ta tự tìm hiểu nhau cả, nhận làm ny part-time kèm thêm việc chơi game thâu đêm tới sáng cùng cậu! ❤️
            
            🎮 Tớ hay chơi nhất là game Valorant - nhận chơi vui vẻ hoặc tryhard cùng user, ngoài ra tớ có chơi Tốc Chiến và đang tập chơi Liên Minh nên chỉ nhận chơi vui vẻ thui nhaaa
            
            🎁 Nhận tâm sự vấn đề tình cảm, mở phim, mở nhạc, treo dis cùng cậuuuu
            
            🧸 Nhận onlcam giá cả thương lượng, onlcam ở insta ạ
            
            🌺 Thuê đêm sau 22h00 chỉ nhận 2 tiếng trở lên
            
            📛 KHÔNG nhận liên quan 18+ hay sexy và KHÔNG gạ gẫm dưới mọi hình thức 📛`,
    },
    {
        id: "fa179e09-dc4d-4204-93d2-1339ed68007b",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/2014655/16861573934842976.jpeg",
        name: "☘️ Nấm nè ☘️",
        description: `Xin chào user của em !

            -☘️Hát 80k/1h
            
            -☘️Từ 5h chiều Game 60k/1h
            
            -☘️ Có Combo ưu đãi từ 24h - 1 tuần - 1 tháng chi tiết ib e <3
            
            ☘️ E tên Thuỳ Linh - có thể gọi e là Nấm
            
            ☘️ Tình trạng : Độc Thân
            
            ☘️ E nhận game theo yêu cầu của khách có 1 số game như pubg thì e k chơi được vì bị tiền đình huhuu
            
            ☘️ E có nhận hát nhưng hát đa số nhạc buồn và hát ko theo yêu cầu.
            
            ☘️ E có nhận khách đêm khuya 60k/1h nt e ko rep cứ gọi : 0942724115 (cứ gọi nha đừng ngại vì e luôn chào đón khách nhiệt tình)
            
            ☘️ E có nhận cày rank LOL,cày treo cấp cho các game khác....
            
            ☘️
            
            🍓- chuyên cung cấp duy nhất các tài khoản nhất thị trường,NETFLIҲ Premium 4K (bên em có 2 loại vui lòng ib) co bảo hành giúp bạn có những phút giây thăng hoa cùng những bộ phim NETFLIҲ chất lượng cao,gia hạn dài lâu.
            
            ☘️ Nhận thu thẻ mua vào và bán các loại thẻ rate tốt ib e
            
            nhảy audition trùm 4 phím 8 phim
            
            ☘️nhận mở nhạc mở phim tâm sự call mess nt tâm sự gia đình bạn bè tuổi mới lớn`,
    },
    {
        id: "642ea59d-9d54-44ee-91f4-680fd1a69105",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/252157/16843424942294914.jpeg",
        name: "Linh My",
        description: `- Hallo, mình tên Nguyễn Thị Mỹ Linh

            - Giọng Bắc, đang ở Hà Nội.
            
            - Mình chủ yếu chơi game LOL, có thể tải game khác nhưng cần được hướng dẫn chơi.
            
            - Duo game mọi người nhắn tin trước giúp mình nhé, nếu không thấy em trl bên playerduo thì có thể nhắn tin qua facebook em phía dưới giúp ạ :33
            
            - Mình nhận:
            
            - Oncam: 300k/h.
            
            - Tâm sự, mở phim, bật nhạc,canh ngủ, treo discord.
            
            - Lol (mọi chế độ) đi lane ổn farm hoà và đi được mid, ad va sp
            
            - TFT: không hay.
            
            - Không nhận bất kì gì liên quan đến 18+`,
    },
    {
        id: "7ce139e4-5003-46f5-a1fc-89c74d79097f",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1214628/16874982230794096.jpeg",
        name: "Noodle 🍜",
        description: `Xin chào mọi người !

            -Game gì cũng chơi nhưng chơi game gì cũng ngu :))
            
            -Nếu không chơi game chúng mình có thể cùng nhau tâm sự, nghe nhạc, xem phim( có netflix) hoặc nghe mình hát vu vơ nhé ^^!
            
            Giọng bắc nha!!!!
            
            qua 12h mk lấy 75k/1h nha ..... cảm mơn mọi người vì đã đến >,<
            
            Mình nói chuyện vui vẻ không dặt dẹo nhưng rất hoà đồng lun 🥰`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1921263/16872142620374880.jpeg",
        name: "Mèo",
        description: `🍨 Hi mọi người 🥰

            🍓 Em là 1 chiếc Mèo đến từ miền Bắc và ra đời cách đây 27 năm rất nhây và lầy ạ :))))))
            
            🍥 Em Mèo nhận duo cả ngày với giá không đổi qua bao năm tháng là 60 cá cho 60 phút bên nhau ạ :>
            
            🍭 em Mèo có nhìu acc LOL nên nhận chiến từ rank Đồng , Bạc => Lục Bảo nhé T..T TFT từ Đồng , Sắt, Nhôm đến Kim Cương ạ :>
            
            🍊 Em Mèo có thể đi vị trí SP hoặc Ad ạ :>
            
            🍬 Tồn tại trên đời 27 năm nhưng đã có 20 năm kinh nghiệm đánh Aram , chơi được nhiều champ , gáy khét nhưng không dơ :)))))
            
            🧃 Em Mèo có thể nói ít , hoặc nói nhiều , có thể tập trung try hard game win , cũng có thể vừa chơi vừa tấu hài :> mà thường lần đầu được thuê thì hay ngại , nên mọi người đừng vì thế mà đánh giá em 1 sao nha T..T
            
            💟 LOL
            
            💟 Valorant <newbie>
            
            💟Party Animals <Fun ạ>
            
            💟 Goose Goose Duck <newbie>
            
            🌸 Ngoài chơi game ra Mèo còn nhận tâm sự tủi 26+ giá 70 cá ,do đã trải qua khá nhiều câu chuyện không may mắn nên ai cần 1 người lắng nghe và chia sẻ thì có thể tìm Mèo 😌😌
            
            🍰 Nếu yêu quý Mèo thì đừng scam tiền duo của Mèo nha 🤢😥
            
            😘 À quên nữa , cái gì quan trọng phải nói 3 lần nà :
            
            EM MÈO KHÔNG NHẬN ONCAM VÀ CHAT 18+ Ạ !
            
            EM MÈO KHÔNG NHẬN ONCAM VÀ CHAT 18+ Ạ !
            
            EM MÈO KHÔNG NHẬN ONCAM VÀ CHAT 18+ Ạ !
            
            🍒 Mèo rất dễ gần và hòa đồng nên cũng mong được mọi người yêu quý và chỉ bảo những điều Mèo còn thiếu sót ạ :>
            
            🥑 User vui lòng hong rent nợ giúp Mèo nha 😘
            
            🍄Nếu em Mèo vắng mặt trên Playduo hoặc chưa rep tin nhắn mọi người liên lạc qua FB giúp em nha , chứ đừng hủy duo tội em ạ :<`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27514362e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/2295723/17023820591608600.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/ebe97ad4-6f63-47d5-b3e1-10a06447605c__f56688d0-3854-11ee-a657-a54d6be1d46a__audio_voice.mp3",
        name: "Samee",
        description: `Mình nhận chơi LOL, TFT, Aram, stream phim và các game trên Steam. Trình có hạn nên nhận chơi game vui vẻ thui ạ ^^

        Mới rent lần đầu sẽ hơi rén, nhma hiền lành hứa k chửi user :3
        
        Qua 12h đêm bán sức khỏe nên mình xin phép để 55k/h ạ
        
        Không nhận duo qua donate và không nhận rent nợ trả sau dưới mọi hình thức
        
        Không nhận 18+ !!!!
        
        Nếu đã ghé qua thì rent thử nhaaa`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/2295723/17023820591608600.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/ebe97ad4-6f63-47d5-b3e1-10a06447605c__f56688d0-3854-11ee-a657-a54d6be1d46a__audio_voice.mp3",
        name: "♥Haan♥",
        description: `♥Giọng bắc dễ nghe, có nhận chơi đêm.

        ♥ Nhận nói chuyện tâm sự
        
        ♥Oncam nói chuyện bình thường x4
        
        ♥ ước được 1 lần 24h >.<
        
        Nói vậy đủ rồi, thuê em rồi nói tiếp :3
        
        cảm nhận nhé ♥
        
        Không thấy em rep ib thì liện hệ fb em nha :3`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1783149/16901698944356228.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/278d74ab-ae2e-4618-8805-881d426457f4__1ad3cec0-2982-11ee-a657-a54d6be1d46a__audio_voice.mp3",
        name: "Muchi",
        description: `🦊 ĐAM MÊ COSPLAY CỔ TRANG NHƯNG KHUM CÓ KINH PHÍ =))

        🦊 GIỌNG MIỀN NAM, MIỀN TÂY
        
        🦊 10 MÙA LOL - LANE NÀO CŨNG ĐÚ ( DƯỚI CAO THỦ KHÔNG NGÁN ĐỨA NÀO)
        
        🦊 VALORANT ( ODIN CHÚNG SINH BÌNH ĐẲNG )
        
        🦊 GOOSE GOOSE DUCK ( CHÚA TỂ LƯƠN LẸO )
        
        ❤ SAU 12H ĐÊM MÌNH XIN PHÉP NHẬN TỪ 2H TRỞ LÊN - XUYÊN ĐÊM ĐỀU ĐƯỢC GIÁ KHÔNG ĐỔI
        
        🦊 HÁT CHAY ĐƯỢC NẾU USER KHÔNG NGẠI =))
        
        🦊 NHẬN MỞ NHẠC , XEM PHIM CÙNG USER ( CÓ NITRO)
        
        🔞"KHÔNG CHƠI FREE , KHÔNG NHẬN ONCAM, KHÔNG NHẬN 18+ ONCAM SEXY COSPLAY"🔞 LÀM ƠN THA ĐI MẤY ĐẠI CA TÀ RĂM
        
        KHÔNG THẤY TL PLD VUI LÒNG LIÊN HỆ FB`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1783149/16901698944356228.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/278d74ab-ae2e-4618-8805-881d426457f4__1ad3cec0-2982-11ee-a657-a54d6be1d46a__audio_voice.mp3",
        name: "Muchi",
        description: `Mình nhận duo các game dưới đây ạ, sau 22h chỉ nhận duo từ 2 tiếng trở lên:

        ❤️ Valorant
        
        ❤️ TFT
        
        ❤️ Lol
        
        ❤️ Identy V
        
        ❤️ Raft
        
        ❤️ Minecraft
        
        ❤️ Fall guy ultimate
        
        ❤️ Business tour
        
        ❤️ Các game trên steam đều có thể thử
        
        ❤️ Live phim, bật nhạc, tâm sự trò chuyện
        
        Mình hông nhận hát ạ.`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1361358/16891866339559593.jpeg",
        voiceUrl: null,
        name: "Hạ Lạ",
        description: `Hellooooo. Mình là Phương Trúc. Mọi người thường gọi mình là Hạ Lạ

        Cực kì tôn trọng đồng đội và yêu thương đồng đội, tay ko to lắm nhưng mình tự lo được
        
        Vui vẻ , nhiệt tình, thân thiện, hay cười, mình cũng dễ thương nữa =))
        
        Rất vui nếu được chơi game cùng bạn
        
        Ngoài ra mình còn nhận chơi các game steam (bạn chịu dạy mình chịu chơi :))), stream phim netflix, bật nhạc,...
        
        Nếu ko thấy mình trả lời thì ib facebook giúp mình, đừng hủy tội mình :((`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e97",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/955413/1680106771114701.jpeg",
        voiceUrl: null,
        name: "Thư 🍀",
        description: `👻 Hi👻! Sau 10h đêm e nhận 80k/h ạ!

        ❥┖🍁┒Mình nhận các game:
        
        ➸ Game Steam: CSGO, PUBG, Naraka, Valorant...
        
        ➸ LOL + TFT:
        
        🌟 Đường tình em thua, đường bot e chấp
        
        🌟 TFT: Top 1 trong lòng người hâm mộ🌺
        
        ➸ Game mobile: Pubg giả lập, Liên quân
        
        ➸ Oncame 500k/h (nhận tùy tâm trạng)
        
        ➸ Nhận nói chuyện, xem + live phim (có netflix+ nitro discord)`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e98",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1361358/16839084238147934.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/66f8b716-ee52-4590-aa0a-73bd28590f5f__e1cd3020-803b-11ed-a19f-23a3b10d190e__audio_voice.mp3",
        name: "Horizon 🦋",
        description: `- Giọng bắc

        - Mng thuê ủng hộ tui đóng tiền đi học nha ^^
        
        🤍 Liên minh huyền thoại ( Ad, Sp, Mid lo được ) nhận chơi sv NA
        
        🤍 Valorant ,CS GO 2 ( chơi được từ bkim đổ xuống )
        
        🤍 Naraka ( top 1 ez )
        
        🤍 Onl Camx5`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e99",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/2146448/16929431327054015.jpeg",
        voiceUrl: null,
        name: "Quinn🐯",
        description: `Hi!

        Mình tên là 𝓗𝓸𝓪̀𝓷𝓰 𝓠𝓾𝔂𝓮̂𝓷 ( giọng miền nam ạ)`,
    },
    {
        id: "965c6170-592d-4978-9f4e-d27584366e01",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1783149/16891515924194875.jpeg",
        voiceUrl: null,
        name: "Cun. Babeii 🦦🐰",
        description: `Mình là Linh, sinh năm 2001 ạ

        Mình nhận chơi game, tâm sự và on cam nói chuyện vui vẻ 👉🏻👈🏻
        
        Nhận nhậu online đô bất tử (bất tử trên bàn nhậu hậu đậu trong tình iu )
        
        Rất ngoan hiền và nghe lời user. Ước được rent 24h 🫶🏻
        
        Vì là newbie nên còn nhiều điều chưa biết, rất mong nhận được sự yêu thương và góp ý để thay đổi hoàn thiện hơn ạ ❤️
        
        Thấy mình on mà không tl thì mng liên hệ hoặc gọi vào link fb của mình nha. Mình cảm ơn mng rất nhiều ạ`,
    },
    {
        id: "965c6171-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/2171663/16993068716814749.jpeg",
        voiceUrl:
            "https://playerduo.net/api/upload-service/audio_voices/f9f3c888-2d42-4569-83f8-a185374c063a__1fe6c9d0-e203-11eb-a5e4-115028778033__audio_voice.mp3",
        name: "𝓱𝓪𝓷 𝓱𝓪𝓷 ♪",
        description: `Mình nhận chơi game LMHT : Normal, Aram, TFT, Duo/solo, Flex.... ♥

        • Nhận coaching TFT rank KC đổ xuống ạ :3
        
        • Ngoài ra thì chúng mình có thể xem phim với nhau (có netflix)
        
        • Mình không nhận call video bất kì dưới hình thức nào ạ :3
        
        • Mình nhận duo từ 2h trở lên (Bởi vì 1h 1 game thì thiếu 2 game thì thừa ạ 😭)
        
        • Duo sau 12h donate thêm 10k/h giúp mình vì là thức đêm mệt lémm :3`,
    },
    {
        id: "965c6172-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/2243184/17012485500352848.jpeg",
        voiceUrl: null,
        name: "Hikikomori",
        description: `Bio:

        Mình sinh năm 199 vừa medium rare
        
        Kiến thức nhiều, phốt ít, hướng nội như Eminem
        
        Hiền hòa và thân thiện, thỉnh thoảng lên hứng châm biếm
        
        rank lol: cao thủ lane sp
        
        rank tft: mùa 2,4,5 thách đấu / mùa này cao thủ
        
        Rank aram: all champs 6000 trận agam....
        
        Mình nhận LOL (top,mid,sp), ĐTCL, Don't starve together, goose goose duck,... game nhẹ steam! <3
        
        Prior: Mình nghĩ nếu chúng ta có thể có duyên chơi game cùng nhau thì đơn giản là vì bạn mong muốn có những khoảng tgian giải trí thư giãn, vậy nên nếu không hợp chúng ta chỉ cần không chơi cùng lần sau nữa là được, be happy!
        
        sau tầm 5 lần bị scam mình đã bớt hiền hơn, các b ttoan trc giúp mình trc khi thuê nha
        
        Mình thuộc team tấu hài, try hard chơi game, vô cùng giải trí nhưng không có nhận call tâm sự nhé....
        
        1 xíu báo về mình nha!`,
    },
    {
        id: "965c6173-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1777609/16984943590621517.jpeg",
        voiceUrl: null,
        name: "𝓨 𝓪 𝓷",
        description: `🌸 Yo ! its Yannn

        🌸 Mình có thể tải game theo yêu cầu nhaaa
        
        ☁️ 𝘴𝘦𝘳𝘷𝘦𝘳 𝘕𝘈 / 𝘖𝘊 / 𝘒𝘙 / 𝘑𝘗 / 𝘌𝘜
        
        ❄️ 𝐿𝑂𝐿 & 𝑇𝐹𝑇 - 𝑃𝑈𝐵𝐺 - 𝐶𝑆𝐺𝑂 - 𝑉𝐴𝐿𝑂𝑅𝐴𝑁𝑇 ❄️
        
        💌 𝑺𝒖𝒓𝒗𝒊𝒗𝒂𝒍 𝒈𝒂𝒎𝒆𝒔 : ARK - Green Hell - Raft - Small Land - Grounded - The Forest - Valheim - The Survivalists - Dont Starve Together - V Rising - 7 Days To Die - Astroneer - Sunkenland ...
        
        💌 𝑶𝒕𝒉𝒆𝒓 𝒈𝒂𝒎𝒆𝒔 : Party Animals - Sea of Thieves - Business Tour - Goose Goose Duck - Prop & Seek - Pummel Party - Human Fall Flat - Naraka ...`,
    },
    {
        id: "965c6174-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1602330/16956543013555363.jpeg",
        voiceUrl: null,
        name: "Minnyy",
        description: `Giọng miền tây chua chát :>

        Em nhận các loại game :
        
        VALORANT ( bắn ổn pla trở xuống )
        
        LOL , ARAM , TFT (NA) rank bạc vàng
        
        Tốc chiến ( bạc )
        
        Nrk ( rank 1-2k )
        
        EM NHẬN NÓI CHUYỆN TÂM SỰ , XEM PHIM XUYÊN ĐÊM CÙNG USER LUÔN Ạ ><
        
        Máy nhà mic không ồn
        
        Không nhận rent nợ, chơi trước trả sau, em ngại nhắc nên user thông cảm giúp em
        
        Nhắn tin pld em không rep mn nhắn fb giúp em vớiiiii :(( pld hay lỗi k thông báo lắm. Đọc đến đây ùi thì ủng hộ em có tiền đi học với em cảm ơn rất nhèo 🥰😋❤️`,
    },
    {
        id: "965c6175-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1238778/16692071870294418.jpeg",
        voiceUrl: null,
        name: "Nhi Cherry 🍒",
        description: `Sống và làm việc tại : HCM

        Em nhận các game sau :
        
        - 𝐏𝐔𝐁𝐆 𝐏𝐂 hơn 4000h
        
        - 𝐕𝐀𝐋𝐎𝐑𝐀𝐍𝐓
        
        - 𝐂𝐒𝐆𝐎2 : điểm 8k
        
        - Naraka 2k 3k
        
        - 𝐓𝐅𝐓 - Liên Minh - ARAM
        
        CÁC GAME STEAM SAU :
        
        + Sons of the forest ,See of thieves ,Human fall flat , Ark ,The forest, Argou ,
        
        +Don't starve together , Prop and seek , Raft , Devour , Business tour , Farm together
        
        + Party animal
        
        +Phasmophia , devour, và các game ma khác
        
        +GTA sv Anh chị em .... và các game sinh tồn khác ạ ><`,
    },
    {
        id: "965c6176-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/image/ablum/16334901117636072.jpg",
        voiceUrl: null,
        name: "Bối Nà ❤️",
        description: `💜𝑩𝒂̂́𝒎 𝒕𝒉𝒖𝒆̂ đ𝒆̂̉ 𝒃𝒊𝒆̂́𝒕 𝒏𝒉𝒊𝒆̂̀𝒖 𝒉𝒐̛𝒏 𝒗𝒆̂̀ 𝒏𝒉𝒂𝒖 𝒏𝒉𝒆́ 💜

        Sản phẩm này không phải là thuốc nhưng có tác dụng làm ngiu anh 🙆
        
        🤷Mình tên Bối
        
        𝑶𝒏𝒍 𝑪𝒂𝒎( Mở cam sẽ tùy) + 𝑨𝒍𝒍 𝒈𝒂𝒎𝒆
        
        call video, mở cam 10.000.000vnđ/1h mess giá (KHÔNG 18+)
        
        Onl cam discord x10
        
        - 𝐍𝐀𝐑𝐀𝐊𝐀 ( Chơi vui vẻ, tay be bé)
        
        - 𝐓𝐅𝐓-LOL(rank nào cũng chơi tay vừa vừa ạ)
        
        - Xem phim và trò chuyện nghe nhạc ở Discord
        
        🌞🌞Mình có nhận các game chơi giải trí, sinh tồn, kinh dị, bla bla:
        
        - Party animal, Goose Goose Duck (zịt), Business Tour (cờ tỷ phú), Scrible it (vẽ), Agrou (ma sói), Among us.....
        
        (Mình có thể Down game trên Steam theo yêu cầu nếu được hướng dẫn chơi ạ)
        
        🎮Vui tính nhưng hơi ít nói
        
        🌸 Chơi game từ 11h đêm đổ đi thì thuê giúp tớ 70k/giờ (thuê 2h giúp tớ nhé). Chơi đêm hơi mất sức!
        
        Ước được bụt rent 24h ạ . xin cảm ơn :3`,
    },
    {
        id: "965c6177-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1783149/16787521200747287.jpeg",
        voiceUrl: null,
        name: "Ngọt ngào man trá",
        description: `ở đây k bán nỗi buồn ~`,
    },
    {
        id: "965c6178-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://community-oss.epal.gg/data/community/2245646/17027392699001292.jpeg",
        voiceUrl: null,
        name: "Thẻo Phưn 🐰",
        description: `Em bé cụa anh 🥕`,
    },
    {
        id: "965c6179-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://global-oss.epal.gg/data/cover/1432991/16823682911914657.jpeg",
        voiceUrl: null,
        name: "Sắp cute♥",
        description: `Hello mọi người, đã vào đây rồi thì cho mình xin 1 fl ở góc bên phải kia nhá :<

        Mình nhận chơi PUBG PC, PUBG MOBILE, Liên Minh, Tốc Chiến, Scribble It, Business Tour, AMONG US, Goose Goose Duck có thể tâm sự và nhậu online ạ
        
        Giọng Bắc, máy nhà mic không ồn ạ
        
        Không nhận rent nợ, không nhận chơi free nhé ❤️
        
        Không nhận đổi tiền pld nhé ♥
        
        Thuê trước rồi chơi, tránh mất lòng nhau 💖
        
        Nhậu onl x3 ( tiền bia và mồi ạ :v )
        
        Không nhận call video đặc biệt là 18+ ạ 🥺
        
        Tâm sự chuyện tình yêu, gia đình, lắng nghe những chuyện bạn chia sẻ ạ
        
        GTA V
        
        PUBG MOBILE : Cover tốt ạ, nguyện làm y tá suốt đời cho bạn ạ
        
        LOL: Rank bk lane chính Sp buff ạ
        
        Tốc Chiến: Mình chơi cũng bình thường
        
        Business Tour( cờ tỷ phú ): mình được ông bà độ lắm ạ :v
        
        AMONG US, Goose Goose Duck: mình HƠI lươn thôi
        
        Nhận mở nhạc , stream phim và sẽ down các game mà cậu yêu cầu ạ ❤️`,
    },
    {
        id: "965c6180-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://community-oss.epal.gg/data/community/1566853/17002490706955350.jpg",
        voiceUrl: null,
        name: "Kellyy",
        description: `- Đọc kĩ trước khi rent nhe

        - LOL : kc trở xún, lane chính : AD,SP,MID
        
        có thể tải các sv khác nếu cậu cho mượn acc:3
        
        - ĐTCL : bkimmm ( có coach nếu c tin tui)
        
        - Game steam gì cũng có thể thử ( goose goose duck, human fall flat, fall guys, devour, phasmophia, the forest, the Outlast 1,2, gunfire reborn,…)
        
        🚫 ko nhận on cam mọi hình thức
        
        - Ấn nút thuê mình sẽ online nha🌸
        
        🌸giọng bắc🌸`,
    },
    {
        id: "965c6181-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://community-oss.epal.gg/data/community/1432991/17017314816867097.jpeg",
        voiceUrl: null,
        name: "BeThoc",
        description: `Player mới của app nên mong các a bụt giúp đỡ ạ❤️

        ✏️ Nhận pubg
        
        ✏️ Nhận ĐTCL
        
        ✏️ Nhận Liên quân
        
        ✏️ Nhận Call of duty
        
        ✏️ Nhận tán gẫu, call, xem phim
        
        ✏️Nhận chơi game vô tri như play TOGETHER, ma sói,amongus, hago,weplay…..
        
        📌Có thể chơi tất cả các game MOBILE theo yêu cầu của boss , nếu được boss chỉ dẫn…
        
        ❌ KHÔNG NHẬN CALL 18+ , CALL BODY HAY NÓI CHUYỆN VỚI CHỦ ĐỀ KHÔNG PHÙ HỢP
        
        Mong sẽ được mọi người ủng hộ , còn gì thiếu sót các boss cứ góp ý để có trải nghiệm vui vẻ cùng nhau nha❤️`,
    },
    {
        id: "965c6182-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://community-oss.epal.gg/data/community/2178612/17016825162076939.jpeg",
        voiceUrl: null,
        name: "Lynkkkkk",
        description: `❤️ Hello mọi người ❤️

        🦊 Ở đây em có nhận chơi Liên Minh nè ( sever NA - KR - JP - CN ) 🦊
        
        - Main MID ( có thể đi AD hoặc Rừng nhưng khum hayy )
        
        🫶 Nhận Tâm Sự, Chia sẻ,..... 🫶
        
        👉 Call video x7
        
        - Cosplay anime, nhân vật game,sexyy ..... ( tuỳ hứng thì nhận ạ )
        
        - Mở nhạc, xem phim, chơi game theo yêu cầu
        
        - Tính tình hơi thất thường, sáng nắng chiều mưa giữa trưa âm ẩm ! Có lúc hướng nội lúc hướng ngoại. Hơi thẳng thắn lên nhiều lúc không làm chủ được phát ngôn nên hơi toẹt mồm ạ.
        
        Cảm ơn mọi người đã dành thời gian cho em ở đây và ủng hộ em🐔
        
        Chúc mọi người có 1h thuê vui vẻ và hài lòng !
        
        Mọi nhận xét và đánh giá ở đây em sẽ đón nhận và cố gắng hoàn thiện để tốt hơn
        
        💕Thank you 💕`,
    },
    {
        id: "965c6183-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://community-oss.epal.gg/data/community/2096731/16896737478968998.jpg",
        voiceUrl: null,
        name: "𝑌𝑢𝑛𝑖𝑒 🐰",
        description: `Yunie chào anh/chị ạ

        KHÔNG NHẬN ON CAM SEXY HAY COSPLAY GÌ HẾT
        
        Miệng hơi hỗn tuỳ lúc nhưng sẽ không hỗn với user
        
        ❣️ User bấm thuê không thấy em rep thì đừng vội huỷ hãy ib fb của em nhé 😢
        
        https://www.facebook.com/dieuanh.yunie
        
        🩶 Em nhận on cam insta, fb, discord 250k/1h ạ với vài lưu ý trong ngoặc
        
        [ 🔥 Không 18+
        
        🔥Không sexy
        
        🔥không tâm sự qua telegram 🙅🏻‍♀️ ]
        
        Nhậu onl x6 giúp em đã tính tiền bia-rượu
        
        Vlr: Em mới chơi nên khả năng bắn còn yếu nhưng sẽ không tạ
        
        LoL thì e main sp buff vẫn có thể đi all lane trừ rừng ra ạ
        
        Em chơi game tấu hài là chính nên đừng thuê em gánh nha
        
        Rent em và cảm nhận ❤`,
    },
    {
        id: "965c6184-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://community-oss.epal.gg/data/community/1812490/17028125951177679.jpg",
        voiceUrl: null,
        name: "Mễ Mế🍓",
        description: `🍓Tên thật là Quyên.

        🍓Mình sẽ cố gắng chơi tất cả các game mà user muốn___
        
        🍓 Lol đi được tất cả lane , riêng rừng hơi gà ạ, nhận rank, flex, nor, aram, tft,.... tất cả các chế độ lol(vn,na)
        
        🍓pubg pc và valorant mình mới tập chơi thui nên nếu for fun thì rent ủng hộ mình nha
        
        🍓Game mobile: nhận liên quân, tốc chiến và pubg ạ
        
        🍓Nhận chơi các game trên steam, nhận tải game theo yêu cầu.
        
        🍓 Nhận nghe nhạc cùng user, tâm sự cùng user , xem phim cùng user, cười cùng user , buồn cùng user ><....thuê mình để cảm nhận ạ, biết đâu ta lại là chân ái của nhau><
        
        KHÔNG NHẬN LÀM NGƯỜI YÊU, KHÔNG 18+, KHÔNG CALL VIDEO SEXY(show)
        
        🍓 Nếu thấy rep lâu thì đừng vội huỷ tội nghiệp mình, qua face mình để đấm mình đấm dậy nha>_>`,
    },
    {
        id: "965c6185-592d-4978-9f4e-d27584366e96",
        avatarUrl:
            "https://community-oss.epal.gg/data/community/1741105/17005815185326193.jpeg",
        voiceUrl: null,
        name: "Hoàng Anh",
        description: `🍯 Hi ~ Mình tên Hoàng Anh . Nick name là HannahBee . Mn có thể gọi là Hannah hoặc Bee ( Bee trong con ong chăm chỉ 🐝 )

        🍉 M gốc miền Trung nhưng hiện tại sinh sống ở Hà nội <3
        
        🍉 Sau 22h nhận 2h duo trở lên
        
        🍉 Game :
        
        🍔 LOL , TFT ( Vàng , BK , KC ) - NA + SEA
        
        🍔 Valorant ( Bạc - Thượng nhân ) - Vui vẻ hay tryhard đều được ạ ^^ - NA + SEA - game này mn thông cảm thuê từ 2h trở lên vì 1 game đã tầm 40-45p rồi ạ <3
        
        🍔 STEAM : Don't Starve Together , Business Tour, Devour, B4B, Team Fortress2, Scribble It, Phasmophobia, pummel party, ...
        
        🍔 Nhận mở nhạc và xem phim cùng trên discord
        
        🐝 Chăm chỉ để một ngày nào đó cũng được gặp bụt như mọi người !!
        
        Arigatōgozaimasu !! <3 🙇‍♀️`,
    },
];
const servicesDefault = [
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Valorant.png",
        name: "Valorant",
        attributes: [
            {
                name: "Rank",
                enName: "Hạng",
                values: [
                    {
                        value: "Sắt",
                        enValue: "Iron",
                    },
                    {
                        value: "Đồng",
                        enValue: "Bronze",
                    },
                    {
                        value: "Bạc",
                        enValue: "Silver",
                    },
                    {
                        value: "Vàng",
                        enValue: "Gold",
                    },
                    {
                        value: "Bạch Kim",
                        enValue: "Platinum",
                    },
                    {
                        value: "Kim cương",
                        enValue: "Diamond",
                    },
                    {
                        value: "Bất diệt",
                        enValue: "Immortal",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Overwatch2.png",
        name: "Overwatch",
        attributes: [
            {
                name: "Rank",
                enName: "Hạng",
                values: [
                    {
                        value: "Đồng",
                        enValue: "Bronze",
                    },
                    {
                        value: "Bạc",
                        enValue: "Silver",
                    },
                    {
                        value: "Vàng",
                        enValue: "Gold",
                    },
                    {
                        value: "Bạch Kim",
                        enValue: "Platinum",
                    },
                    {
                        value: "Kim cương",
                        enValue: "Diamond",
                    },
                    {
                        value: "Cao thủ",
                        enValue: "Master",
                    },
                    {
                        value: "Đại cao thủ",
                        enValue: "Grandmaster",
                    },
                    {
                        value: "Top500",
                        enValue: "Top500",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Fortnite.png",
        name: "Fortnite",
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Dota2.png",
        name: "Dota 2",
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Don'tStarveTogether.png",
        name: "Don't Starve Together",
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_FIFA.png",
        name: "FIFA",
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_GrandTheftAutoV.png",
        name: "Grand Theft Auto V",
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_TeamfightTactics.png",
        name: "Team fight Tactics",
        attributes: [
            {
                name: "Rank",
                enName: "Hạng",
                values: [
                    {
                        value: "Sắt",
                        enValue: "Iron",
                    },
                    {
                        value: "Đồng",
                        enValue: "Bronze",
                    },
                    {
                        value: "Bạc",
                        enValue: "Silver",
                    },
                    {
                        value: "Vàng",
                        enValue: "Gold",
                    },
                    {
                        value: "Bạch Kim",
                        enValue: "Platinum",
                    },
                    {
                        value: "Kim cương",
                        enValue: "Diamond",
                    },
                    {
                        value: "Cao thủ",
                        enValue: "Master",
                    },
                    {
                        value: "Đại cao thủ",
                        enValue: "Grandmaster",
                    },
                    {
                        value: "Thách đấu",
                        enValue: "Challenger",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_GenshinImpact.png",
        name: "Genshin Impact",
        attributes: [
            {
                name: "Vai trò",
                enName: "Roles",
                values: [
                    {
                        value: "DPS chính",
                        enValue: "Main DPS",
                    },
                    {
                        value: "DPS phụ",
                        enValue: "Sub DPS",
                    },
                    {
                        value: "Hỗ trợ đa dụng",
                        enValue: "Utility Support",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_GenshinImpact.png",
        name: "Fall Guys",
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_CS_GO.png",
        name: "CS:GO",
        attributes: [
            {
                name: "Vai trò",
                enName: "Roles",
                values: [
                    {
                        value: "Đội trưởng",
                        enValue: "Leader",
                    },
                    {
                        value: "Người tiên phong",
                        enValue: "Entry Fragger",
                    },
                    {
                        value: "Bẵn tỉa",
                        enValue: "AWPer",
                    },
                    {
                        value: "Hỗ trợ",
                        enValue: "Supporter",
                    },
                    {
                        value: "Kẻ ẩn nấp",
                        enValue: "Lurker",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Terraria.png",
        name: "Terraria",
        attributes: [
            {
                name: "Phong cách",
                enName: "Style",
                values: [
                    {
                        value: "Đấu sĩ",
                        enValue: "Fighter",
                    },
                    {
                        value: "Thu thập",
                        enValue: "Gatherer",
                    },
                    {
                        value: "Người xây dựng",
                        enValue: "Builder",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_Terraria.png",
        name: "Pokémon Unite",
        attributes: [
            {
                name: "Phong cách",
                enName: "Style",
                values: [
                    {
                        value: "Tấn công",
                        enValue: "Attacker",
                    },
                    {
                        value: "Hỗ trợ",
                        enValue: "Supporter",
                    },
                    {
                        value: "Phòng thủ",
                        enValue: "Defender",
                    },
                    {
                        value: "Tốc độ",
                        enValue: "Speedster",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_NARAKA_BLADEPOINT.png",
        name: "Naraka: Bladepoint",
        attributes: [
            {
                name: "Hạng",
                enName: "Rank",
                values: [
                    {
                        value: "Đồng",
                        enValue: "Bronze",
                    },
                    {
                        value: "Bạc",
                        enValue: "Silver",
                    },
                    {
                        value: "Vàng",
                        enValue: "Gold",
                    },
                    {
                        value: "Bạch kim",
                        enValue: "Platinum",
                    },
                    {
                        value: "Mặt trời",
                        enValue: "Solar",
                    },
                    {
                        value: "Thiên Vương",
                        enValue: "Empyrean",
                    },
                    {
                        value: "Tinh tú",
                        enValue: "Astral",
                    },
                    {
                        value: "Thần thoại",
                        enValue: "Asura",
                    },
                ],
            },
        ],
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_Partyanimal.png",
        name: "Party Animals",
    },
    {
        url: "https://static-oss.epal.gg/data/static/v2/img10_v2_LeagueofLegends.png",
        name: "League of Legends",
        attributes: [
            {
                name: "Rank",
                enName: "Hạng",
                values: [
                    {
                        value: "Sắt",
                        enValue: "Iron",
                    },
                    {
                        value: "Đồng",
                        enValue: "Bronze",
                    },
                    {
                        value: "Bạc",
                        enValue: "Silver",
                    },
                    {
                        value: "Vàng",
                        enValue: "Gold",
                    },
                    {
                        value: "Bạch Kim",
                        enValue: "Platinum",
                    },
                    {
                        value: "Kim cương",
                        enValue: "Diamond",
                    },
                    {
                        value: "Cao thủ",
                        enValue: "Master",
                    },
                    {
                        value: "Đại cao thủ",
                        enValue: "Grandmaster",
                    },
                    {
                        value: "Thách đấu",
                        enValue: "Challenger",
                    },
                ],
            },
            {
                name: "Vị trí",
                enName: "Lance",
                values: [
                    {
                        value: "Hỗ trợ",
                        enValue: "Support",
                    },
                    {
                        value: "Xạ thủ",
                        enValue: "ADC",
                    },
                    {
                        value: "Đừng trên",
                        enValue: "Top",
                    },
                    {
                        value: "Đừng giữa",
                        enValue: "Mid",
                    },
                    {
                        value: "Rừng",
                        enValue: "Jungle",
                    },
                ],
            },
        ],
    },
];
// const prisma = new PrismaClient();
async function seed() {
    try {
        if (!(await prisma.balanceSetting.findFirst())) {
            await prisma.balanceSetting.createMany({
                data: [
                    {
                        unitCurrency: UnitCurrency.VND,
                        feePercentage: 0.01,
                        surcharge: 2000,
                        balanceSettingType: BalanceSettingType.WITHDRAWAL,
                        paymentSystemPlatform: PaymentSystemPlatform.MOMO,
                    },
                    {
                        unitCurrency: UnitCurrency.VND,
                        feePercentage: 0.01,
                        surcharge: 2000,
                        balanceSettingType: BalanceSettingType.DEPOSIT,
                        paymentSystemPlatform: PaymentSystemPlatform.MOMO,
                    },
                    {
                        unitCurrency: UnitCurrency.VND,
                        feePercentage: 0.01,
                        surcharge: 2000,
                        balanceSettingType: BalanceSettingType.WITHDRAWAL,
                        paymentSystemPlatform: PaymentSystemPlatform.VNPAY,
                    },
                    {
                        unitCurrency: UnitCurrency.VND,
                        feePercentage: 0.01,
                        surcharge: 2000,
                        balanceSettingType: BalanceSettingType.DEPOSIT,
                        paymentSystemPlatform: PaymentSystemPlatform.VNPAY,
                    },
                    {
                        balanceSettingType:
                            BalanceSettingType.PROVIDER_GET_MONEY_BOOKING,
                        feePercentage: 0.1,
                    },
                    {
                        balanceSettingType:
                            BalanceSettingType.PROVIDER_GET_MONEY_DONATE,
                        feePercentage: 0.05,
                    },
                    {
                        balanceSettingType: BalanceSettingType.GIFT_TO_MONEY,
                        feePercentage: 0.05,
                    },
                ],
            });
        }
        if (!(await prisma.user.findFirst())) {
            const users: any[] = [];

            for (let i = 0; i < userDefault.length; i++) {
                try {
                    const name = faker.person.fullName();
                    const createdAt = faker.date.past();
                    const user = await prisma.user.create({
                        data: {
                            id: userDefault[i]?.id!,
                            loginType: LoginType.GOOGLE,
                            avatarUrl: userDefault[i]?.avatarUrl!,
                            createdAt: createdAt,
                            updatedAt: createdAt,
                            dob: faker.date.past(),
                            email: faker.internet.email(),
                            gender:
                                Object.values(Gender)[
                                    faker.number.int({
                                        min: 0,
                                        max: Object.values(Gender).length - 1,
                                    })
                                ] || Gender.OTHER,
                            name: userDefault[i]?.name ?? name,
                            slug: utilService.changeToSlug(
                                userDefault[i]?.name ?? name,
                                ""
                            ),
                            phone: faker.phone.number(),
                            isVerified: true,
                            isProvider: true,
                        },
                    });
                    (user as any).userPaymentSystem =
                        await prisma.userPaymentSystem.create({
                            data: {
                                platform: PaymentSystemPlatform.MOMO,
                                userId: user.id,
                            },
                        });
                    users.push(user);
                } catch (err) {}
            }
            // Create providers

            for (let i = 0; i < userDefault.length; i++) {
                try {
                    await prisma.providerConfig.create({
                        data: {
                            user: {
                                connect: {
                                    id: users[i].id,
                                },
                            },
                            voiceUrl: userDefault[i]?.voiceUrl ?? null,
                            description:
                                userDefault[i]?.description ??
                                faker.person.bio(),
                            status:
                                Object.values(ProviderStatus)[
                                    faker.number.int({
                                        min: 0,
                                        max:
                                            Object.values(ProviderStatus)
                                                .length - 1,
                                    })
                                ] || ProviderStatus.ACTIVATED,
                        },
                    });
                } catch (err) {}
            }

            // Create services

            for (let serviceDefault of servicesDefault) {
                try {
                    const service = await prisma.service.create({
                        data: {
                            name: serviceDefault?.name!,
                            imageUrl: serviceDefault?.url!,
                            slug: utilService.changeToSlug(
                                serviceDefault?.name!
                            ),
                        },
                    });
                    if (serviceDefault.attributes) {
                        for (let attribute of serviceDefault.attributes) {
                            const serviceAttribute =
                                await prisma.serviceAttribute.create({
                                    data: {
                                        attribute: attribute.enName,
                                        viAttribute: attribute.name,
                                        service: {
                                            connect: {
                                                id: service.id,
                                            },
                                        },
                                    },
                                });

                            if (attribute.values) {
                                for (let value of attribute.values) {
                                    await prisma.serviceAttributeValue.create({
                                        data: {
                                            value: value.enValue,
                                            viValue: value.value,
                                            serviceAttribute: {
                                                connect: {
                                                    id: serviceAttribute.id,
                                                },
                                            },
                                        },
                                    });
                                }
                            }
                        }
                    }
                } catch (err) {}
            }
            const services = await prisma.service.findMany({
                include: {
                    serviceAttributes: {
                        include: {
                            serviceAttributeValues: true,
                        },
                    },
                },
            });
            // Create provider services
            for (const provider of users) {
                let position = 1;

                for (const service of services) {
                    try {
                        const providerService =
                            await prisma.providerService.create({
                                data: {
                                    provider: {
                                        connect: {
                                            id: provider.id,
                                        },
                                    },
                                    service: {
                                        connect: {
                                            id: service.id!,
                                        },
                                    },
                                    defaultCost:
                                        (faker.number.int({
                                            min: 30,
                                            max: 80,
                                        }) || 30) * 1000,
                                    position: position++,
                                },
                            });
                        for (let serviceAttribute of service.serviceAttributes) {
                            const providerServiceAttribute =
                                await prisma.providerServiceAttribute.create({
                                    data: {
                                        providerService: {
                                            connect: {
                                                id: providerService.id,
                                            },
                                        },
                                        serviceAttribute: {
                                            connect: {
                                                id: serviceAttribute.id,
                                            },
                                        },
                                    },
                                });
                            const serviceAttributeValueLength =
                                serviceAttribute.serviceAttributeValues.length;
                            const randomTotalProviderServiceAttribute =
                                faker.number.int({
                                    min: 0,
                                    max: serviceAttributeValueLength - 1,
                                });
                            for (
                                let i = 0;
                                i < randomTotalProviderServiceAttribute;
                                i++
                            ) {
                                if (
                                    serviceAttribute?.serviceAttributeValues[i]
                                        ?.id
                                )
                                    await prisma.providerServiceAttributeValue.create(
                                        {
                                            data: {
                                                providerServiceAttribute: {
                                                    connect: {
                                                        id: providerServiceAttribute.id,
                                                    },
                                                },
                                                serviceAttributeValue: {
                                                    connect: {
                                                        id: serviceAttribute
                                                            ?.serviceAttributeValues[
                                                            i
                                                        ]?.id!,
                                                    },
                                                },
                                            },
                                        }
                                    );
                            }
                        }
                    } catch (err) {}
                }
            }
            // Create booking costs
            for (const providerService of await prisma.providerService.findMany()) {
                try {
                    await prisma.bookingCost.create({
                        data: {
                            providerService: {
                                connect: {
                                    id: providerService.id,
                                },
                            },
                            startTimeOfDay:
                                ["09:00", "10:00", "11:00"][
                                    faker.number.int({ min: 0, max: 2 })
                                ] || "09:00",
                            endTimeOfDay:
                                ["12:00", "13:00", "14:00"][
                                    faker.number.int({ min: 0, max: 2 })
                                ] || "12:00",
                            amount: faker.number.int({
                                min: 10000,
                                max: 100000,
                            }),
                        },
                    });
                } catch (err) {}
            }
            // Create BalanceHistory

            // Create BookingHistory
            for (let i = 0; i < userDefault.length; i++) {
                for (let j = 0; j < 6; j++) {
                    try {
                        const amountBalance =
                            faker.number.int({ min: 2, max: 10 }) * 10000;
                        const { totalMoney } =
                            await balanceSettingRepository.convertBalanceToMoneyForDeposit(
                                amountBalance,
                                UnitCurrency.VND,
                                PaymentSystemPlatform.MOMO
                            );
                        const createdAt = faker.date.past();
                        await prisma.depositRequest.create({
                            data: {
                                dataStringType:
                                    DepositRequestDataStringType.REDIRECT_URL,
                                amountBalance,
                                createdAt: createdAt,
                                amountMoney: totalMoney,
                                transactionCode:
                                    utilService.generateTransactionCode(),
                                unitCurrency: UnitCurrency.VND,
                                status: "APPROVED",
                                requester: {
                                    connect: {
                                        id: userDefault[i]?.id!,
                                    },
                                },
                                dataString:
                                    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2002000&vnp_Command=pay&vnp_CreateDate=20231217201720&vnp_CurrCode=VND&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+cho+ma+GD%3AK9Q65OJ9PD17122023081720475&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5698%2Fume-service%2Fwebhook%2Fvnpay_webhook&vnp_TmnCode=7JULXGU4&vnp_TxnRef=K9Q65OJ9PD17122023081720475&vnp_Version=2.1.0&vnp_SecureHash=fe405992c44d86c312abd3f61fd36b822c19ead7c74dc702e59b0fc83762ab07d30a9f9c495eebf23306087b58fcdedc8e1cfd1d812a793000721947e19b266e",
                            },
                        });
                        await prisma.balanceHistory.create({
                            data: {
                                user: {
                                    connect: {
                                        id: users[j].id,
                                    },
                                },
                                createdAt: createdAt,
                                balanceType: BalanceType.DEPOSIT,
                                amount: amountBalance,
                            },
                        });
                    } catch (err) {}
                }
            }
            // Create BookingHistory
            for (let i = 0; i < userDefault.length; i++) {
                for (let j = 0; j < 6; j++) {
                    try {
                        const amountBalance =
                            faker.number.int({ min: 2, max: 10 }) * 10000;
                        const { totalMoney } =
                            await balanceSettingRepository.convertBalanceToMoneyForWithdrawal(
                                amountBalance,
                                UnitCurrency.VND
                            );
                        const createdAt = faker.date.past();
                        await prisma.withdrawalRequest.create({
                            data: {
                                amountBalance,
                                createdAt: createdAt,
                                amountMoney: totalMoney,

                                unitCurrency: UnitCurrency.VND,
                                status: "COMPLETED",
                                requester: {
                                    connect: {
                                        id: userDefault[i]?.id!,
                                    },
                                },
                                userPaymentSystem:
                                    users[i].userPaymentSystem.id,
                            },
                        });
                        await prisma.balanceHistory.create({
                            data: {
                                user: {
                                    connect: {
                                        id: users[j].id,
                                    },
                                },
                                createdAt: createdAt,
                                balanceType: BalanceType.WITHDRAWAL,
                                amount: amountBalance,
                            },
                        });
                    } catch (err) {}
                }
            }
            for (let i = 0; i < userDefault.length; i++) {
                for (let j = 0; j < userDefault.length; j++) {
                    try {
                        const bookingStatus =
                            Object.values(BookingStatus)[
                                faker.number.int({
                                    min: 0,
                                    max:
                                        Object.values(BookingStatus).length - 1,
                                })
                            ] || BookingStatus.PROVIDER_ACCEPT;
                        const createdAt = faker.date.past();
                        const bookingPeriod = faker.number.int({
                            min: 1,
                            max: 10,
                        });
                        const providerService = (
                            await prisma.providerService.findMany({
                                where: {
                                    NOT: {
                                        provider: {
                                            id: users[j].id,
                                        },
                                    },
                                },
                            })
                        )[j];
                        if (!providerService) continue;
                        let costPerHour = providerService.defaultCost;
                        const totalCost = bookingPeriod * costPerHour;
                        const providerReceivedBalance =
                            await balanceSettingRepository.calculateBalanceBookingForProvider(
                                totalCost
                            );
                        const bookingHistory =
                            await prisma.bookingHistory.create({
                                data: {
                                    status: bookingStatus,
                                    booker: {
                                        connect: {
                                            id: users[j].id,
                                        },
                                    },
                                    providerService: {
                                        connect: {
                                            id: providerService.id,
                                        },
                                    },
                                    createdAt: createdAt,
                                    acceptedAt: (
                                        [
                                            BookingStatus.INIT,
                                            BookingStatus.USER_CANCEL,
                                        ] as BookingStatus[]
                                    ).includes(bookingStatus)
                                        ? createdAt
                                        : null,
                                    totalCost: totalCost,
                                    bookingPeriod: bookingPeriod,
                                    providerReceivedBalance:
                                        providerReceivedBalance,
                                },
                            });
                        if (
                            !(
                                [
                                    BookingStatus.INIT,
                                    BookingStatus.USER_CANCEL,
                                ] as BookingStatus[]
                            ).includes(bookingStatus)
                        ) {
                            await prisma.balanceHistory.create({
                                data: {
                                    user: {
                                        connect: {
                                            id: users[j].id,
                                        },
                                    },
                                    createdAt: createdAt,
                                    balanceType: BalanceType.SPEND_BOOKING,
                                    amount: totalCost,
                                },
                            });
                            await prisma.balanceHistory.create({
                                data: {
                                    user: {
                                        connect: {
                                            id: providerService.providerId,
                                        },
                                    },
                                    createdAt: createdAt,
                                    balanceType: BalanceType.GET_BOOKING,
                                    amount: providerReceivedBalance,
                                },
                            });
                            await prisma.feedback.create({
                                data: {
                                    booking: {
                                        connect: {
                                            id: bookingHistory.id,
                                        },
                                    },
                                    content: faker.lorem.paragraph(),
                                    amountStar: faker.number.int({
                                        min: 3,
                                        max: 5,
                                    }),
                                },
                            });
                        }
                    } catch (err) {}
                }
            }
            // Create Feedback
        }

        if (!(await prisma.post.findFirst())) {
            // Generate sample posts
            const posts = [];
            for (const user of userDefault) {
                for (
                    let i = 0;
                    i < faker.number.int({ min: 0, max: 10 });
                    i++
                ) {
                    const post = await prisma.post.create({
                        data: {
                            userId: user.id,
                            content: faker.lorem.paragraph(),
                            thumbnails: [
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE",
                                },
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE",
                                },
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE",
                                },
                                {
                                    url: faker.image.urlPicsumPhotos(),
                                    type: "IMAGE",
                                },
                            ],
                        },
                    });
                    posts.push(post);
                }
            }
            for (const post of posts) {
                for (
                    let i = 0;
                    i < faker.number.int({ min: 0, max: userDefault.length });
                    i++
                ) {
                    await prisma.commentPost.create({
                        data: {
                            userId: userDefault[i]?.id!,
                            postId: post.id,
                            content: faker.lorem.sentence(),
                        },
                    });
                }
                for (
                    let i = 0;
                    i < faker.number.int({ min: 0, max: userDefault.length });
                    i++
                ) {
                    await prisma.likePost.create({
                        data: {
                            userId: userDefault[i]?.id!,
                            postId: post.id,
                        },
                    });
                }
                for (
                    let i = 0;
                    i < faker.number.int({ min: 0, max: userDefault.length });
                    i++
                ) {
                    await prisma.watchedPost.create({
                        data: {
                            userId: userDefault[i]?.id!,
                            postId: post.id,
                        },
                    });
                }
            }
        }
        if (!(await prisma.province.findFirst())) {
            await prisma.province.createMany({
                data: vietnamAddress.province.map((item) => {
                    return {
                        id: item.idProvince,
                        name: item.name,
                        enName: item.enName,
                    };
                }),
                skipDuplicates: true,
            });
        }
        if (!(await prisma.district.findFirst())) {
            await prisma.district.createMany({
                data: vietnamAddress.district.map((item) => {
                    return {
                        id: item.idDistrict,
                        provinceId: item.idProvince,
                        name: item.name,
                        enName: item.enName,
                    };
                }),
                skipDuplicates: true,
            });
        }
        if (!(await prisma.commune.findFirst())) {
            await prisma.commune.createMany({
                data: vietnamAddress.commune.map((item) => {
                    return {
                        id: item.idCommune,
                        districtId: item.idDistrict,
                        name: item.name,
                        enName: item.enName,
                    };
                }),
                skipDuplicates: true,
            });
        }
        if (!(await prisma.admin.findFirst())) {
            return await prisma.$transaction(async (tx) => {
                const admin = await tx.admin.create({
                    data: {
                        email: "superadmin@gmail.com",
                        username: "superadmin@gmail.com",
                        password: bcryptService.hashData("123123123"),
                        isActivated: true,
                        name: "Super Admin",
                    },
                });

                await tx.adminRole.create({
                    data: {
                        admin: {
                            connect: {
                                id: admin.id,
                            },
                        },
                        roleType: "SUPER_ADMIN",
                    },
                });
            });
        }
        console.log("Seed data created successfully!");
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

export { seed };
