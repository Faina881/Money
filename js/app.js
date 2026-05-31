// Cashflow 101 PWA Application

class CashflowApp {
    constructor() {
        this.currentSession = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initCustomMultiselect();
        this.updateCalculations();
        this.loadSessionList();
        this.registerServiceWorker();
    }

    initCustomMultiselect() {
        const multiselects = document.querySelectorAll('.custom-multiselect');
        
        multiselects.forEach(multiselect => {
            const trigger = multiselect.querySelector('.multiselect-trigger');
            const options = multiselect.querySelector('.multiselect-options');
            const optionElements = multiselect.querySelectorAll('.multiselect-option');
            
            // Toggle dropdown
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = options.classList.contains('show');
                
                // Close all other dropdowns
                document.querySelectorAll('.multiselect-options.show').forEach(opt => {
                    opt.classList.remove('show');
                    opt.closest('.custom-multiselect').querySelector('.multiselect-trigger').classList.remove('active');
                });
                
                if (!isOpen) {
                    options.classList.add('show');
                    trigger.classList.add('active');
                }
            });
            
            // Handle option selection
            optionElements.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Remove selected class from all options
                    optionElements.forEach(opt => opt.classList.remove('selected'));
                    
                    // Add selected class to clicked option
                    option.classList.add('selected');
                    
                    // Update trigger text
                    trigger.textContent = option.textContent;
                    trigger.style.color = '#333';
                    trigger.classList.add('active');

                    // Close dropdown
                    options.classList.remove('show');
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!multiselect.contains(e.target)) {
                    options.classList.remove('show');
                }
            });
        });
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('SW registration failed:', err));
        }
    }

    bindEvents() {
        // Universal placeholder hide on focus / restore on blur
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' && e.target.placeholder) {
                e.target._savedPlaceholder = e.target.placeholder;
                e.target.placeholder = '';
            }
        });
        document.addEventListener('focusout', (e) => {
            if (e.target.tagName === 'INPUT' && e.target._savedPlaceholder) {
                e.target.placeholder = e.target._savedPlaceholder;
            }
        });

        // Auto-calculate on any input change (number inputs) + focus/blur zero clear
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('focus', () => {
                if (input.value === '0') input.value = '';
            });
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.value = '0';
                    this.updateCalculations();
                }
            });
            input.addEventListener('input', () => this.updateCalculations());
        });

        // Validation for income fields: positive only, max 10 digits, text type
        document.querySelectorAll('.income-field').forEach(input => {
            input.addEventListener('focus', () => {
                if (input.value === '0') input.value = '';
            });
            input.addEventListener('blur', () => {
                const hasConfirmBtn = input.nextElementSibling && input.nextElementSibling.classList.contains('btn-confirm');
                if (!hasConfirmBtn && (input.value === '' || input.value === '0')) {
                    input.value = '0';
                    this.updateCalculations();
                }
            });
            input.addEventListener('keydown', (e) => {
                const forbidden = ['-', '+', 'e', 'E', '.', ','];
                if (forbidden.includes(e.key)) {
                    e.preventDefault();
                }
                // Block if already 10 chars and not a control key
                const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
                if (!controlKeys.includes(e.key) && input.value.replace(/[^0-9]/g, '').length >= 10) {
                    const isDigit = /^[0-9]$/.test(e.key);
                    if (isDigit) e.preventDefault();
                }
            });
            input.addEventListener('input', () => {
                let val = input.value.replace(/[^0-9]/g, '');
                if (val.length > 10) val = val.slice(0, 10);
                input.value = val;
                this.updateCalculations();
            });
        });

        // Validation for qty-input: max 8 digits (event delegation for dynamic rows)
        document.addEventListener('keydown', (e) => {
            if (!e.target.classList.contains('qty-input')) return;
            const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
            if (controlKeys.includes(e.key)) return;
            if (!/^[0-9]$/.test(e.key)) { e.preventDefault(); return; }
            if (String(e.target.value).replace(/[^0-9]/g, '').length >= 8) e.preventDefault();
        });
        document.addEventListener('input', (e) => {
            if (!e.target.classList.contains('qty-input')) return;
            let val = String(e.target.value).replace(/[^0-9]/g, '').slice(0, 8);
            e.target.value = val || '0';
        });

        // Validation for price-input: max 3 digits (event delegation for dynamic rows)
        document.addEventListener('keydown', (e) => {
            if (!e.target.classList.contains('price-input')) return;
            const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
            if (controlKeys.includes(e.key)) return;
            if (!/^[0-9]$/.test(e.key)) { e.preventDefault(); return; }
            if (String(e.target.value).replace(/[^0-9]/g, '').length >= 3) e.preventDefault();
        });
        document.addEventListener('input', (e) => {
            if (!e.target.classList.contains('price-input')) return;
            let val = String(e.target.value).replace(/[^0-9]/g, '').slice(0, 3);
            e.target.value = val || '0';
        });

        // Validation for childCount: only 1 digit 0-9
        const childCountEl = document.getElementById('childCount');
        if (childCountEl) {
            childCountEl.addEventListener('focus', () => {
                if (childCountEl.value === '0') childCountEl.value = '';
            });
            childCountEl.addEventListener('blur', () => {
                if (childCountEl.value === '') {
                    childCountEl.value = '0';
                    this.updateCalculations();
                }
            });
            childCountEl.addEventListener('keydown', (e) => {
                const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                if (controlKeys.includes(e.key)) return;
                if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                    return;
                }
                // Replace current value with new digit (max 1 char)
                e.preventDefault();
                childCountEl.value = e.key;
                this.updateCalculations();
            });
            childCountEl.addEventListener('input', () => {
                let val = childCountEl.value.replace(/[^0-9]/g, '');
                childCountEl.value = val.slice(0, 1) || '0';
                this.updateCalculations();
            });
        }

        // Validation for bankLoanDebt: digits only, max 6 chars
        const bankLoanDebtEl = document.getElementById('bankLoanDebt');
        if (bankLoanDebtEl) {
            bankLoanDebtEl.addEventListener('focus', () => {
                if (bankLoanDebtEl.value === '0') bankLoanDebtEl.value = '';
            });
            bankLoanDebtEl.addEventListener('blur', () => {
                if (bankLoanDebtEl.value === '') bankLoanDebtEl.value = '0';
                this.updateCalculations();
            });
            bankLoanDebtEl.addEventListener('keydown', (e) => {
                const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
                if (controlKeys.includes(e.key)) return;
                if (!/^[0-9]$/.test(e.key)) { e.preventDefault(); return; }
                if (bankLoanDebtEl.value.replace(/[^0-9]/g, '').length >= 10) { e.preventDefault(); }
            });
            bankLoanDebtEl.addEventListener('input', () => {
                let val = bankLoanDebtEl.value.replace(/[^0-9]/g, '').slice(0, 10);
                bankLoanDebtEl.value = val;
                this.updateCalculations();
            });
        }

        // Validation for mortgageDebt: digits only, max 10 chars
        const mortgageDebtEl = document.getElementById('mortgageDebt');
        if (mortgageDebtEl) {
            mortgageDebtEl.addEventListener('focus', () => {
                if (mortgageDebtEl.value === '0') mortgageDebtEl.value = '';
            });
            mortgageDebtEl.addEventListener('blur', () => {
                if (mortgageDebtEl.value === '') mortgageDebtEl.value = '0';
                this.updateCalculations();
            });
            mortgageDebtEl.addEventListener('keydown', (e) => {
                const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
                if (controlKeys.includes(e.key)) return;
                if (!/^[0-9]$/.test(e.key)) { e.preventDefault(); return; }
                if (mortgageDebtEl.value.replace(/[^0-9]/g, '').length >= 10) { e.preventDefault(); }
            });
            mortgageDebtEl.addEventListener('input', () => {
                let val = mortgageDebtEl.value.replace(/[^0-9]/g, '').slice(0, 10);
                mortgageDebtEl.value = val;
                this.updateCalculations();
            });
        }

        // Current balance block
        this._currentBalance = 0;
        const balanceInput = document.getElementById('balanceInput');
        const balanceDisplay = document.getElementById('currentBalance');
        const balanceEditBtn = document.getElementById('balanceEditBtn');

        this.updateBalanceDisplay = () => {
            balanceDisplay.value = new Intl.NumberFormat('ru-RU').format(this._currentBalance);
            balanceDisplay.classList.toggle('negative', this._currentBalance < 0);
        };

        // Edit balance with confirmation
        balanceEditBtn?.addEventListener('click', () => {
            balanceDisplay.readOnly = false;
            balanceDisplay.classList.add('editable');
            balanceDisplay.focus();
            balanceDisplay.select();
        });

        // Validate balance input: digits only, max 10
        balanceDisplay?.addEventListener('keydown', (e) => {
            if (balanceDisplay.readOnly) return;
            const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
            if (controlKeys.includes(e.key)) return;
            if (!/^[0-9-]$/.test(e.key)) { e.preventDefault(); return; }
            if (balanceDisplay.value.replace(/[^0-9-]/g, '').length >= 10) e.preventDefault();
        });

        balanceDisplay?.addEventListener('input', (e) => {
            if (balanceDisplay.readOnly) return;
            let val = balanceDisplay.value.replace(/[^0-9-]/g, '').slice(0, 10);
            balanceDisplay.value = val;
        });

        balanceDisplay?.addEventListener('blur', () => {
            if (!balanceDisplay.readOnly) {
                const val = parseInt(balanceDisplay.value.replace(/[^0-9-]/g, '')) || 0;
                if (val === this._currentBalance) {
                    balanceDisplay.readOnly = true;
                    balanceDisplay.classList.remove('editable');
                    this.updateBalanceDisplay();
                    return;
                }
                this._pendingBalanceEdit = val;
                document.getElementById('confirmFieldTitle').textContent = 'Текущий баланс';
                document.getElementById('confirmFieldValue').textContent = new Intl.NumberFormat('ru-RU').format(val);
                document.getElementById('confirmFieldModal').style.display = 'block';
            }
        });

        // Validate balanceInput: digits only, max 10
        if (balanceInput) {
            // Initially disable buttons
            document.getElementById('balancePlus').disabled = true;
            document.getElementById('balanceMinus').disabled = true;

            balanceInput.addEventListener('focus', () => {
                if (balanceInput.value === '0') balanceInput.value = '';
            });
            balanceInput.addEventListener('blur', () => {
                if (balanceInput.value === '') balanceInput.value = '';
            });
            balanceInput.addEventListener('keydown', (e) => {
                const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
                if (controlKeys.includes(e.key)) return;
                if (!/^[0-9]$/.test(e.key)) { e.preventDefault(); return; }
                if (balanceInput.value.replace(/[^0-9]/g, '').length >= 10) e.preventDefault();
            });
            balanceInput.addEventListener('input', () => {
                let val = balanceInput.value.replace(/[^0-9]/g, '').slice(0, 10);
                balanceInput.value = val;

                // Enable/disable +/- buttons based on input
                const hasValue = val && val !== '0';
                document.getElementById('balancePlus').disabled = !hasValue;
                document.getElementById('balanceMinus').disabled = !hasValue;
            });
        }

        document.getElementById('balancePlus')?.addEventListener('click', () => {
            const val = parseInt(balanceInput.value) || 0;
            if (val === 0) return;
            this._currentBalance += val;
            balanceInput.value = '';
            document.getElementById('balancePlus').disabled = true;
            document.getElementById('balanceMinus').disabled = true;
            this.updateBalanceDisplay();
        });

        document.getElementById('balanceMinus')?.addEventListener('click', () => {
            const val = parseInt(balanceInput.value) || 0;
            if (val === 0) return;
            this._currentBalance -= val;
            balanceInput.value = '';
            document.getElementById('balancePlus').disabled = true;
            document.getElementById('balanceMinus').disabled = true;
            this.updateBalanceDisplay();
        });

        document.getElementById('balanceDelta')?.addEventListener('click', () => {
            const deltaEl = document.getElementById('monthlyCashFlow');
            const deltaVal = parseInt(deltaEl?.textContent?.replace(/[^0-9-]/g, '')) || 0;
            if (deltaVal === 0) return;
            this._currentBalance += deltaVal;
            this.updateBalanceDisplay();
        });

        // Add row buttons
        document.querySelectorAll('.add-row').forEach(btn => {
            btn.addEventListener('click', (e) => this.addRow(e.target.dataset.table));
        });

        // Validate add-row buttons for realEstateIncome, businessIncome, stocks
        const validateAddRowBtn = (tableId) => {
            const table = document.getElementById(tableId);
            if (!table) return;
            const inputRow = table.querySelector('.input-row');
            const multiselect = inputRow.querySelector('.custom-multiselect');
            const incomeInput = inputRow.querySelector('.income-val');
            const qtyInput = inputRow.querySelector('.qty-input');
            const priceInput = inputRow.querySelector('.price-input');
            const addBtn = inputRow.querySelector('.add-row');

            const hasSelection = multiselect && multiselect.querySelector('.multiselect-trigger.active');
            const hasIncome = incomeInput && incomeInput.value && incomeInput.value !== '0' && incomeInput.value !== '';
            const hasQty = qtyInput && qtyInput.value && qtyInput.value !== '0' && qtyInput.value !== '';
            const hasPrice = priceInput && priceInput.value && priceInput.value !== '0' && priceInput.value !== '';

            let isValid = false;
            if (tableId === 'stocks') {
                isValid = hasSelection && hasQty && hasPrice;
            } else {
                isValid = hasSelection && hasIncome;
            }

            if (addBtn) addBtn.disabled = !isValid;
        };

        ['realEstateIncome', 'businessIncome', 'stocks'].forEach(tableId => {
            const table = document.getElementById(tableId);
            if (!table) return;

            // Validate on any input change or click
            table.addEventListener('input', (e) => {
                validateAddRowBtn(tableId);
            });
            table.addEventListener('change', (e) => {
                validateAddRowBtn(tableId);
            });
            table.addEventListener('click', (e) => {
                setTimeout(() => validateAddRowBtn(tableId), 50);
            });

            // Add specific listeners for qty and price inputs
            table.querySelectorAll('.qty-input, .price-input').forEach(input => {
                input.addEventListener('focus', () => {
                    if (input.value === '0') input.value = '';
                });
                input.addEventListener('blur', () => {
                    if (input.value === '') input.value = '0';
                });
                input.addEventListener('input', () => {
                    validateAddRowBtn(tableId);
                });
            });

            validateAddRowBtn(tableId);
        });

        // Save/Load/Delete buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.showSaveModal());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadSession());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSession());
        document.getElementById('confirmSave').addEventListener('click', () => this.saveGame());
        
        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('saveModal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('saveModal')) {
                document.getElementById('saveModal').style.display = 'none';
            }
        });

        // Confirm-lock fields
        this.setupConfirmLockField('salary', 'salaryConfirmBtn', 'Зарплата');
        this.setupConfirmLockField('perChildExpense', 'perChildConfirmBtn', 'Расходы на одного ребёнка');
        this.setupConfirmLockField('otherExpenses', 'otherExpensesConfirmBtn', 'Расходы на жизнь');
        this.setupConfirmLockField('savings', 'savingsConfirmBtn', 'Сбережения');
        this.setupConfirmLockField('mortgagePayment', 'mortgagePaymentConfirmBtn', 'Выплата по ипотеке');

        // Confirm field modal buttons
        document.getElementById('confirmFieldOk').addEventListener('click', () => this.onConfirmFieldOk());
        document.getElementById('confirmFieldCancel').addEventListener('click', () => this.onConfirmFieldCancel());
    }

    setupConfirmLockField(inputId, btnId, label) {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if (!input || !btn) return;

        const showConfirm = () => {
            const val = input.value.trim();
            if (!val || val === '0' || val === '') return;
            this._pendingLockField = { inputId, btnId, label };
            document.getElementById('confirmFieldTitle').textContent = label;
            document.getElementById('confirmFieldValue').textContent = val;
            document.getElementById('confirmFieldModal').style.display = 'block';
        };

        input.addEventListener('blur', () => {
            if (input.readOnly) return;
            setTimeout(showConfirm, 150);
        });

        btn.addEventListener('click', () => {
            const val = input.value.trim();
            if (!val || val === '0' || val === '') {
                alert('Введите значение больше 0');
                return;
            }
            showConfirm();
        });
    }

    onConfirmFieldOk() {
        document.getElementById('confirmFieldModal').style.display = 'none';

        // Handle balance edit
        if (this._pendingBalanceEdit !== undefined) {
            this._currentBalance = this._pendingBalanceEdit;
            this._pendingBalanceEdit = undefined;
            const balanceDisplay = document.getElementById('currentBalance');
            balanceDisplay.readOnly = true;
            balanceDisplay.classList.remove('editable');
            this.updateBalanceDisplay();
            return;
        }

        // Handle field lock
        if (!this._pendingLockField) return;
        const { inputId, btnId } = this._pendingLockField;
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        input.readOnly = true;
        input.classList.add('locked');
        btn.style.display = 'none';
        this._pendingLockField = null;
        this.updateCalculations();
    }

    onConfirmFieldCancel() {
        document.getElementById('confirmFieldModal').style.display = 'none';

        // Handle balance edit cancel
        if (this._pendingBalanceEdit !== undefined) {
            this._pendingBalanceEdit = undefined;
            const balanceDisplay = document.getElementById('currentBalance');
            balanceDisplay.readOnly = true;
            balanceDisplay.classList.remove('editable');
            this.updateBalanceDisplay();
            return;
        }

        // Handle field lock cancel
        if (!this._pendingLockField) return;
        const { inputId } = this._pendingLockField;
        const input = document.getElementById(inputId);
        input.focus();
        input.select();
        this._pendingLockField = null;
    }

    addRow(tableId) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        const inputRow = tbody.querySelector('.input-row');
        
        // Get values from input row
        let values = [];
        
        if (tableId === 'realEstateIncome' || tableId === 'businessIncome') {
            // Handle custom multiselect for real estate and business
            const selectedOption = inputRow.querySelector('.multiselect-option.selected');
            values[0] = selectedOption ? selectedOption.dataset.value : '';

            // Get currency input value
            const currencyInput = inputRow.querySelector('.currency-input');
            values[1] = currencyInput ? currencyInput.value : '0';
        } else if (tableId === 'stocks') {
            // Handle custom multiselect for stocks
            const selectedOption = inputRow.querySelector('.multiselect-option.selected');
            values[0] = selectedOption ? selectedOption.dataset.value : '';

            const qtyInput = inputRow.querySelector('.qty-input');
            values[1] = qtyInput ? qtyInput.value : '0';

            const priceInput = inputRow.querySelector('.price-input');
            values[2] = priceInput ? priceInput.value : '0';
        } else {
            // Handle regular inputs for other tables
            const inputs = inputRow.querySelectorAll('input');
            values = Array.from(inputs).map(inp => inp.value);
        }
        
        // Check if we have data to add
        if (!values[0] && values.slice(1).every(v => !v || v === '0')) {
            return; // Don't add empty rows
        }

        // Create data row
        const newRow = document.createElement('tr');
        newRow.className = 'data-row';
        
        if (tableId === 'stocks') {
            newRow.innerHTML = `
                <td class="item-name">${values[0]}</td>
                <td class="item-value">${values[1]}</td>
                <td class="item-value">${this.formatCurrency(values[2])}</td>
                <td><button class="btn-icon remove" onclick="this.closest('tr').remove(); app.updateCalculations();">×</button></td>
            `;
        } else if (tableId === 'realEstateLiabilities') {
            newRow.innerHTML = `
                <td class="item-name">${values[0]}</td>
                <td class="item-value">${this.formatCurrency(values[1])}</td>
                <td><button class="btn-icon remove" onclick="this.closest('tr').remove(); app.updateCalculations();">×</button></td>
            `;
        } else {
            newRow.innerHTML = `
                <td class="item-name">${values[0]}</td>
                <td class="item-value">${this.formatCurrency(values[1])}</td>
                <td><button class="btn-icon remove" onclick="this.closest('tr').remove(); app.updateCalculations();">×</button></td>
            `;
        }

        // Insert before input row
        tbody.insertBefore(newRow, inputRow);
        
        // Clear input row
        if (tableId === 'realEstateIncome' || tableId === 'businessIncome' || tableId === 'stocks') {
            const selectedOption = inputRow.querySelector('.multiselect-option.selected');
            if (selectedOption) {
                selectedOption.classList.remove('selected');
            }
            const trigger = inputRow.querySelector('.multiselect-trigger');
            if (trigger) {
                const defaultText = tableId === 'realEstateIncome' ? 'Выберите недвижимость' :
                                   tableId === 'businessIncome' ? 'Выберите бизнес' :
                                   tableId === 'stocks' ? 'Выберите акцию' : '';
                trigger.textContent = defaultText;
                trigger.style.color = '#666';
                trigger.classList.remove('active');
            }
            const currencyInput = inputRow.querySelector('.currency-input');
            if (currencyInput) {
                currencyInput.value = '0';
            }
            const qtyInput = inputRow.querySelector('.qty-input');
            if (qtyInput) {
                qtyInput.value = '0';
            }
            const priceInput = inputRow.querySelector('.price-input');
            if (priceInput) {
                priceInput.value = '0';
            }
        } else {
            const inputs = inputRow.querySelectorAll('input');
            inputs.forEach(inp => inp.value = inp.type === 'number' ? '0' : '');
        }

        // Force validation after clearing
        setTimeout(() => {
            const table = document.getElementById(tableId);
            if (table) {
                const inputRow = table.querySelector('.input-row');
                const multiselect = inputRow.querySelector('.custom-multiselect');
                const incomeInput = inputRow.querySelector('.income-val');
                const qtyInput = inputRow.querySelector('.qty-input');
                const priceInput = inputRow.querySelector('.price-input');
                const addBtn = inputRow.querySelector('.add-row');

                const hasSelection = multiselect && multiselect.querySelector('.multiselect-trigger.active');
                const hasIncome = incomeInput && incomeInput.value && incomeInput.value !== '0' && incomeInput.value !== '';
                const hasQty = qtyInput && qtyInput.value && qtyInput.value !== '0' && qtyInput.value !== '';
                const hasPrice = priceInput && priceInput.value && priceInput.value !== '0' && priceInput.value !== '';

                let isValid = false;
                if (tableId === 'stocks') {
                    isValid = hasSelection && hasQty && hasPrice;
                } else {
                    isValid = hasSelection && hasIncome;
                }

                if (addBtn) addBtn.disabled = !isValid;
            }
        }, 10);

        // Re-validate add button
        const validateAddRowBtn = (tableId) => {
            const table = document.getElementById(tableId);
            if (!table) return;
            const inputRow = table.querySelector('.input-row');
            const multiselect = inputRow.querySelector('.custom-multiselect');
            const incomeInput = inputRow.querySelector('.income-val');
            const qtyInput = inputRow.querySelector('.qty-input');
            const priceInput = inputRow.querySelector('.price-input');
            const addBtn = inputRow.querySelector('.add-row');

            const hasSelection = multiselect && multiselect.querySelector('.multiselect-trigger.active');
            const hasIncome = incomeInput && incomeInput.value && incomeInput.value !== '0';
            const hasQty = qtyInput && qtyInput.value && qtyInput.value !== '0';
            const hasPrice = priceInput && priceInput.value && priceInput.value !== '0';

            let isValid = false;
            if (tableId === 'stocks') {
                isValid = hasSelection && hasQty && hasPrice;
            } else {
                isValid = hasSelection && hasIncome;
            }

            if (addBtn) addBtn.disabled = !isValid;
        };
        validateAddRowBtn(tableId);

        this.updateCalculations();
    }

    getNumberValue(id) {
        const el = document.getElementById(id);
        return el ? parseFloat(el.value) || 0 : 0;
    }

    getTableSum(tableId, valueClass = 'income-val') {
        const table = document.getElementById(tableId);
        if (!table) return 0;

        let sum = 0;

        // Sum only from data rows (ignore input row)
        table.querySelectorAll('.data-row .item-value').forEach(cell => {
            const text = cell.textContent.replace(/[^\d.-]/g, '');
            sum += parseFloat(text) || 0;
        });

        return sum;
    }

    updateCalculations() {
        // Calculate incomes
        const salary = this.getNumberValue('salary');
        const realEstateIncome = this.getTableSum('realEstateIncome', 'income-val');
        const businessIncome = this.getTableSum('businessIncome', 'income-val');
        
        const passiveIncome = realEstateIncome + businessIncome;
        const totalIncome = salary + passiveIncome;
        
        // Auto-fill bank loan payment = 10% of bank loan debt
        const bankDebt = this.getNumberValue('bankLoanDebt');
        const bankPayment = Math.round(bankDebt * 0.1);
        const bankPaymentEl = document.getElementById('bankLoanPayment');
        if (bankPaymentEl) bankPaymentEl.value = bankPayment;

        // Auto-fill childExpenses = childCount * perChildExpense
        const childCount = parseInt(document.getElementById('childCount')?.value) || 0;
        const perChild = this.getNumberValue('perChildExpense');
        const childExpenses = childCount * perChild;
        const childExpensesEl = document.getElementById('childExpenses');
        if (childExpensesEl) childExpensesEl.value = childExpenses;

        // Calculate expenses
        const expenses = 
            this.getNumberValue('mortgagePayment') +
            this.getNumberValue('otherExpenses') +
            childExpenses +
            bankPayment;
        
        const monthlyCashFlow = totalIncome - expenses;
        
        // Update display
        document.getElementById('passiveIncome').textContent = this.formatCurrency(passiveIncome);
        document.getElementById('totalIncome').textContent = this.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(expenses);
        
        const cashFlowEl = document.getElementById('monthlyCashFlow');
        cashFlowEl.textContent = this.formatCurrency(monthlyCashFlow);
        cashFlowEl.classList.toggle('negative', monthlyCashFlow < 0);

        const deltaOnBtn = document.getElementById('deltaValueOnBtn');
        if (deltaOnBtn) {
            deltaOnBtn.textContent = monthlyCashFlow !== 0 ? `(${new Intl.NumberFormat('ru-RU').format(monthlyCashFlow)})` : '';
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    collectData() {
        const data = {
            playerName: (document.getElementById('playerName') || {}).value || '',
            salary: this.getNumberValue('salary'),
            savings: this.getNumberValue('savings'),
            perChildExpense: this.getNumberValue('perChildExpense'),
            expenses: {
                mortgagePayment: this.getNumberValue('mortgagePayment'),
                educationPayment: this.getNumberValue('educationPayment'),
                carPayment: this.getNumberValue('carPayment'),
                creditCardPayment: this.getNumberValue('creditCardPayment'),
                smallLoanPayment: this.getNumberValue('smallLoanPayment'),
                taxes: this.getNumberValue('taxes'),
                otherExpenses: this.getNumberValue('otherExpenses'),
                childExpenses: this.getNumberValue('childExpenses'),
                bankLoanPayment: this.getNumberValue('bankLoanPayment')
            },
            liabilities: {
                mortgageDebt: this.getNumberValue('mortgageDebt'),
                educationDebt: this.getNumberValue('educationDebt'),
                carDebt: this.getNumberValue('carDebt'),
                creditCardDebt: this.getNumberValue('creditCardDebt'),
                smallLoanDebt: this.getNumberValue('smallLoanDebt'),
                bankLoanDebt: this.getNumberValue('bankLoanDebt')
            },
            realEstateIncome: this.collectTableData('realEstateIncome'),
            businessIncome: this.collectTableData('businessIncome'),
            stocks: this.collectStocksData(),
            realEstateLiabilities: this.collectTableData('realEstateLiabilities'),
            timestamp: new Date().toISOString()
        };
        return data;
    }

    collectTableData(tableId) {
        const table = document.getElementById(tableId);
        const rows = [];
        
        table.querySelectorAll('.data-row').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (tableId === 'realEstateLiabilities') {
                rows.push({
                    name: cells[0].textContent,
                    mortgage: parseFloat(cells[1].textContent.replace(/[^\d.-]/g, '')) || 0
                });
            } else {
                rows.push({
                    name: cells[0].textContent,
                    value: parseFloat(cells[1].textContent.replace(/[^\d.-]/g, '')) || 0
                });
            }
        });
        
        return rows;
    }

    collectStocksData() {
        const table = document.getElementById('stocks');
        const rows = [];
        
        table.querySelectorAll('.data-row').forEach(row => {
            const cells = row.querySelectorAll('td');
            rows.push({
                name: cells[0].textContent,
                quantity: parseInt(cells[1].textContent) || 0,
                price: parseFloat(cells[2].textContent.replace(/[^\d.-]/g, '')) || 0
            });
        });
        
        return rows;
    }

    showSaveModal() {
        const select = document.getElementById('sessionSelect');
        const nameInput = document.getElementById('saveName');
        nameInput.value = select.value ? select.value : `Игра ${new Date().toLocaleDateString('ru-RU')}`;
        document.getElementById('saveModal').style.display = 'block';
    }

    saveGame() {
        const name = document.getElementById('saveName').value.trim();
        if (!name) {
            alert('Введите название сохранения');
            return;
        }
        
        const data = this.collectData();
        const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
        sessions[name] = data;
        localStorage.setItem('cashflow_sessions', JSON.stringify(sessions));
        
        this.currentSession = name;
        this.loadSessionList();
        document.getElementById('sessionSelect').value = name;
        document.getElementById('saveModal').style.display = 'none';
        
        alert('Игра сохранена!');
    }

    loadSessionList() {
        const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
        const select = document.getElementById('sessionSelect');
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">Новая игра</option>';
        Object.keys(sessions).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
        
        if (currentValue && sessions[currentValue]) {
            select.value = currentValue;
        }
    }

    loadSession() {
        const name = document.getElementById('sessionSelect').value;
        if (!name) {
            alert('Выберите сохранение для загрузки');
            return;
        }
        
        const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
        const data = sessions[name];
        
        if (!data) {
            alert('Сохранение не найдено');
            return;
        }
        
        this.restoreData(data);
        this.currentSession = name;
        alert('Игра загружена!');
    }

    restoreData(data) {
        // Restore simple fields
        if (data.playerName !== undefined) { const pn = document.getElementById('playerName'); if (pn) pn.value = data.playerName; }
        if (data.salary !== undefined) document.getElementById('salary').value = data.salary;
        if (data.savings !== undefined) document.getElementById('savings').value = data.savings;
        if (data.perChildExpense !== undefined) document.getElementById('perChildExpense').value = data.perChildExpense;
        
        // Restore expenses
        if (data.expenses) {
            Object.entries(data.expenses).forEach(([key, value]) => {
                const el = document.getElementById(key);
                if (el) el.value = value;
            });
        }
        
        // Restore liabilities
        if (data.liabilities) {
            Object.entries(data.liabilities).forEach(([key, value]) => {
                const el = document.getElementById(key);
                if (el) el.value = value;
            });
        }
        
        // Clear and restore table data
        this.clearTable('realEstateIncome');
        this.clearTable('businessIncome');
        this.clearTable('stocks');
        this.clearTable('realEstateLiabilities');
        
        if (data.realEstateIncome) {
            data.realEstateIncome.forEach(item => this.addDataRow('realEstateIncome', item));
        }
        if (data.businessIncome) {
            data.businessIncome.forEach(item => this.addDataRow('businessIncome', item));
        }
        if (data.stocks) {
            data.stocks.forEach(item => this.addStockRow(item));
        }
        if (data.realEstateLiabilities) {
            data.realEstateLiabilities.forEach(item => this.addRealEstateLiabilityRow(item));
        }
        
        this.updateCalculations();
    }

    clearTable(tableId) {
        const table = document.getElementById(tableId);
        table.querySelectorAll('.data-row').forEach(row => row.remove());
    }

    addDataRow(tableId, item) {
        const table = document.getElementById(tableId);
        const tbody = table.querySelector('tbody');
        const inputRow = tbody.querySelector('.input-row');
        
        const newRow = document.createElement('tr');
        newRow.className = 'data-row';
        newRow.innerHTML = `
            <td class="item-name">${item.name}</td>
            <td class="item-value">${this.formatCurrency(item.value)}</td>
            <td><button class="btn-icon remove" onclick="this.closest('tr').remove(); app.updateCalculations();">×</button></td>
        `;
        tbody.insertBefore(newRow, inputRow);
    }

    addStockRow(item) {
        const table = document.getElementById('stocks');
        const tbody = table.querySelector('tbody');
        const inputRow = tbody.querySelector('.input-row');
        
        const newRow = document.createElement('tr');
        newRow.className = 'data-row';
        newRow.innerHTML = `
            <td class="item-name">${item.name}</td>
            <td class="item-value">${item.quantity}</td>
            <td class="item-value">${this.formatCurrency(item.price)}</td>
            <td><button class="btn-icon remove" onclick="this.closest('tr').remove(); app.updateCalculations();">×</button></td>
        `;
        tbody.insertBefore(newRow, inputRow);
    }

    addRealEstateLiabilityRow(item) {
        const table = document.getElementById('realEstateLiabilities');
        const tbody = table.querySelector('tbody');
        const inputRow = tbody.querySelector('.input-row');
        
        const newRow = document.createElement('tr');
        newRow.className = 'data-row';
        newRow.innerHTML = `
            <td class="item-name">${item.name}</td>
            <td class="item-value">${this.formatCurrency(item.mortgage)}</td>
            <td><button class="btn-icon remove" onclick="this.closest('tr').remove(); app.updateCalculations();">×</button></td>
        `;
        tbody.insertBefore(newRow, inputRow);
    }

    deleteSession() {
        const name = document.getElementById('sessionSelect').value;
        if (!name) {
            alert('Выберите сохранение для удаления');
            return;
        }
        
        if (!confirm(`Удалить сохранение "${name}"?`)) {
            return;
        }
        
        const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
        delete sessions[name];
        localStorage.setItem('cashflow_sessions', JSON.stringify(sessions));
        
        this.currentSession = null;
        this.loadSessionList();
        alert('Сохранение удалено');
    }
}

// Initialize app
const app = new CashflowApp();
