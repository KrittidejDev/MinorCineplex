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
      },
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

export const seats = [
  // แถว A
  { id: "A1", row: "A", number: 1, status: "available" ,price: 150 },
  { id: "A2", row: "A", number: 2, status: "available" ,price: 150},
  { id: "A3", row: "A", number: 3, status: "available" ,price: 150},
  { id: "A4", row: "A", number: 4, status: "available" ,price: 150},
  { id: "A5", row: "A", number: 5, status: "available" ,price: 150},
  { id: "A6", row: "A", number: 6, status: "available" ,price: 150},
  { id: "A7", row: "A", number: 7, status: "available" ,price: 150},
  { id: "A8", row: "A", number: 8, status: "available" ,price: 150},
  { id: "A9", row: "A", number: 9, status: "available" ,price: 150},
  { id: "A10", row: "A", number: 10, status: "available" ,price: 150},

  // แถว B
  { id: "B1", row: "B", number: 1, status: "available" ,price: 150},
  { id: "B2", row: "B", number: 2, status: "available" ,price: 150},
  { id: "B3", row: "B", number: 3, status: "available" ,price: 150},
  { id: "B4", row: "B", number: 4, status: "available" ,price: 150},
  { id: "B5", row: "B", number: 5, status: "available" ,price: 150},
  { id: "B6", row: "B", number: 6, status: "available" ,price: 150},
  { id: "B7", row: "B", number: 7, status: "available" ,price: 150},
  { id: "B8", row: "B", number: 8, status: "available" ,price: 150},
  { id: "B9", row: "B", number: 9, status: "available" ,price: 150},
  { id: "B10", row: "B", number: 10, status: "available" ,price: 150},

  // แถว C
  { id: "C1", row: "C", number: 1, status: "available" ,price: 150},
  { id: "C2", row: "C", number: 2, status: "available" ,price: 150},
  { id: "C3", row: "C", number: 3, status: "available" ,price: 150},
  { id: "C4", row: "C", number: 4, status: "available" ,price: 150},
  { id: "C5", row: "C", number: 5, status: "unavailable" ,price: 150},
  { id: "C6", row: "C", number: 6, status: "unavailable" ,price: 150},
  { id: "C7", row: "C", number: 7, status: "available" ,price: 150},
  { id: "C8", row: "C", number: 8, status: "available" ,price: 150},
  { id: "C9", row: "C", number: 9, status: "available" ,price: 150},
  { id: "C10", row: "C", number: 10, status: "available" ,price: 150},

  // แถว D
  { id: "D1", row: "D", number: 1, status: "available" ,price: 150},
  { id: "D2", row: "D", number: 2, status: "available" ,price: 150},
  { id: "D3", row: "D", number: 3, status: "available" ,price: 150},
  { id: "D4", row: "D", number: 4, status: "available" ,price: 150},
  { id: "D5", row: "D", number: 5, status: "available" ,price: 150},
  { id: "D6", row: "D", number: 6, status: "unavailable" ,price: 150},
  { id: "D7", row: "D", number: 7, status: "unavailable" ,price: 150},
  { id: "D8", row: "D", number: 8, status: "available" ,price: 150},
  { id: "D9", row: "D", number: 9, status: "available" ,price: 150},
  { id: "D10", row: "D", number: 10, status: "available" ,price: 150},

  // แถว E
  { id: "E1", row: "E", number: 1, status: "available" ,price: 150},
  { id: "E2", row: "E", number: 2, status: "available" ,price: 150},
  { id: "E3", row: "E", number: 3, status: "available" ,price: 150},
  { id: "E4", row: "E", number: 4, status: "available" ,price: 150},
  { id: "E5", row: "E", number: 5, status: "available" ,price: 150},
  { id: "E6", row: "E", number: 6, status: "available" ,price: 150},
  { id: "E7", row: "E", number: 7, status: "reserved" ,price: 150},
  { id: "E8", row: "E", number: 8, status: "reserved" ,price: 150},
  { id: "E9", row: "E", number: 9, status: "reserved" ,price: 150},
  { id: "E10", row: "E", number: 10, status: "reserved" ,price: 150},
];
