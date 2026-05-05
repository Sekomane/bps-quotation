function calculateTotals() {
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.qty * item.price);
    }, 0);

    const discountPercent = parseFloat(document.getElementById('discount').value) || 0;
    const taxPercent = parseFloat(document.getElementById('tax').value) || 0;

    const discountAmount = subtotal * (discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (taxPercent / 100);
    const grandTotal = afterDiscount + taxAmount;

    return {
        subtotal,
        discountPercent,
        discountAmount,
        taxPercent,
        taxAmount,
        grandTotal
    };
}

function formatCurrency(value) {
    return 'R ' + Number(value || 0).toFixed(2);
}