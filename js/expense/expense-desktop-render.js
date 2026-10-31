const ExpenseDesktopRender = {

    render() {

        return `

            <div class="expense-page">


                <!-- ==============================
                     HEADER
                ============================== -->

                <div class="expense-page-header">

                    <div>

                        <h2>
                            Expense
                        </h2>

                        <p>
                            Catat pengeluaran
                        </p>

                    </div>

                </div>


                <!-- ==============================
                     INFORMASI EXPENSE
                ============================== -->

                <div class="expense-card">

                    <div class="expense-form-grid">


                        <div class="expense-form-group">

                            <label>
                                Tanggal
                            </label>

                            <input
                                type="date"
                                id="expense-tanggal"
                            >

                        </div>


                        <div class="expense-form-group">

                            <label>
                                Kategori
                            </label>

                            <input
                                type="text"
                                id="expense-kategori"
                                placeholder="Kategori"
                            >

                        </div>


                        <div class="expense-form-group">

                            <label>
                                Keterangan
                            </label>

                            <input
                                type="text"
                                id="expense-keterangan"
                                placeholder="Keterangan pengeluaran"
                            >

                        </div>


                        <div class="expense-form-group">

                            <label>
                                Jumlah
                            </label>

                            <input
                                type="number"
                                id="expense-jumlah"
                                placeholder="0"
                                min="0"
                            >

                        </div>


                        <div class="expense-form-group">

                            <label>
                                Metode Pembayaran
                            </label>

                            <select id="expense-metode">

                                <option value="Cash">
                                    Cash
                                </option>

                                <option value="Transfer">
                                    Transfer
                                </option>

                                <option value="QRIS">
                                    QRIS
                                </option>

                                <option value="Kartu">
                                    Kartu
                                </option>

                            </select>

                        </div>


                    </div>

                </div>


                <!-- ==============================
                     TOTAL
                ============================== -->

                <div class="expense-card expense-total-card">

                    <div class="expense-total">

                        <span>
                            Total Expense
                        </span>

                        <strong id="expense-total">
                            Rp 0
                        </strong>

                    </div>

                </div>


                <!-- ==============================
                     FOOTER
                ============================== -->

                <div class="expense-footer">

                    <div class="expense-footer-total">

                        <span>
                            Total Expense
                        </span>

                        <strong id="expense-grand-total">
                            Rp 0
                        </strong>

                    </div>


                    <div class="expense-footer-actions">

                        <button
                            type="button"
                            id="expense-batal"
                        >
                            Batal
                        </button>


                        <button
                            type="button"
                            id="expense-simpan"
                        >
                            Simpan Expense
                        </button>

                    </div>

                </div>


            </div>

        `;

    }

};