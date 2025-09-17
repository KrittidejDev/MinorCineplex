interface Cinema {
    name: string;
    address: string;
  }
  
  interface ProvinceCinema {
    province: string;
    cinemas?: Cinema[];
  }
  
 export const cinemaData: ProvinceCinema[] = [
    {
      province: "Bangkok",
      cinemas: [
        {
          name: "Major Cineplex Ratchayothin",
          address: "99 ถนนรัชดาภิเษก แขวงลาดยาว เขตจตุจักร กรุงเทพฯ",
        },
        {
          name: "SF World Cinema CentralWorld",
          address: "ศูนย์การค้าเซ็นทรัลเวิลด์ ถนนพระราม 1 กรุงเทพฯ",
        },
        {
          name: "SF World Cinema Esplanade",
          address: "99 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ",
        }
      ],
    },
    {
      province: "Chaing Mai",
      cinemas: [
        {
          name: "Major Cineplex Central Festival Chiangmai",
          address:
            "99/3 หมู่ 4 ถนนซุปเปอร์ไฮเวย์ เชียงใหม่-ลำปาง อำเภอเมือง เชียงใหม่",
        },
        {
          name: "SF Cinema Maya Chiangmai",
          address: "55 ถนนห้วยแก้ว ตำบลสุเทพ อำเภอเมือง เชียงใหม่",
        },
      ],
    },
    {
      province: "Khon Kaen",
      cinemas: [
        {
          name: "Major Cineplex Central Plaza Khonkaen",
          address: "99 ถนนศรีจันทร์ ตำบลในเมือง อำเภอเมือง ขอนแก่น",
        },
      ],
    },
  ];