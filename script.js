// Data Storage
let accounts = JSON.parse(localStorage.getItem('accounts')) || [
    { id: 1, code: '1001', name: 'Cash', type: 'asset', balance: 10000 },
    { id: 2, code: '1002', name: 'Bank Account', type: 'asset', balance: 50000 },
    { id: 3, code: '2001', name: 'Accounts Payable', type: 'liability', balance: 0 },
    { id: 4, code: '3001', name: 'Owner Equity', type: 'equity', balance: 60000 },
    { id: 5, code: '4001', name: 'Sales Revenue', type: 'revenue', balance: 0 },
    { id: 6, code: '5001', name: 'Operating Expenses', type: 'expense', balance: 0 }
];

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
let ledger = JSON.parse(localStorage.getItem('ledger')) || [];

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.closest('.nav-item').classList.add('active');
    
    if (sectionId === 'dashboard') {
        updateDashboard();
    } else if (sectionId === 'ledger') {
        displayLedger();
    } else if (sectionId === 'transactions') {
        displayTransactions();
    } else if (sectionId === 'invoices') {
        displayInvoices();
    } else if (sectionId === 'accounts') {
        displayAccounts();
    }
}

// Account Management
function addAccount() {
    const name = document.getElementById('accountName').value;
    const type = document.getElementById('accountType').value;
    const code = document.getElementById('accountCode').value;
    const balance = parseFloat(document.getElementById('accountBalance').value) || 0;
    
    if (!name || !code) {
        alert('Please fill all required fields');
        return;
    }
    
    const account = {
        id: Date.now(),
        code: code,
        name: name,
        type: type,
        balance: balance
    };
    
    accounts.push(account);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    
    document.getElementById('accountName').value = '';
    document.getElementById('accountCode').value = '';
    document.getElementById('accountBalance').value = '';
    
    displayAccounts();
    updateAccountDropdowns();
    alert('Account added successfully!');
}

function displayAccounts() {
    const container = document.getElementById('accountList');
    
    if (accounts.length === 0) {
        container.innerHTML = '<p class="empty-state">No accounts found</p>';
        return;
    }
    
    container.innerHTML = accounts.map(account => `
        <div class="account-item">
            <div>${account.code}</div>
            <div><strong>${account.name}</strong></div>
            <div class="account-type ${account.type}">${account.type}</div>
            <div>$${account.balance.toLocaleString()}</div>
        </div>
    `).join('');
}

function updateAccountDropdowns() {
    const dropdown = document.getElementById('transactionAccount');
    dropdown.innerHTML = accounts.map(account => 
        `<option value="${account.id}">${account.name} (${account.code})</option>`
    ).join('');
}

// Transaction Management
function addTransaction() {
    const type = document.getElementById('transactionType').value;
    const accountId = parseInt(document.getElementById('transactionAccount').value);
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const description = document.getElementById('transactionDescription').value;
    const date = document.getElementById('transactionDate').value;
    const ref = document.getElementById('transactionRef').value;
    
    if (!amount || !description || !date) {
        alert('Please fill all required fields');
        return;
    }
    
    const account = accounts.find(a => a.id === accountId);
    
    const transaction = {
        id: Date.now(),
        type: type,
        accountId: accountId,
        accountName: account.name,
        amount: amount,
        description: description,
        date: date,
        reference: ref,
        debit: type === 'expense' ? amount : 0,
        credit: type === 'income' ? amount : 0
    };
    
    transactions.push(transaction);
    
    // Update ledger
    ledger.push({
        id: Date.now(),
        date: date,
        account: account.name,
        description: description,
        reference: ref,
        debit: transaction.debit,
        credit: transaction.credit,
        balance: 0 // Will be calculated
    });
    
    // Update account balance
    if (type === 'income') {
        account.balance += amount;
    } else {
        account.balance -= amount;
    }
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('ledger', JSON.stringify(ledger));
    localStorage.setItem('accounts', JSON.stringify(accounts));
    
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionDescription').value = '';
    document.getElementById('transactionRef').value = '';
    
    displayTransactions();
    updateDashboard();
    alert('Transaction added successfully!');
}

