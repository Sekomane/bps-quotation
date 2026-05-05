let items = [];

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function addItem() {
    const descriptionInput = document.getElementById('itemDescription');
    const qtyInput = document.getElementById('itemQty');
    const priceInput = document.getElementById('itemPrice');

    const description = descriptionInput.value.trim();
    const qty = Number(qtyInput.value);
    const price = Number(priceInput.value);

    if (!description || qty <= 0 || price < 0) {
        alert('Please enter item description, quantity and price.');
        return;
    }

    items.push({
        description: description,
        qty: qty,
        price: price
    });

    descriptionInput.value = '';
    qtyInput.value = 1;
    priceInput.value = 0;

    renderItemsInputTable();
    renderQuote();
}

function deleteItem(index) {
    items.splice(index, 1);
    renderItemsInputTable();
    renderQuote();
}

function renderItemsInputTable() {
    const tbody = document.querySelector('#itemsInputTable tbody');

    if (!tbody) return;

    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;color:#64748b;">
                    No items added yet.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map((item, index) => `
        <tr>
            <td>${escapeHtml(item.description)}</td>
            <td>${item.qty}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${formatCurrency(item.qty * item.price)}</td>
            <td>
                <button type="button" class="btn-danger small-btn" onclick="deleteItem(${index})">
                    Remove
                </button>
            </td>
        </tr>
    `).join('');
}

window.addItem = addItem;
window.deleteItem = deleteItem;
window.renderItemsInputTable = renderItemsInputTable;