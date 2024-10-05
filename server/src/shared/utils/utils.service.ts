import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  generateRandomNumber(length: number = 6): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getThaiCountry(): { [key: string]: string } {
    return {
      'Amnat Charoen': 'อำนาจเจริญ',
      'Ang Thong': 'อ่างทอง',
      Bangkok: 'กรุงเทพมหานคร',
      'Bueng Kan': 'บึงกาฬ',
      'Buri Ram': 'บุรีรัมย์',
      Chachoengsao: 'ฉะเชิงเทรา',
      'Chai Nat': 'ชัยนาท',
      Chaiyaphum: 'ชัยภูมิ',
      Chanthaburi: 'จันทบุรี',
      'Chiang Mai': 'เชียงใหม่',
      'Chiang Rai': 'เชียงราย',
      'Chon Buri': 'ชลบุรี',
      Chumphon: 'ชุมพร',
      Kalasin: 'กาฬสินธุ์',
      'Kamphaeng Phet': 'กำแพงเพชร',
      Kanchanaburi: 'กาญจนบุรี',
      'Khon Kaen': 'ขอนแก่น',
      Krabi: 'กระบี่',
      Lampang: 'ลำปาง',
      Lamphun: 'ลำพูน',
      Loei: 'เลย',
      'Lop Buri': 'ลพบุรี',
      'Mae Hong Son': 'แม่ฮ่องสอน',
      'Maha Sarakham': 'มหาสารคาม',
      Mukdahan: 'มุกดาหาร',
      'Nakhon Nayok': 'นครนายก',
      'Nakhon Pathom': 'นครปฐม',
      'Nakhon Phanom': 'นครพนม',
      'Nakhon Ratchasima': 'นครราชสีมา',
      'Nakhon Sawan': 'นครสวรรค์',
      'Nakhon Si Thammarat': 'นครศรีธรรมราช',
      Nan: 'น่าน',
      Narathiwat: 'นราธิวาส',
      'Nong Bua Lam Phu': 'หนองบัวลำภู',
      'Nong Khai': 'หนองคาย',
      Nonthaburi: 'นนทบุรี',
      'Pathum Thani': 'ปทุมธานี',
      Pattani: 'ปัตตานี',
      Pattaya: 'พัทยา',
      Phangnga: 'พังงา',
      Phatthalung: 'พัทลุง',
      Phayao: 'พะเยา',
      Phetchabun: 'เพชรบูรณ์',
      Phetchaburi: 'เพชรบุรี',
      Phichit: 'พิจิตร',
      Phitsanulok: 'พิษณุโลก',
      'Phra Nakhon Si Ayutthaya': 'พระนครศรีอยุธยา',
      Phrae: 'แพร่',
      Phuket: 'ภูเก็ต',
      'Prachin Buri': 'ปราจีนบุรี',
      'Prachuap Khiri Khan': 'ประจวบคีรีขันธ์',
      Ranong: 'ระนอง',
      Ratchaburi: 'ราชบุรี',
      Rayong: 'ระยอง',
      'Roi Et': 'ร้อยเอ็ด',
      'Sa Kaeo': 'สระแก้ว',
      'Sakon Nakhon': 'สกลนคร',
      'Samut Prakan': 'สมุทรปราการ',
      'Samut Sakhon': 'สมุทรสาคร',
      'Samut Songkhram': 'สมุทรสงคราม',
      Saraburi: 'สระบุรี',
      Satun: 'สตูล',
      'Si Sa Ket': 'ศรีสะเกษ',
      'Sing Buri': 'สิงห์บุรี',
      Songkhla: 'สงขลา',
      Sukhothai: 'สุโขทัย',
      'Suphan Buri': 'สุพรรณบุรี',
      'Surat Thani': 'สุราษฎร์ธานี',
      Surin: 'สุรินทร์',
      Tak: 'ตาก',
      Trang: 'ตรัง',
      Trat: 'ตราด',
      'Ubon Ratchathani': 'อุบลราชธานี',
      'Udon Thani': 'อุดรธานี',
      'Uthai Thani': 'อุทัยธานี',
      Uttaradit: 'อุตรดิตถ์',
      Yala: 'ยะลา',
      Yasothon: 'ยโสธร',
    };
  }
}
