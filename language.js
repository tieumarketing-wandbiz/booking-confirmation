(function exposeLocales(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.BookingLocales = api;
}(typeof globalThis === 'object' ? globalThis : this, () => {
  const locales = {
    en: {
      documentLanguage: 'en',
      title: 'BOOKING CONFIRMATION',
      greeting: 'Dear Ms/Mr,',
      introThanks: 'Thank you for choosing La Do Homestay for your upcoming stay.',
      introConfirm: 'We are pleased to confirm your reservation as follows:',
      bookingHeading: 'BOOKING INFORMATION',
      guestName: 'Guest Name:',
      nights: 'Number of Nights:',
      checkinDate: 'Check-in Date:',
      checkoutDate: 'Check-out Date:',
      checkinTime: 'Check-in Time:',
      checkoutTime: 'Check-out Time:',
      detailsHeading: 'DETAILS',
      tableNo: 'No.',
      tableRooms: 'No. of<br>Rooms',
      tableGuests: 'Guest List',
      tableRoomType: 'Room Type',
      tablePackage: 'Package',
      tableGuestCount: 'No. of<br>Guests',
      tableRate: 'Room Rate<br>(VND)',
      tableExtraBed: 'Extra<br>Bed',
      total: 'Total (VND):',
      deposit: 'Deposit &amp; Payment:',
      deposited: 'Customer has deposited',
      conditionsHeading: 'PACKAGE &amp; BOOKING CONDITIONS',
      services: 'Included Services',
      policy: 'Cancellation Policy',
      adults: 'adults',
      footerTitle: 'Thank you &amp; Best regards!',
      footerBody: 'We look forward to welcoming you and hope you have a wonderful stay with us in Sapa.',
      footerSignoff: 'See you in Sapa! ♡'
    },
    vi: {
      documentLanguage: 'vi',
      title: 'XÁC NHẬN ĐẶT PHÒNG',
      greeting: 'Kính gửi Quý khách,',
      introThanks: 'Cảm ơn Quý khách đã lựa chọn Lá Đỏ Homestay cho kỳ nghỉ sắp tới.',
      introConfirm: 'Chúng tôi vui mừng xác nhận đặt phòng của Quý khách như sau:',
      bookingHeading: 'THÔNG TIN ĐẶT PHÒNG',
      guestName: 'Tên khách:',
      nights: 'Số đêm:',
      checkinDate: 'Ngày nhận phòng:',
      checkoutDate: 'Ngày trả phòng:',
      checkinTime: 'Giờ nhận phòng:',
      checkoutTime: 'Giờ trả phòng:',
      detailsHeading: 'CHI TIẾT',
      tableNo: 'STT',
      tableRooms: 'Số<br>phòng',
      tableGuests: 'Danh sách<br>khách',
      tableRoomType: 'Loại phòng',
      tablePackage: 'Gói dịch vụ',
      tableGuestCount: 'Số<br>khách',
      tableRate: 'Giá phòng<br>(VNĐ)',
      tableExtraBed: 'Giường<br>phụ',
      total: 'Tổng cộng (VNĐ):',
      deposit: 'Đặt cọc &amp; Thanh toán:',
      deposited: 'Khách đã đặt cọc',
      conditionsHeading: 'GÓI DỊCH VỤ &amp; ĐIỀU KIỆN ĐẶT PHÒNG',
      services: 'Dịch vụ bao gồm',
      policy: 'Chính sách hủy phòng',
      adults: 'người lớn',
      footerTitle: 'Trân trọng cảm ơn!',
      footerBody: 'Chúng tôi mong được đón tiếp Quý khách và chúc Quý khách có một kỳ nghỉ tuyệt vời tại Sapa.',
      footerSignoff: 'Hẹn gặp lại tại Sapa! ♡'
    }
  };

  function getLocale(language) {
    return locales[language] || locales.en;
  }

  return { getLocale };
}));
