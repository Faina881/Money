// Cashflow 101 PWA Application

class CashflowApp {
    constructor() {
        this.currentSession = null;
        this._isRestoring = false;
        this._goalCelebrated = false;
        this.init();
    }

    init() {
        this._isRestoring = true;
        this.bindEvents();
        this.initCustomMultiselect();
        this.loadSessionList();
        this.restoreAutosave();
        this.registerServiceWorker();
        this._isRestoring = false;
        this.updateCalculations();
        this.updateGameAreaLock();
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
                    opt.style.position = '';
                    opt.style.top = '';
                    opt.style.left = '';
                    opt.style.width = '';
                    opt.closest('.custom-multiselect').querySelector('.multiselect-trigger').classList.remove('active');
                });

                if (!isOpen) {
                    options.classList.add('show');
                    trigger.classList.add('active');

                    // Position options as fixed to escape stacking contexts
                    const rect = trigger.getBoundingClientRect();
                    options.style.position = 'fixed';
                    options.style.top = (rect.bottom + 2) + 'px';
                    options.style.left = rect.left + 'px';
                    options.style.width = rect.width + 'px';
                    options.style.zIndex = '9999';
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
                    trigger.dataset.selected = option.dataset.value;
                    trigger.style.color = '#333';
                    trigger.classList.add('has-value');
                    trigger.classList.add('active');

                    // If this is the profession select dropdown, handle profession-specific logic
                    if (multiselect.classList.contains('profession-select')) {
                        this.handleProfessionSelect(option.dataset.value);
                        trigger.classList.add('locked');
                        trigger.style.pointerEvents = 'none';
                        this.updateGameAreaLock();
                    }

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

    handleProfessionSelect(profession) {
        if (profession === 'IT-специалист') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '13200');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '400');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '202000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '640');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '1900');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '7750');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Предприниматель') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '7500');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '400');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '115000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '380');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '1100');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '4320');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Бариста') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '3100');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '200');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '46000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '180');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '400');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '1990');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Блогер') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '5600');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '300');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '78000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '270');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '700');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '3180');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Гид') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '4200');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '250');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '62000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '220');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '550');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '2480');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Массажист') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '4800');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '250');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '71000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '250');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '640');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '2810');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Психолог') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '6500');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '350');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '92000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '310');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '850');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '3750');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Тренер') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '4500');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '250');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '65000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '230');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '580');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '2620');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        } else if (profession === 'Преподаватель йоги') {
            this.lockFieldIfPossible('salary', 'salaryConfirmBtn', '3800');
            this.lockFieldIfPossible('savings', 'savingsConfirmBtn', '200');
            this.lockFieldIfPossible('mortgageDebt', 'mortgageDebtConfirmBtn', '55000');
            this.lockFieldIfPossible('perChildExpense', 'perChildConfirmBtn', '200');
            this.lockFieldIfPossible('mortgagePayment', 'mortgagePaymentConfirmBtn', '480');
            this.lockFieldIfPossible('otherExpenses', 'otherExpensesConfirmBtn', '2250');
            this.updateCalculations();
            this.setCurrentBalanceFromSavings();
        }
        this.triggerAutoSaveIfReady();
    }

    triggerAutoSaveIfReady() {
        if (!this.arePlayerDetailsFilled()) return;
        const playerName = document.getElementById('playerName')?.value.trim();
        if (!playerName) return;
        const now = new Date();
        const date = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}`;
        const sessionName = `${playerName}_${date}`;
        const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
        sessions[sessionName] = this.collectData();
        localStorage.setItem('cashflow_sessions', JSON.stringify(sessions));
        this.currentSession = sessionName;
        this.loadSessionList();
        this.autoSave();
    }

    setCurrentBalanceFromSavings() {
        const savingsInput = document.getElementById('savings');
        const monthlyCashFlowEl = document.getElementById('monthlyCashFlow');
        const savings = parseInt(savingsInput?.value?.replace(/[^0-9-]/g, '')) || 0;
        const monthlyCashFlow = parseInt(monthlyCashFlowEl?.textContent?.replace(/[^0-9-]/g, '')) || 0;
        this._currentBalance = savings + monthlyCashFlow;
        if (typeof this.updateBalanceDisplay === 'function') {
            this.updateBalanceDisplay();
        }
        const balanceOkBtn = document.getElementById('balanceOkBtn');
        const balanceEditBtn = document.getElementById('balanceEditBtn');
        const balanceDisplay = document.getElementById('currentBalance');
        if (balanceOkBtn) balanceOkBtn.style.display = 'none';
        if (balanceEditBtn) balanceEditBtn.style.display = '';
        if (balanceDisplay) {
            balanceDisplay.readOnly = true;
            balanceDisplay.classList.remove('editable');
        }
    }

    lockFieldIfPossible(inputId, btnId, value) {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if (!input) return;
        
        input.value = value;
        
        // If there's a confirm button in HTML, lock it
        if (btn) {
            input.readOnly = true;
            input.classList.add('locked');
            btn.style.display = 'none';
            
            const editBtn = document.getElementById(inputId + 'EditBtn');
            if (editBtn) editBtn.style.display = '';
        }
    }

    changeChildCount(delta) {
        const el = document.getElementById('childCount');
        if (!el) return;
        let val = parseInt(el.textContent) || 0;
        val = Math.min(4, Math.max(0, val + delta));
        el.textContent = val;
        this.updateChildCountButtons();
        this.updateCalculations();
        this.autoSave();
    }

    updateChildCountButtons() {
        const el = document.getElementById('childCount');
        if (!el) return;
        const val = parseInt(el.textContent) || 0;
        const minus = document.getElementById('childCountMinus');
        const plus = document.getElementById('childCountPlus');
        if (minus) minus.disabled = val <= 0;
        if (plus) plus.disabled = val >= 4;
    }

    updateGameAreaLock() {
        const locked = !this.arePlayerDetailsFilled();
        document.querySelectorAll('.form-grid, .balance-block').forEach(el => {
            el.classList.toggle('not-ready', locked);
        });
    }

    arePlayerDetailsFilled() {
        const playerNameInput = document.getElementById('playerName');
        const playerProfessionTrigger = document.getElementById('playerProfession');
        return Boolean(
            playerNameInput &&
            playerNameInput.value.trim() &&
            playerProfessionTrigger &&
            playerProfessionTrigger.dataset.selected
        );
    }

    isPlayerDetailsElement(element) {
        return Boolean(element.id === 'playerName' || element.closest('.profession-select, .session-controls, #saveModal, #confirmFieldModal'));
    }

    showPlayerDetailsRequiredMessage() {
        alert('Сначала заполните имя и выберите профессию.');
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('SW registration failed:', err));
        }
    }

    bindEvents() {
        document.addEventListener('pointerdown', (e) => {
            const protectedElement = e.target.closest('input, button, .multiselect-trigger, .multiselect-option');
            const protectedGameArea = protectedElement && protectedElement.closest('.form-grid, .balance-block');
            const isReadonlyInput = protectedElement && protectedElement.tagName === 'INPUT' && protectedElement.readOnly;
            if (!protectedElement || !protectedGameArea || this.isPlayerDetailsElement(protectedElement) || this.arePlayerDetailsFilled()) return;
            if (isReadonlyInput) return;
            e.preventDefault();
            const playerNameInput = document.getElementById('playerName');
            const playerProfessionTrigger = document.getElementById('playerProfession');
            if (playerNameInput && !playerNameInput.value.trim()) {
                playerNameInput.focus();
            } else if (playerProfessionTrigger) {
                playerProfessionTrigger.click();
            }
        });

        // Validation for playerName: letters, spaces, and hyphens only
        const playerNameInput = document.getElementById('playerName');
        if (playerNameInput) {
            playerNameInput.addEventListener('input', () => {
                playerNameInput.value = playerNameInput.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');
            });
            playerNameInput.addEventListener('blur', () => {
                if (playerNameInput.value.trim()) {
                    playerNameInput.readOnly = true;
                    playerNameInput.classList.add('locked');
                    if (this.arePlayerDetailsFilled()) this.autoSave();
                }
                this.updateGameAreaLock();
            });
        }

        const saveNameInput = document.getElementById('saveName');
        if (saveNameInput) {
            saveNameInput.addEventListener('input', () => {
                let val = saveNameInput.value.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, '');
                if (val.length > 35) val = val.slice(0, 35);
                saveNameInput.value = val;
            });
        }

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
            // Re-validate stocks add button
            const inputRow = e.target.closest('.input-row');
            if (inputRow) {
                const table = inputRow.closest('table');
                if (table && table.id === 'stocks') {
                    const addBtn = inputRow.querySelector('.add-row');
                    const multiselect = inputRow.querySelector('.custom-multiselect');
                    const qtyInput = inputRow.querySelector('.qty-input');
                    const priceInput = inputRow.querySelector('.price-input');
                    const hasSelection = multiselect && multiselect.querySelector('.multiselect-trigger.active');
                    const hasQty = qtyInput && qtyInput.value && qtyInput.value !== '0';
                    const hasPrice = priceInput && priceInput.value && priceInput.value !== '0';
                    if (addBtn) addBtn.disabled = !(hasSelection && hasQty && hasPrice);
                }
            }
        });

        // Validation for qty-input: trigger stocks button validation
        document.addEventListener('input', (e) => {
            if (!e.target.classList.contains('qty-input')) return;
            const inputRow = e.target.closest('.input-row');
            if (inputRow) {
                const table = inputRow.closest('table');
                if (table && table.id === 'stocks') {
                    const addBtn = inputRow.querySelector('.add-row');
                    const multiselect = inputRow.querySelector('.custom-multiselect');
                    const qtyInput = inputRow.querySelector('.qty-input');
                    const priceInput = inputRow.querySelector('.price-input');
                    const hasSelection = multiselect && multiselect.querySelector('.multiselect-trigger.active');
                    const hasQty = qtyInput && qtyInput.value && qtyInput.value !== '0';
                    const hasPrice = priceInput && priceInput.value && priceInput.value !== '0';
                    if (addBtn) addBtn.disabled = !(hasSelection && hasQty && hasPrice);
                }
            }
        });

        // Validation for mortgage-input (real estate liabilities): digits only, max 10 chars
        document.addEventListener('keydown', (e) => {
            if (!e.target.classList.contains('mortgage-input')) return;
            const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
            if (controlKeys.includes(e.key)) return;
            if (!/^[0-9]$/.test(e.key)) { e.preventDefault(); return; }
            if (String(e.target.value).replace(/[^0-9]/g, '').length >= 10) e.preventDefault();
        });
        document.addEventListener('input', (e) => {
            if (!e.target.classList.contains('mortgage-input')) return;
            let val = String(e.target.value).replace(/[^0-9]/g, '').slice(0, 10);
            e.target.value = val || '0';
        });

        // Counter buttons state init
        this.updateChildCountButtons();

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
            if (!this._isRestoring) {
                balanceDisplay.classList.remove('pulse');
                void balanceDisplay.offsetWidth;
                balanceDisplay.classList.add('pulse');
            }
            this.autoSave();
        };

        // Edit balance with confirmation
        const balanceOkBtn = document.getElementById('balanceOkBtn');
        balanceEditBtn?.addEventListener('click', () => {
            balanceDisplay.readOnly = false;
            balanceDisplay.classList.add('editable');
            balanceDisplay.focus();
            balanceDisplay.select();
            balanceEditBtn.style.display = 'none';
            if (balanceOkBtn) balanceOkBtn.style.display = '';
        });

        // Prevent blur-modal when clicking OK
        balanceOkBtn?.addEventListener('mousedown', (e) => e.preventDefault());
        balanceOkBtn?.addEventListener('click', () => {
            const val = parseInt(balanceDisplay.value.replace(/[^0-9-]/g, '')) || 0;
            this._currentBalance = val;
            balanceDisplay.readOnly = true;
            balanceDisplay.classList.remove('editable');
            balanceOkBtn.style.display = 'none';
            if (balanceEditBtn) balanceEditBtn.style.display = '';
            this.updateBalanceDisplay();
        });

        // Validate balance input: digits only, max 10
        balanceDisplay?.addEventListener('keydown', (e) => {
            if (balanceDisplay.readOnly) return;
            const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
            if (controlKeys.includes(e.key)) return;
            if (!/^[0-9]$/.test(e.key)) { e.preventDefault(); return; }
            if (balanceDisplay.value.replace(/[^0-9]/g, '').length >= 10) e.preventDefault();
        });

        balanceDisplay?.addEventListener('input', (e) => {
            if (balanceDisplay.readOnly) return;
            let val = balanceDisplay.value.replace(/[^0-9]/g, '').slice(0, 10);
            balanceDisplay.value = val;
        });

        balanceDisplay?.addEventListener('blur', () => {
            if (!balanceDisplay.readOnly) {
                const val = parseInt(balanceDisplay.value.replace(/[^0-9-]/g, '')) || 0;
                this._currentBalance = val;
                balanceDisplay.readOnly = true;
                balanceDisplay.classList.remove('editable');
                if (balanceOkBtn) balanceOkBtn.style.display = 'none';
                if (balanceEditBtn) balanceEditBtn.style.display = '';
                this.updateBalanceDisplay();
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
            if (this._currentBalance - val < 0) {
                alert(`Баланс не может быть отрицательным. Текущий баланс: ${new Intl.NumberFormat('ru-RU').format(this._currentBalance)}`);
                return;
            }
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

        document.getElementById('extraOpsToggle')?.addEventListener('click', () => {
            const block = document.getElementById('extraOpsBlock');
            const btn = document.getElementById('extraOpsToggle');
            if (!block) return;
            const isOpen = block.style.display !== 'none';
            block.style.display = isOpen ? 'none' : 'flex';
            btn.textContent = isOpen ? 'Доп. операции ▾' : 'Доп. операции ▴';
        });

        document.getElementById('balanceFired')?.addEventListener('click', () => {
            const expensesEl = document.getElementById('totalExpenses');
            const expensesAmount = parseInt(expensesEl?.textContent?.replace(/[^0-9]/g, '')) || 0;
            if (expensesAmount === 0) return;
            if (this._currentBalance - expensesAmount < 0) {
                alert(`Недостаточно средств. Текущий баланс: ${new Intl.NumberFormat('ru-RU').format(this._currentBalance)}`);
                return;
            }
            this._currentBalance -= expensesAmount;
            this.updateBalanceDisplay();
        });

        document.getElementById('balanceCharity')?.addEventListener('click', () => {
            const totalIncomeEl = document.getElementById('totalIncome');
            const totalIncome = parseInt(totalIncomeEl?.textContent?.replace(/[^0-9]/g, '')) || 0;
            const charityAmount = Math.round(totalIncome * 0.1);
            if (charityAmount === 0) return;
            if (this._currentBalance - charityAmount < 0) {
                alert(`Недостаточно средств. Текущий баланс: ${new Intl.NumberFormat('ru-RU').format(this._currentBalance)}`);
                return;
            }
            this._currentBalance -= charityAmount;
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
        const sessionSelect = document.getElementById('sessionSelect');
        if (sessionSelect) {
            let lastValue = sessionSelect.value;
            sessionSelect.addEventListener('focus', () => {
                lastValue = sessionSelect.value;
            });
            sessionSelect.addEventListener('change', () => {
                const newValue = sessionSelect.value;
                if (newValue === '') {
                    this.startNewGame();
                    lastValue = '';
                } else {
                    lastValue = newValue;
                    this.loadSession();
                }
            });
        }

        document.getElementById('saveBtn').addEventListener('click', () => {
            if (this.currentSession) {
                const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
                sessions[this.currentSession] = this.collectData();
                localStorage.setItem('cashflow_sessions', JSON.stringify(sessions));
                this.autoSave();
                alert(`Сохранено: ${this.currentSession}`);
            } else {
                this.showSaveModal();
            }
        });
        document.getElementById('newGameBtn').addEventListener('click', () => {
            if (confirm('Точно хотите начать новую игру? Все текущие несохраненные данные будут стерты.')) {
                this.startNewGame();
            }
        });
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSession());
        document.getElementById('gamesManageToggle')?.addEventListener('click', () => {
            const block = document.getElementById('gamesManageToggle').closest('.header-right');
            if (block) block.classList.toggle('collapsed');
        });
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
        this.setupConfirmLockField('mortgagePayment', 'mortgagePaymentConfirmBtn', 'Выплата по ипотеке', true);
        this.setupConfirmLockField('mortgageDebt', 'mortgageDebtConfirmBtn', 'Ипотека', true);
        this.setupConfirmLockField('bankLoanDebt', 'bankLoanDebtConfirmBtn', 'Банковский кредит', true);

        // Confirm field modal buttons
        document.getElementById('confirmFieldOk').addEventListener('click', () => this.onConfirmFieldOk());
        document.getElementById('confirmFieldCancel').addEventListener('click', () => this.onConfirmFieldCancel());

        // Celebration modal continue button
        document.getElementById('celebrationContinue')?.addEventListener('click', () => {
            const modal = document.getElementById('celebrationModal');
            if (modal) modal.style.display = 'none';
        });

        // Edit button for bankLoanDebt
        const bankLoanDebtEditBtn = document.getElementById('bankLoanDebtEditBtn');
        if (bankLoanDebtEditBtn) {
            bankLoanDebtEditBtn.addEventListener('click', () => {
                const input = document.getElementById('bankLoanDebt');
                const confirmBtn = document.getElementById('bankLoanDebtConfirmBtn');
                input.readOnly = false;
                input.classList.remove('locked');
                confirmBtn.style.display = '';
                bankLoanDebtEditBtn.style.display = 'none';
                input.focus();
                input.select();
            });
        }

        // Edit button for mortgagePayment
        const mortgageEditBtn = document.getElementById('mortgagePaymentEditBtn');
        if (mortgageEditBtn) {
            mortgageEditBtn.addEventListener('click', () => {
                const input = document.getElementById('mortgagePayment');
                const confirmBtn = document.getElementById('mortgagePaymentConfirmBtn');
                input.readOnly = false;
                input.classList.remove('locked');
                confirmBtn.style.display = '';
                mortgageEditBtn.style.display = 'none';
                input.focus();
                input.select();
            });
        }

        // Edit button for perChildExpense
        const perChildEditBtn = document.getElementById('perChildExpenseEditBtn');
        if (perChildEditBtn) {
            perChildEditBtn.addEventListener('click', () => {
                const input = document.getElementById('perChildExpense');
                const confirmBtn = document.getElementById('perChildConfirmBtn');
                input.readOnly = false;
                input.classList.remove('locked');
                confirmBtn.style.display = '';
                perChildEditBtn.style.display = 'none';
                input.focus();
                input.select();
            });
        }

        // Edit button for mortgageDebt
        const mortgageDebtEditBtn = document.getElementById('mortgageDebtEditBtn');
        if (mortgageDebtEditBtn) {
            mortgageDebtEditBtn.addEventListener('click', () => {
                const input = document.getElementById('mortgageDebt');
                const confirmBtn = document.getElementById('mortgageDebtConfirmBtn');
                input.readOnly = false;
                input.classList.remove('locked');
                confirmBtn.style.display = '';
                mortgageDebtEditBtn.style.display = 'none';
                input.focus();
                input.select();
            });
        }
    }

    showCelebration() {
        const modal = document.getElementById('celebrationModal');
        const container = modal.querySelector('.confetti-container');
        if (!modal || !container) return;

        // Clear previous confetti
        container.innerHTML = '';

        // Create confetti pieces
        const colors = ['#c9a227', '#4f9a52', '#e74c3c', '#3498db', '#9b59b6', '#f39c12'];
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (4 + Math.random() * 6) + 'px';
            piece.style.height = (4 + Math.random() * 6) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            piece.style.animationDelay = (Math.random() * 1.5) + 's';
            container.appendChild(piece);
        }

        modal.style.display = 'block';

        // Clean up confetti after animation
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

    setupConfirmLockField(inputId, btnId, label, allowZero = false) {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(btnId);
        if (!input || !btn) return;

        const showConfirm = () => {
            const val = input.value.trim();
            if (val === '' || (!allowZero && (val === '0' || parseInt(val) === 0))) return;
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
            if (val === '' || (!allowZero && (val === '0' || parseInt(val) === 0))) {
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
        // Show edit button if exists
        const editBtn = document.getElementById(inputId + 'EditBtn');
        if (editBtn) editBtn.style.display = '';
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
        
        if (tableId === 'realEstateLiabilities') {
            const selectedOption = inputRow.querySelector('.multiselect-option.selected');
            values[0] = selectedOption ? selectedOption.dataset.value : '';
            const mortgageInput = inputRow.querySelector('.mortgage-input');
            values[1] = mortgageInput ? mortgageInput.value : '0';
        } else if (tableId === 'realEstateIncome' || tableId === 'businessIncome') {
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

                const mortgageInput2 = inputRow.querySelector('.mortgage-input');
                const hasMortgage2 = mortgageInput2 && mortgageInput2.value && mortgageInput2.value !== '0';

                let isValid = false;
                if (tableId === 'stocks') {
                    isValid = hasSelection && hasQty && hasPrice;
                } else if (tableId === 'realEstateLiabilities') {
                    isValid = hasSelection && hasMortgage2;
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

            const mortgageInput = inputRow.querySelector('.mortgage-input');
            const hasMortgage = mortgageInput && mortgageInput.value && mortgageInput.value !== '0';

            let isValid = false;
            if (tableId === 'stocks') {
                isValid = hasSelection && hasQty && hasPrice;
            } else if (tableId === 'realEstateLiabilities') {
                isValid = hasSelection && hasMortgage;
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
        const childCount = parseInt(document.getElementById('childCount')?.textContent) || 0;
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

        const charityAmount = Math.round(totalIncome * 0.1);
        const charityOnBtn = document.getElementById('charityValueOnBtn');
        if (charityOnBtn) {
            charityOnBtn.textContent = charityAmount > 0 ? `(${new Intl.NumberFormat('ru-RU').format(charityAmount)})` : '';
        }

        const firedOnBtn = document.getElementById('firedValueOnBtn');
        if (firedOnBtn) {
            firedOnBtn.textContent = expenses > 0 ? `(${new Intl.NumberFormat('ru-RU').format(expenses)})` : '';
        }

        // Update goal block
        const goalRemainEl = document.getElementById('goalRemain');
        const goalStatusEl = document.getElementById('goalStatus');
        const goalBankDebtEl = document.getElementById('goalBankDebt');
        const goalBankDebtRow = document.getElementById('goalBankDebtRow');
        const goalBankDebtDivider = document.getElementById('goalBankDebtDivider');
        if (goalBankDebtEl) goalBankDebtEl.textContent = this.formatCurrency(bankDebt);
        if (goalBankDebtRow) goalBankDebtRow.style.display = bankDebt > 0 ? '' : 'none';
        if (goalBankDebtDivider) goalBankDebtDivider.style.display = bankDebt > 0 ? '' : 'none';
        if (goalRemainEl && goalStatusEl) {
            const remain = (expenses + 1) - passiveIncome;
            const passiveGoalMet = remain <= 0;
            const bankDebtPaid = bankDebt <= 0;
            const goalAchieved = passiveGoalMet && bankDebtPaid;
            if (goalAchieved) {
                goalRemainEl.textContent = '0';
                goalRemainEl.classList.add('goal-achieved');
                goalRemainEl.classList.remove('goal-not-achieved');
                goalStatusEl.textContent = '🏆 Вы вырвались из Крысиных Бегов!';
                goalStatusEl.className = 'goal-status goal-status-win';
                // Show celebration modal once
                if (!this._goalCelebrated && !this._isRestoring) {
                    this._goalCelebrated = true;
                    setTimeout(() => this.showCelebration(), 600);
                }
            } else {
                goalRemainEl.textContent = this.formatCurrency(remain);
                goalRemainEl.classList.add('goal-not-achieved');
                goalRemainEl.classList.remove('goal-achieved');
                if (passiveGoalMet && !bankDebtPaid) {
                    goalStatusEl.textContent = '';
                    goalStatusEl.className = 'goal-status';
                } else {
                    goalStatusEl.textContent = '';
                    goalStatusEl.className = 'goal-status';
                }
            }
        }
        this.autoSave();
    }

    autoSave() {
        if (this._isRestoring) return;
        try {
            const data = this.collectData();
            localStorage.setItem('cashflow_autosave', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to autosave:', e);
        }
    }

    restoreAutosave() {
        try {
            const autosave = localStorage.getItem('cashflow_autosave');
            if (autosave) {
                const data = JSON.parse(autosave);
                if (data && (data.playerName || data.salary || data.savings || (data.realEstateIncome && data.realEstateIncome.length > 0) || (data.businessIncome && data.businessIncome.length > 0))) {
                    this.restoreData(data);
                    if (data.currentSession) {
                        this.currentSession = data.currentSession;
                        this.loadSessionList();
                    }
                }
            }
        } catch (e) {
            console.error('Failed to restore autosave:', e);
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
            playerProfession: (document.getElementById('playerProfession') || {}).dataset.selected || '',
            currentBalance: this._currentBalance || 0,
            childCount: parseInt(document.getElementById('childCount')?.textContent) || 0,
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
            timestamp: new Date().toISOString(),
            currentSession: this.currentSession
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
        const playerNameInput = document.getElementById('playerName');
        const playerName = playerNameInput ? playerNameInput.value.trim() : '';
        const defaultPrefix = playerName ? playerName : 'Игрок';
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU');
        const baseName = `${defaultPrefix} ${dateStr}`;
        
        const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
        
        let targetName = baseName;
        if (sessions[baseName]) {
            let version = 1;
            while (sessions[`${baseName} версия ${version}`]) {
                version++;
            }
            targetName = `${baseName} версия ${version}`;
        }
        
        const nameInput = document.getElementById('saveName');
        nameInput.value = targetName;
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
        
    }

    loadSessionList() {
        const sessions = JSON.parse(localStorage.getItem('cashflow_sessions') || '{}');
        const select = document.getElementById('sessionSelect');
        const currentValue = this.currentSession || select.value;
        
        select.innerHTML = '';
        Object.keys(sessions).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
        
        if (currentValue && sessions[currentValue]) {
            select.value = currentValue;
        }

        const currentGameNameEl = document.getElementById('currentGameName');
        if (currentGameNameEl) {
            currentGameNameEl.textContent = this.currentSession || '—';
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
        
        this._isRestoring = true;
        this.restoreData(data);
        this.currentSession = name;
        this._isRestoring = false;
        this.autoSave();
        alert('Игра загружена!');
    }

    startNewGame() {
        this._isRestoring = true;
        this._goalCelebrated = false;

        // Reset name
        const playerNameInput = document.getElementById('playerName');
        if (playerNameInput) {
            playerNameInput.value = '';
            playerNameInput.readOnly = false;
            playerNameInput.classList.remove('locked');
        }
        setTimeout(() => this.updateGameAreaLock(), 0);
        
        // Reset profession select
        const playerProfessionTrigger = document.getElementById('playerProfession');
        if (playerProfessionTrigger) {
            playerProfessionTrigger.textContent = 'Профессия';
            delete playerProfessionTrigger.dataset.selected;
            playerProfessionTrigger.classList.remove('has-value');
            playerProfessionTrigger.classList.remove('active');
            playerProfessionTrigger.style.color = '';
            playerProfessionTrigger.style.pointerEvents = '';
            playerProfessionTrigger.style.opacity = '';
            playerProfessionTrigger.classList.remove('locked');
            const ms = playerProfessionTrigger.closest('.custom-multiselect');
            if (ms) {
                ms.querySelectorAll('.multiselect-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }
        }
        
        // Reset child count
        const childCountEl = document.getElementById('childCount');
        if (childCountEl) childCountEl.textContent = '0';
        this.updateChildCountButtons();

        // Clear all text/number inputs
        document.querySelectorAll('input').forEach(input => {
            if (input.id === 'playerName') return;
            if (input.id === 'saveName') return;
            
            // Unlock fields
            if (input.id !== 'currentBalance' && input.id !== 'childExpenses' && input.id !== 'bankLoanPayment') {
                input.readOnly = false;
                input.classList.remove('locked');
            }
            
            if (input.id === 'currentBalance' || input.id === 'bankLoanDebt') {
                input.value = '0';
            } else {
                input.value = '';
            }
        });
        
        // Ensure currentBalance is locked/readonly initially
        const balanceDisplay = document.getElementById('currentBalance');
        if (balanceDisplay) {
            balanceDisplay.readOnly = true;
            balanceDisplay.classList.remove('editable');
        }
        
        // Reset logic fields
        this._currentBalance = 0;
        this._pendingBalanceEdit = undefined;
        this._pendingLockField = null;
        if (typeof this.updateBalanceDisplay === 'function') {
            this.updateBalanceDisplay();
        }
        
        // Clear tables of dynamic rows
        this.clearTable('realEstateIncome');
        this.clearTable('businessIncome');
        this.clearTable('stocks');
        this.clearTable('realEstateLiabilities');
        
        // Reset inputs in input rows to 0
        document.querySelectorAll('.input-row input').forEach(input => {
            input.value = '0';
        });
        
        // Reset multiselect triggers in input rows
        document.querySelectorAll('.input-row .custom-multiselect .multiselect-trigger').forEach(trigger => {
            if (trigger.closest('#realEstateIncome') || trigger.closest('#realEstateLiabilities')) {
                trigger.textContent = 'Выберите недвижимость';
            } else if (trigger.closest('#businessIncome')) {
                trigger.textContent = 'Выберите бизнес';
            } else if (trigger.closest('#stocks')) {
                trigger.textContent = 'Выберите акцию';
            }
            delete trigger.dataset.selected;
            trigger.classList.remove('has-value');
            trigger.classList.remove('active');
            trigger.style.color = '';
            const ms = trigger.closest('.custom-multiselect');
            if (ms) {
                ms.querySelectorAll('.multiselect-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
            }
        });
        
        // Reset confirm/edit button displays
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.style.display = 'none';
        });
        document.querySelectorAll('.btn-confirm').forEach(btn => {
            btn.style.display = '';
        });
        
        // Reset current session tracking
        this.currentSession = null;
        const select = document.getElementById('sessionSelect');
        if (select) select.value = '';
        
        // Remove autosave
        localStorage.removeItem('cashflow_autosave');
        
        this._isRestoring = false;
        this.updateCalculations();
    }

    restoreData(data) {
        // Restore simple fields
        if (data.playerName !== undefined) { const pn = document.getElementById('playerName'); if (pn) pn.value = data.playerName; }
        if (data.playerProfession !== undefined) {
            const trigger = document.getElementById('playerProfession');
            if (trigger && data.playerProfession) {
                trigger.textContent = data.playerProfession;
                trigger.dataset.selected = data.playerProfession;
                trigger.classList.add('has-value');
                // Mark selected option
                trigger.closest('.custom-multiselect').querySelectorAll('.multiselect-option').forEach(opt => {
                    opt.classList.toggle('selected', opt.dataset.value === data.playerProfession);
                });
            }
        }
        if (data.childCount !== undefined) {
            const el = document.getElementById('childCount');
            if (el) { el.textContent = data.childCount; this.updateChildCountButtons(); }
        }
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
        if (data.currentBalance !== undefined) {
            this._currentBalance = parseInt(data.currentBalance) || 0;
            if (typeof this.updateBalanceDisplay === 'function') {
                this.updateBalanceDisplay();
            }
        }

        // Lock all filled confirm-fields: hide ✓, show ✎
        const confirmFields = [
            ['salary', 'salaryConfirmBtn'],
            ['perChildExpense', 'perChildConfirmBtn'],
            ['otherExpenses', 'otherExpensesConfirmBtn'],
            ['savings', 'savingsConfirmBtn'],
            ['mortgagePayment', 'mortgagePaymentConfirmBtn'],
            ['mortgageDebt', 'mortgageDebtConfirmBtn'],
        ];
        confirmFields.forEach(([inputId, btnId]) => {
            const input = document.getElementById(inputId);
            const confirmBtn = document.getElementById(btnId);
            const editBtn = document.getElementById(inputId + 'EditBtn');
            if (input && input.value && input.value !== '' && input.value !== '0') {
                input.readOnly = true;
                input.classList.add('locked');
                if (confirmBtn) confirmBtn.style.display = 'none';
                if (editBtn) editBtn.style.display = '';
            }
        });

        // Lock balance display if balance is set
        const balanceOkBtn = document.getElementById('balanceOkBtn');
        const balanceEditBtn = document.getElementById('balanceEditBtn');
        const balanceDisplay = document.getElementById('currentBalance');
        if (this._currentBalance !== 0) {
            if (balanceOkBtn) balanceOkBtn.style.display = 'none';
            if (balanceEditBtn) balanceEditBtn.style.display = '';
            if (balanceDisplay) { balanceDisplay.readOnly = true; balanceDisplay.classList.remove('editable'); }
        }

        // Lock player name if set
        const playerNameInput = document.getElementById('playerName');
        if (playerNameInput && playerNameInput.value.trim()) {
            playerNameInput.readOnly = true;
            playerNameInput.classList.add('locked');
        }

        // Lock profession trigger if set
        const profTrigger = document.getElementById('playerProfession');
        if (profTrigger && profTrigger.dataset.selected) {
            profTrigger.classList.add('locked');
            profTrigger.style.pointerEvents = 'none';
        }
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
        
        if (!confirm(`Удалить игру "${name}"?`)) {
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
