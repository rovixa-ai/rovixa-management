const ExpenseDatabaseConfigRender = {

    /* ==================================
       RENDER
    ================================== */

    render() {

        return `

            <div class="config-page">

                <div class="config-page-header">

                    <div>

                        <h2>
                            Database Expense
                        </h2>

                        <p>
                            Konfigurasi database expense per tahun
                        </p>

                    </div>

                </div>


                <div class="config-card">

                    <div class="config-form-grid">


                        <!-- ==========================
                             TAHUN
                        =========================== -->

                        <div class="config-form-group">

                            <label>
                                Tahun
                            </label>

                            <select
                                id="expenseConfigYear"
                            ></select>

                        </div>


                        <!-- ==========================
                             DATABASE EXPENSE
                        =========================== -->

                        <div class="config-form-group">

                            <label>
                                Spreadsheet Expense
                            </label>

                            <div class="config-input-button">

                                <input
                                    type="text"
                                    id="expenseConfigDatabase"
                                    placeholder="Spreadsheet ID"
                                    readonly
                                >

                                <button
                                    type="button"
                                    id="expenseConfigRender"
                                    class="config-button"
                                >
                                    Render
                                </button>

                            </div>

                        </div>


                    </div>


                    <!-- ==========================
                         STATUS
                    =========================== -->

                    <div
                        id="expenseConfigStatus"
                        class="config-status"
                    ></div>


                    <!-- ==========================
                         INFO
                    =========================== -->

                    <div class="config-info">

                        <span class="config-info-icon">
                            ✓
                        </span>

                        <div>

                            <strong>
                                Database Expense per Tahun
                            </strong>

                            <p>
                                Setiap tahun menggunakan
                                Spreadsheet Expense tersendiri.
                            </p>

                        </div>

                    </div>


                    <!-- ==========================
                         ACTION
                    =========================== -->

                    <div class="config-actions">

                        <button
                            type="button"
                            id="expenseConfigSave"
                            class="config-button config-button-primary"
                        >
                            Simpan Config
                        </button>

                    </div>

                </div>

            </div>

        `;

    }

};