function displayTransactions() {
    const container = document.getElementById('transactionHistory');
    
    if (transactions.length === 0) {
        container.innerHTML = '<p class="empty-state">No transactions recorded</p>';
        return;
    }
    
    container.innerHTML = transactions.slice().reverse().map(trans => `
        <div class="transaction-item ${trans.type === 'expense' ? 'debit' : 'credit'}">
            <div>
                <strong>${trans.description}</strong><br>
                <small style="color: var(--text-muted);">${trans.accountName} - ${new Date(trans.date).toLocaleDateString()}</small>
            </div>
            <div>
                <strong style="color: ${trans.type === 'income' ? 'var(--success)' : 'var(--danger)'}">
                    ${trans.type === 'income' ? '+' : '-'}$${trans.amount.toFixed(2)}
                </strong>
            </div>
        </div>
    `).join('');
}

// Invoice Management
function createInvoice() {
    const client = document.getElementById('invoiceClient').value;
    const number = document.getElementById('invoiceNumber').value;
    const amount = parseFloat(document.getElementById('invoiceAmount').value);
    const dueDate = document.getElementById('invoiceDueDate').value;
    const description = document.getElementById('invoiceDescription').value;
    const status = document.getElementById('invoiceStatus').value;
    
    if (!client || !number || !amount || !dueDate) {
        alert('Please fill all required fields');
        return;
    }
    
    const invoice = {
        id: Date.now(),
        client: client,
        number: number,
        amount: amount,
        dueDate: dueDate,
        description: description,
        status: status,
        createdDate: new Date().toISOString()
    };
    
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    document.getElementById('invoiceClient').value = '';
    document.getElementById('invoiceNumber').value = '';
    document.getElementById('invoiceAmount').value = '';
    document.getElementById('invoiceDescription').value = '';
    
    displayInvoices();
    alert('Invoice created successfully!');
}

function displayInvoices() {
    const container = document.getElementById('invoiceList');
    
    if (invoices.length === 0) {
        container.innerHTML = '<p class="empty-state">No invoices created</p>';
        return;
    }
    
    container.innerHTML = invoices.map(invoice => `
        <div class="invoice-item">
            <div class="invoice-header">
                <strong>${invoice.number} - ${invoice.client}</strong>
                <span class="invoice-status ${invoice.status}">${invoice.status.toUpperCase()}</span>
            </div>
            <div style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">
                ${invoice.description}
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Due: ${new Date(invoice.dueDate).toLocaleDateString()}</span>
                <strong style="color: var(--success);">$${invoice.amount.toFixed(2)}</strong>
            </div>
        </div>
    `).join('');
}

