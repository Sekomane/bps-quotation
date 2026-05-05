function downloadPDF() {
    renderQuote();

    const element = document.getElementById('quotePreview');

    if (!element) {
        alert('Quote preview not found.');
        return;
    }

    if (typeof html2pdf === 'undefined') {
        alert('html2pdf library is not loading. Check your lib path.');
        return;
    }

    const quoteNumber = document.getElementById('quoteNumber').value || 'QT-001';

    html2pdf()
        .set({
            margin: 0,
            filename: `BPS-Quote-${quoteNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        })
        .from(element)
        .save();
}

window.downloadPDF = downloadPDF;