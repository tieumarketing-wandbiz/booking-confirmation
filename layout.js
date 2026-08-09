(function exposeBookingLayout(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.BookingLayout = api;
}(typeof globalThis === 'object' ? globalThis : this, () => {
  const BASE_BODY_HEIGHT = 26;
  const FOOTER_WIDTH_RATIO = 519 / 1254;

  function getSheetGeometry({ bodyHeight = BASE_BODY_HEIGHT, pageWidth = 760, pageHeight = 760 * 1491 / 1055 } = {}) {
    const detailsBodyHeight = Math.max(BASE_BODY_HEIGHT, Number(bodyHeight) || BASE_BODY_HEIGHT);
    const lowerShift = detailsBodyHeight - BASE_BODY_HEIGHT;
    const conditionsBottom = (0.754 * pageHeight) + lowerShift + (0.122 * pageHeight);
    const availableFooterHeight = Math.max(0, pageHeight - conditionsBottom);
    const footerHeightPerWidthPercent = (pageWidth / pageHeight) * FOOTER_WIDTH_RATIO;
    const footerWidth = Math.max(0, Math.min(72, (availableFooterHeight / pageHeight * 100) / footerHeightPerWidthPercent * 0.9));
    const footerHeight = pageWidth * (footerWidth / 100) * FOOTER_WIDTH_RATIO;
    const footerBottom = Math.max(0, (pageHeight - conditionsBottom - footerHeight) / 2);
    const topGap = pageHeight - footerBottom - footerHeight - conditionsBottom;

    return {
      lowerShift,
      detailsBodyHeight,
      footerWidth,
      footerBottom,
      topGap
    };
  }

  return { getSheetGeometry };
}));
