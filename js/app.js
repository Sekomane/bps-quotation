function formatDisplayDate(dateValue) {
    if (!dateValue) return '—';

    return new Date(dateValue).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function updateHeader() {
    setText('previewQuoteNumber',
        document.getElementById('quoteNumber').value || '—'
    );

    setText('previewQuoteDate',
        formatDisplayDate(document.getElementById('quoteDate').value)
    );

    setText('previewValidUntil',
        formatDisplayDate(document.getElementById('validUntil').value)
    );

 setText('previewBusinessAddress',
    (document.getElementById('businessAddress').value || '')
        .split(',')
        .map(part => part.trim())
        .join('\n') || '38-17th Avenue\nAlexandra\n2090 Johannesburg'
);

    setText('previewBusinessEmail',
        document.getElementById('businessEmail').value || 'info@bpsmarketing.co.za'
    );

    setText('previewBusinessPhone',
        document.getElementById('businessPhone').value || '079 046 3747'
    );
}
function updateClientDetails() {
    document.getElementById('previewClientName').textContent =
        document.getElementById('clientName').value || '—';

    document.getElementById('previewClientEmail').textContent =
        document.getElementById('clientEmail').value || '—';

    document.getElementById('previewClientPhone').textContent =
        document.getElementById('clientPhone').value || '—';

    document.getElementById('previewClientAddress').textContent =
        document.getElementById('clientAddress').value || '—';
}
function updateItemOrdered() {
    const tbody = document.getElementById('previewItemsBody');

    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-row">No items added yet.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${escapeHtml(item.description)}</td>
            <td>${item.qty}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${formatCurrency(item.qty * item.price)}</td>
        </tr>
    `).join('');
}
function updateTotalAmount() {
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.qty * item.price);
    }, 0);

    const discountPercent = parseFloat(document.getElementById('discount').value) || 0;
    const taxPercent = parseFloat(document.getElementById('tax').value) || 0;

    const discountAmount = subtotal * (discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (taxPercent / 100);
    const grandTotal = afterDiscount + taxAmount;

    document.getElementById('previewSubtotal').textContent =
        formatCurrency(subtotal);

document.getElementById('previewDiscount').textContent =
    formatCurrency(discountAmount);

    document.getElementById('previewTax').textContent =
        formatCurrency(taxAmount);

    document.getElementById('previewGrandTotal').textContent =
        formatCurrency(grandTotal);

    document.getElementById('previewDiscountRow').style.display =
        discountPercent > 0 ? 'flex' : 'none';

    document.getElementById('previewTaxRow').style.display =
        taxPercent > 0 ? 'flex' : 'none';
}
function updateTermsAndConditions() {
    const termsInput = document.getElementById('termsConditions');
    const termsList = document.getElementById('previewTermsConditions');

    if (!termsInput || !termsList) return;

    const lines = termsInput.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    termsList.innerHTML = lines.length
        ? lines.map(line => `<li>${escapeHtml(line.replace(/^\d+\.\s*/, ''))}</li>`).join('')
        : '<li>—</li>';
}
function clearAllFields() {
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('clientAddress').value = '';

    document.getElementById('itemDescription').value = '';
    document.getElementById('itemQty').value = 1;
    document.getElementById('itemPrice').value = 0;

    document.getElementById('discount').value = 0;
    document.getElementById('tax').value = 0;

    document.getElementById('termsConditions').value =
`1. A 50% deposit is required before work begins.
2. The balance is payable before final handover.
3. Client content must be supplied on time to avoid delays.
4. Extra work outside this quotation may be charged separately.`;

    items = [];

    setDefaultQuoteValues();
    renderItemsInputTable();
    renderQuote();
}

window.clearAllFields = clearAllFields;
function updateFooter() {
    document.getElementById('previewBusinessName').textContent =
        document.getElementById('businessName').value || 'BPS Marketing Pty Ltd';
}
function setDefaultQuoteValues() {
    const today = new Date();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // SET TODAY (LOCAL TIME SAFE)
    document.getElementById('quoteDate').value = formatDate(today);

    // SET VALID UNTIL (7 days later)
    const validDate = new Date(today);
    validDate.setDate(validDate.getDate() + 7);
    document.getElementById('validUntil').value = formatDate(validDate);

    // GENERATE QUOTE NUMBER
    const quoteNumber =
        "QT-" +
        today.getFullYear() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0') +
        "-001";

    document.getElementById('quoteNumber').value = quoteNumber;
}
function bindLiveUpdates() {
    document.addEventListener('input', function (e) {
        if (e.target.matches('input, textarea')) {
            renderQuote();
        }
    });

    document.addEventListener('change', function (e) {
        if (e.target.matches('input, textarea')) {
            renderQuote();
        }
    });
}

function init() {
    Promise.all([
        loadComponent("HeaderComponent", "components/header.html"),
        loadComponent("ClientDetailsComponent", "components/ClientDetails.html"),
        loadComponent("ItemOrderedComponent", "components/ItemOrdered.html"),
        loadComponent("TotalAmountComponent", "components/TotalAmount.html"),
        loadComponent("PaymentDetailsComponent", "components/PaymentDetails.html"),
        loadComponent("TermsAndConditionsComponent", "components/TermsAndConditions.html"),
        loadComponent("FooterComponent", "components/Footer.html")
    ])
    .then(function () {
        setDefaultQuoteValues();
        renderQuote();
        bindLiveUpdates();
        renderItemsInputTable();
    })
    .catch(function (error) {
        console.error("Component loading failed:", error);
        alert("Some components failed to load. Check your file paths.");
    });
}

init();

function renderQuote() {
    updateHeader();
    updateClientDetails();
    updateItemOrdered();
    updateTotalAmount();
    updateTermsAndConditions();
    updateFooter();
}