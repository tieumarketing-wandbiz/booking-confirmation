(function exposeBookingLayout(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.BookingLayout = api;
}(typeof globalThis === 'object' ? globalThis : this, () => {
  const BASE_BODY_HEIGHT = 26;
  const FOOTER_WIDTH_RATIO = 519 / 1254;
  const CONDITIONS_TOP_RATIO = 0.769;
  const CONDITIONS_HEIGHT_RATIO = 0.122;

  function getSheetGeometry({ bodyHeight = BASE_BODY_HEIGHT, pageWidth = 760, pageHeight = 760 * 1491 / 1055 } = {}) {
    const detailsBodyHeight = Math.max(BASE_BODY_HEIGHT, Number(bodyHeight) || BASE_BODY_HEIGHT);
    const lowerShift = detailsBodyHeight - BASE_BODY_HEIGHT;
    const conditionsBottom = (CONDITIONS_TOP_RATIO * pageHeight) + lowerShift + (CONDITIONS_HEIGHT_RATIO * pageHeight);
    const availableFooterHeight = Math.max(0, pageHeight - conditionsBottom);
    const footerHeightPerWidthPercent = (pageWidth / pageHeight) * FOOTER_WIDTH_RATIO;
    const footerWidth = Math.max(0, Math.min(72, (availableFooterHeight / pageHeight * 100) / footerHeightPerWidthPercent * 0.9));
    const footerHeight = pageWidth * (footerWidth / 100) * FOOTER_WIDTH_RATIO;
    const footerBottom = Math.max(0, (pageHeight - conditionsBottom - footerHeight) / 2);
    const footerTop = pageHeight - footerBottom - footerHeight;
    const topGap = footerTop - conditionsBottom;

    return {
      lowerShift,
      detailsBodyHeight,
      conditionsBottom,
      footerWidth,
      footerBottom,
      footerTop,
      topGap
    };
  }

  return { getSheetGeometry };
}));
