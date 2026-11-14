module.exports = async (page) => {
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
        caret-color: transparent !important;
      }
      [data-reveal],
      [data-mobile-reveal],
      [data-workflow-card],
      [data-workflow-next-panel] {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
      }
    `,
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
};