// Ledger
function displayLedger() {
    const container = document.getElementById('ledgerTable');
    
    if (ledger.length === 0) {
        container.innerHTML = '<p class="empty-state">No ledger entries</p>';
        return;
    }
    
    let html = `
        <div class="ledger-row header">
            <div>Date</div>
            <div>Description</div>
            <div>Debit</div>
            <div>Credit</div>
            <div>Balance</div>
        </div>
    `;
    
    let runningBalance = 0;
    ledger.forEach(entry => {
        runningBalance += entry.credit - entry.debit;
        html += `
            <div class="ledger-row">
                <div>${new Date(entry.date).toLocaleDateString()}</div>
                <div>${entry.description}</div>
                <div style="color: var(--danger);">${entry.debit > 0 ? '$' + entry.debit.toFixed(2) : '-'}</div>
                <div style="color: var(--success);">${entry.credit > 0 ? '$' + entry.credit.toFixed(2) : '-'}</div>
                <div>$${runningBalance.toFixed(2)}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function filterLedger() {
    // Implement filtering logic
    displayLedger();
}

// Reports
function generateReport(type) {
    const container = document.getElementById('reportContent');
    container.style.display = 'block';
    
    switch(type) {
        case 'balance-sheet':
            generateBalanceSheet(container);
            break;
        case 'profit-loss':
            generateProfitLoss(container);
            break;
        case 'cash-flow':
            generateCashFlow(container);
            break;
        case 'trial-balance':
            generateTrialBalance(container);
            break;
    }
    
    // Scroll to report
    document.getElementById('reportOutput').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateBalanceSheet(container) {
    const assets = accounts.filter(a => a.type === 'asset');
    const liabilities = accounts.filter(a => a.type === 'liability');
    const equity = accounts.filter(a => a.type === 'equity');
    
    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
    const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);
    
    const totalLiabilitiesEquity = totalLiabilities + totalEquity;
    const difference = totalAssets - totalLiabilitiesEquity;
    
    container.innerHTML = `
        <div style="padding: 2rem; background: rgba(15, 23, 42, 0.5); border-radius: 15px;">
            <h2 style="margin-bottom: 1rem; text-align: center; color: var(--primary);">📊 BALANCE SHEET</h2>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 2rem;">
                As of ${new Date().toLocaleDateString()}
            </p>
            
            <table class="report-table">
                <tr><th colspan="2" style="background: rgba(16, 185, 129, 0.3); font-size: 1.1rem;">ASSETS</th></tr>
                ${assets.length > 0 ? assets.map(a => `
                    <tr>
                        <td style="padding-left: 2rem;">${a.name} (${a.code})</td>
                        <td style="text-align: right; color: var(--success);">$${a.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                `).join('') : '<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No assets</td></tr>'}
                <tr style="font-weight: bold; background: rgba(16, 185, 129, 0.4); font-size: 1.1rem;">
                    <td>Total Assets</td>
                    <td style="text-align: right; color: var(--success);">$${totalAssets.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
                
                <tr style="height: 20px;"><td colspan="2"></td></tr>
                
                <tr><th colspan="2" style="background: rgba(239, 68, 68, 0.3); font-size: 1.1rem;">LIABILITIES</th></tr>
                ${liabilities.length > 0 ? liabilities.map(a => `
                    <tr>
                        <td style="padding-left: 2rem;">${a.name} (${a.code})</td>
                        <td style="text-align: right; color: var(--danger);">$${a.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                `).join('') : '<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No liabilities</td></tr>'}
                <tr style="font-weight: bold; background: rgba(239, 68, 68, 0.4); font-size: 1.1rem;">
                    <td>Total Liabilities</td>
                    <td style="text-align: right; color: var(--danger);">$${totalLiabilities.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
                
                <tr style="height: 20px;"><td colspan="2"></td></tr>
                
                <tr><th colspan="2" style="background: rgba(99, 102, 241, 0.3); font-size: 1.1rem;">EQUITY</th></tr>
                ${equity.length > 0 ? equity.map(a => `
                    <tr>
                        <td style="padding-left: 2rem;">${a.name} (${a.code})</td>
                        <td style="text-align: right; color: var(--primary);">$${a.balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                `).join('') : '<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No equity</td></tr>'}
                <tr style="font-weight: bold; background: rgba(99, 102, 241, 0.4); font-size: 1.1rem;">
                    <td>Total Equity</td>
                    <td style="text-align: right; color: var(--primary);">$${totalEquity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
                
                <tr style="height: 20px;"><td colspan="2"></td></tr>
                
                <tr style="font-weight: bold; background: rgba(245, 158, 11, 0.3); font-size: 1.2rem;">
                    <td>Total Liabilities + Equity</td>
                    <td style="text-align: right; color: var(--warning);">$${totalLiabilitiesEquity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
                
                <tr style="font-weight: bold; background: ${difference === 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; font-size: 1.2rem;">
                    <td>Balance Check (Assets - (Liabilities + Equity))</td>
                    <td style="text-align: right; color: ${difference === 0 ? 'var(--success)' : 'var(--danger)'};">
                        $${difference.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        ${difference === 0 ? ' ✓ Balanced' : ' ⚠️ Not Balanced'}
                    </td>
                </tr>
            </table>
        </div>
    `;
}

function generateProfitLoss(container) {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const revenue = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const expenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netProfit = revenue - expenses;
    const profitMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(2) : 0;
    
    // Group by account
    const incomeByAccount = {};
    incomeTransactions.forEach(t => {
        if (!incomeByAccount[t.accountName]) {
            incomeByAccount[t.accountName] = 0;
        }
        incomeByAccount[t.accountName] += t.amount;
    });
    
    const expenseByAccount = {};
    expenseTransactions.forEach(t => {
        if (!expenseByAccount[t.accountName]) {
            expenseByAccount[t.accountName] = 0;
        }
        expenseByAccount[t.accountName] += t.amount;
    });
    
    container.innerHTML = `
        <div style="padding: 2rem; background: rgba(15, 23, 42, 0.5); border-radius: 15px;">
            <h2 style="margin-bottom: 1rem; text-align: center; color: var(--primary);">💹 PROFIT & LOSS STATEMENT</h2>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 2rem;">
                For the period ending ${new Date().toLocaleDateString()}
            </p>
            
            <table class="report-table">
                <tr><th colspan="2" style="background: rgba(16, 185, 129, 0.3); font-size: 1.1rem;">REVENUE / INCOME</th></tr>
                ${Object.keys(incomeByAccount).length > 0 ? Object.entries(incomeByAccount).map(([account, amount]) => `
                    <tr>
                        <td style="padding-left: 2rem;">${account}</td>
                        <td style="text-align: right; color: var(--success);">$${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                `).join('') : '<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No income recorded</td></tr>'}
                <tr style="font-weight: bold; background: rgba(16, 185, 129, 0.4); font-size: 1.1rem;">
                    <td>Total Revenue</td>
                    <td style="text-align: right; color: var(--success);">$${revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
                
                <tr style="height: 20px;"><td colspan="2"></td></tr>
                
                <tr><th colspan="2" style="background: rgba(239, 68, 68, 0.3); font-size: 1.1rem;">EXPENSES</th></tr>
                ${Object.keys(expenseByAccount).length > 0 ? Object.entries(expenseByAccount).map(([account, amount]) => `
                    <tr>
                        <td style="padding-left: 2rem;">${account}</td>
                        <td style="text-align: right; color: var(--danger);">$${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                `).join('') : '<tr><td colspan="2" style="text-align: center; color: var(--text-muted);">No expenses recorded</td></tr>'}
                <tr style="font-weight: bold; background: rgba(239, 68, 68, 0.4); font-size: 1.1rem;">
                    <td>Total Expenses</td>
                    <td style="text-align: right; color: var(--danger);">$${expenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
                
                <tr style="height: 20px;"><td colspan="2"></td></tr>
                
                <tr style="font-weight: bold; background: ${netProfit >= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}; font-size: 1.3rem;">
                    <td>${netProfit >= 0 ? '✓ NET PROFIT' : '✗ NET LOSS'}</td>
                    <td style="text-align: right; color: ${netProfit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-size: 1.5rem;">
                        ${netProfit >= 0 ? '+' : ''}$${netProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                </tr>
                
                <tr style="background: rgba(99, 102, 241, 0.2);">
                    <td>Profit Margin</td>
                    <td style="text-align: right; color: var(--primary); font-weight: bold;">${profitMargin}%</td>
                </tr>
            </table>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: ${netProfit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 10px; border: 2px solid ${netProfit >= 0 ? 'var(--success)' : 'var(--danger)'};">
                <h3 style="margin-bottom: 1rem; color: ${netProfit >= 0 ? 'var(--success)' : 'var(--danger)'};">
                    ${netProfit >= 0 ? '🎉 Congratulations!' : '⚠️ Attention Required'}
                </h3>
                <p style="font-size: 1.1rem;">
                    ${netProfit >= 0 
                        ? `Your business generated a profit of <strong>$${netProfit.toLocaleString()}</strong> with a ${profitMargin}% profit margin.`
                        : `Your business has a loss of <strong>$${Math.abs(netProfit).toLocaleString()}</strong>. Consider reviewing expenses.`
                    }
                </p>
            </div>
        </div>
    `;
}

function generateCashFlow(container) {
    const cashInflows = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const cashOutflows = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = cashInflows - cashOutflows;
    
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">Cash Flow Statement</h2>
        <table class="report-table">
            <tr><th colspan="2">Cash Flow Analysis</th></tr>
            <tr><td>Cash Inflows</td><td style="color: var(--success);">$${cashInflows.toLocaleString()}</td></tr>
            <tr><td>Cash Outflows</td><td style="color: var(--danger);">$${cashOutflows.toLocaleString()}</td></tr>
            <tr style="font-weight: bold; background: rgba(99, 102, 241, 0.2);">
                <td>Net Cash Flow</td>
                <td style="color: ${netCashFlow >= 0 ? 'var(--success)' : 'var(--danger)'}">
                    $${netCashFlow.toLocaleString()}
                </td>
            </tr>
        </table>
    `;
}

function generateTrialBalance(container) {
    const totalDebit = ledger.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = ledger.reduce((sum, e) => sum + e.credit, 0);
    const difference = Math.abs(totalDebit - totalCredit);
    const isBalanced = difference < 0.01; // Allow for rounding errors
    
    container.innerHTML = `
        <div style="padding: 2rem; background: rgba(15, 23, 42, 0.5); border-radius: 15px;">
            <h2 style="margin-bottom: 1rem; text-align: center; color: var(--primary);">⚖️ TRIAL BALANCE</h2>
            <p style="text-align: center; color: var(--text-muted); margin-bottom: 2rem;">
                As of ${new Date().toLocaleDateString()}
            </p>
            
            <table class="report-table">
                <tr style="background: rgba(99, 102, 241, 0.3);">
                    <th style="text-align: left;">Account Code</th>
                    <th style="text-align: left;">Account Name</th>
                    <th style="text-align: right;">Debit</th>
                    <th style="text-align: right;">Credit</th>
                </tr>
                ${accounts.map(account => {
                    const accountTransactions = transactions.filter(t => t.accountId === account.id);
                    const debit = accountTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                    const credit = accountTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                    
                    if (debit === 0 && credit === 0) return '';
                    
                    return `<tr>
                        <td>${account.code}</td>
                        <td>${account.name}</td>
                        <td style="text-align: right; color: ${debit > 0 ? 'var(--danger)' : 'var(--text-muted)'};">
                            ${debit > 0 ? '$' + debit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}
                        </td>
                        <td style="text-align: right; color: ${credit > 0 ? 'var(--success)' : 'var(--text-muted)'};">
                            ${credit > 0 ? '$' + credit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}
                        </td>
                    </tr>`;
                }).join('')}
                
                ${accounts.every(account => {
                    const accountTransactions = transactions.filter(t => t.accountId === account.id);
                    const debit = accountTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                    const credit = accountTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                    return debit === 0 && credit === 0;
                }) ? '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No transactions recorded yet</td></tr>' : ''}
                
                <tr style="height: 10px;"><td colspan="4"></td></tr>
                
                <tr style="font-weight: bold; background: rgba(99, 102, 241, 0.4); font-size: 1.2rem;">
                    <td colspan="2">TOTAL</td>
                    <td style="text-align: right; color: var(--danger);">
                        $${totalDebit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td style="text-align: right; color: var(--success);">
                        $${totalCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                </tr>
                
                <tr style="font-weight: bold; background: ${isBalanced ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; font-size: 1.1rem;">
                    <td colspan="2">Difference</td>
                    <td colspan="2" style="text-align: right; color: ${isBalanced ? 'var(--success)' : 'var(--danger)'};">
                        $${difference.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        ${isBalanced ? ' ✓ Balanced' : ' ⚠️ Not Balanced'}
                    </td>
                </tr>
            </table>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: ${isBalanced ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border-radius: 10px; border: 2px solid ${isBalanced ? 'var(--success)' : 'var(--danger)'};">
                <h3 style="margin-bottom: 1rem; color: ${isBalanced ? 'var(--success)' : 'var(--danger)'};">
                    ${isBalanced ? '✓ Books are Balanced' : '⚠️ Books are Not Balanced'}
                </h3>
                <p style="font-size: 1rem;">
                    ${isBalanced 
                        ? 'Your trial balance is correct. Total debits equal total credits, indicating proper double-entry bookkeeping.'
                        : `There is a difference of $${difference.toLocaleString()} between debits and credits. Please review your transactions.`
                    }
                </p>
            </div>
        </div>
    `;
}

// Dashboard
function updateDashboard() {
    const revenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netProfit = revenue - expenses;
    const cashBalance = accounts.filter(a => a.type === 'asset').reduce((sum, a) => sum + a.balance, 0);
    
    document.getElementById('totalRevenue').textContent = `$${revenue.toLocaleString()}`;
    document.getElementById('totalExpenses').textContent = `$${expenses.toLocaleString()}`;
    document.getElementById('netProfit').textContent = `$${netProfit.toLocaleString()}`;
    document.getElementById('cashBalance').textContent = `$${cashBalance.toLocaleString()}`;
    
    document.getElementById('totalInvoices').textContent = invoices.length;
    document.getElementById('pendingPayments').textContent = `$${invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}`;
    document.getElementById('totalAccounts').textContent = accounts.length;
    document.getElementById('monthlyProfit').textContent = `$${netProfit.toLocaleString()}`;
    
    // Recent transactions
    const recentContainer = document.getElementById('recentTransactions');
    if (transactions.length === 0) {
        recentContainer.innerHTML = '<p class="empty-state">No transactions yet</p>';
    } else {
        const recent = transactions.slice(-5).reverse();
        recentContainer.innerHTML = recent.map(trans => `
            <div class="transaction-item ${trans.type === 'expense' ? 'debit' : 'credit'}">
                <div>
                    <strong>${trans.description}</strong><br>
                    <small style="color: var(--text-muted);">${new Date(trans.date).toLocaleDateString()}</small>
                </div>
                <strong style="color: ${trans.type === 'income' ? 'var(--success)' : 'var(--danger)'}">
                    ${trans.type === 'income' ? '+' : '-'}$${trans.amount.toFixed(2)}
                </strong>
            </div>
        `).join('');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateAccountDropdowns();
    updateDashboard();
    displayAccounts();
    displayTransactions();
    displayInvoices();
    displayLedger();
    
    document.getElementById('transactionDate').valueAsDate = new Date();
    document.getElementById('invoiceDueDate').valueAsDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
});
