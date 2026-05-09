async function downloadPDF() {

    renderQuote();

    const element = document.getElementById('quotePreview');

    if (!element) {
        alert('Quote preview not found.');
        return;
    }

    const quoteNumber =
        document.getElementById('quoteNumber').value || 'QT-001';

    const pdfContainer = document.createElement('div');

    pdfContainer.style.width = '210mm';
    pdfContainer.style.background = '#ffffff';
    pdfContainer.style.padding = '0';
    pdfContainer.style.margin = '0';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-99999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.overflow = 'hidden';

    const clone = element.cloneNode(true);

    clone.style.width = '210mm';
    clone.style.height = '296mm';
    clone.style.minHeight = '296mm';
    clone.style.padding = '12mm';
    clone.style.margin = '0';
    clone.style.background = '#ffffff';
    clone.style.boxSizing = 'border-box';
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.overflow = 'hidden';

    const footerComponent = clone.querySelector('#FooterComponent');
    if (footerComponent) {
        footerComponent.style.marginTop = 'auto';
        footerComponent.style.paddingTop = '20px';
    }

    const footer = clone.querySelector('.quote-footer');
    if (footer) {
        footer.style.paddingTop = '10px';
        footer.style.marginTop = '0';
    }

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

    pdfContainer.appendChild(clone);
    document.body.appendChild(pdfContainer);

    await new Promise(resolve => setTimeout(resolve, 500));

    await html2pdf()
        .set({
            margin: 0,

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
                width: clone.offsetWidth,
                height: clone.offsetHeight,
                windowWidth: clone.offsetWidth,
                windowHeight: clone.offsetHeight
            },

            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        })
        .from(clone)
        .save();

    document.body.removeChild(pdfContainer);
}

window.downloadPDF = downloadPDF;