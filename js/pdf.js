async function downloadPDF() {

    renderQuote();

    const element = document.getElementById('quotePreview');

    if (!element) {
        alert('Quote preview not found.');
        return;
    }

    const quoteNumber =
        document.getElementById('quoteNumber').value || 'QT-001';

    // ─────────────────────────────────────────
    // CREATE TEMP CONTAINER
    // ─────────────────────────────────────────
    const pdfContainer = document.createElement('div');

    pdfContainer.style.width = '210mm';
    pdfContainer.style.background = '#ffffff';
    pdfContainer.style.padding = '0';
    pdfContainer.style.margin = '0 auto';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-99999px';
    pdfContainer.style.top = '0';

    // ─────────────────────────────────────────
    // CLONE THE QUOTE
    // ─────────────────────────────────────────
    const clone = element.cloneNode(true);

    clone.style.width = '190mm';
    clone.style.minHeight = 'auto';
    clone.style.height = 'auto';
    clone.style.padding = '14mm';
    clone.style.margin = '0 auto';
    clone.style.background = '#ffffff';
    clone.style.boxSizing = 'border-box';
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.overflow = 'visible';

    // ─────────────────────────────────────────
    // FORCE DESKTOP LAYOUTS
    // ─────────────────────────────────────────
    const headerTop = clone.querySelector('.header-top');

    if (headerTop) {
        headerTop.style.display = 'grid';
        headerTop.style.gridTemplateColumns = '70px 1fr auto';
        headerTop.style.gap = '14px';
    }

    const quoteMeta = clone.querySelector('.quote-meta');

    if (quoteMeta) {
        quoteMeta.style.textAlign = 'right';
        quoteMeta.style.whiteSpace = 'nowrap';
    }

    const headerContact = clone.querySelector('.header-contact');

    if (headerContact) {
        headerContact.style.display = 'flex';
        headerContact.style.flexDirection = 'row';
        headerContact.style.justifyContent = 'space-between';
    }

    const contactRight = clone.querySelector('.contact-right');

    if (contactRight) {
        contactRight.style.textAlign = 'right';
    }

    const clientCard = clone.querySelector('.client-card');

    if (clientCard) {
        clientCard.style.display = 'grid';
        clientCard.style.gridTemplateColumns = '1fr 1fr';
    }

    const paymentGrid = clone.querySelector('.payment-grid');

    if (paymentGrid) {
        paymentGrid.style.display = 'grid';
        paymentGrid.style.gridTemplateColumns = '1fr 1fr';
    }

    const amountSummary = clone.querySelector('.amount-summary');

    if (amountSummary) {
        amountSummary.style.width = '260px';
    }

    // ─────────────────────────────────────────
    // APPEND TEMP ELEMENT
    // ─────────────────────────────────────────
    pdfContainer.appendChild(clone);

    document.body.appendChild(pdfContainer);

    // ─────────────────────────────────────────
    // WAIT FOR FULL RENDER
    // ─────────────────────────────────────────
    await new Promise(resolve => setTimeout(resolve, 500));

    // ─────────────────────────────────────────
    // GET HEIGHT
    // ─────────────────────────────────────────
    const contentHeight = clone.scrollHeight;

    const pageHeight =
        Math.max(
            297,
            (contentHeight * 0.264583) + 10
        );

    // ─────────────────────────────────────────
    // GENERATE PDF
    // ─────────────────────────────────────────
    await html2pdf()
        .set({

            margin: 5,

            filename: `BPS-Quote-${quoteNumber}.pdf`,

            image: {
                type: 'jpeg',
                quality: 1
            },

            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0,
                width: clone.scrollWidth,
                height: clone.scrollHeight
            },

            jsPDF: {
                unit: 'mm',
                format: [210, pageHeight],
                orientation: 'portrait'
            },

            pagebreak: {
                mode: ['avoid-all']
            }

        })
        .from(clone)
        .save();

    // ─────────────────────────────────────────
    // CLEANUP
    // ─────────────────────────────────────────
    document.body.removeChild(pdfContainer);
}

window.downloadPDF = downloadPDF;