/*======================================
LAPORAN EXPENSE MODAL
DESKTOP RENDER
======================================*/

const LaporanExpenseModalDesktopRender = {

    render() {

        return `

            <div
                class="laporan-expense-modal-overlay"
            >

                <div
                    class="laporan-expense-modal-container"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="laporan-expense-modal-title"
                >

                    <div
                        class="laporan-expense-modal-header"
                    >

                        <div>

                            <h2
                                id="laporan-expense-modal-title"
                            >
                                Laporan Expense
                            </h2>

                            <p>
                                Laporan pengeluaran
                            </p>

                        </div>


                        <button
                            type="button"
                            class="laporan-expense-modal-close"
                            id="laporan-expense-modal-close"
                            aria-label="Tutup"
                        >
                            &times;
                        </button>

                    </div>


                    <div
                        class="laporan-expense-modal-body"
                    >

                        <div
                            class="laporan-expense-filter-card"
                        >

                            <div
                                class="laporan-expense-filter-grid"
                            >

                                <div
                                    class="laporan-expense-filter-group"
                                >

                                    <label>
                                        Bulan
                                    </label>

                                    <input
                                        type="month"
                                        id="laporanExpenseModalTanggal"
                                    >

                                </div>


                                <div
                                    class="laporan-expense-filter-group"
                                >

                                    <label>
                                        Kategori
                                    </label>

                                    <select
                                        id="laporanExpenseModalKategori"
                                    >

                                        <option value="">
                                            Semua Kategori
                                        </option>

                                    </select>

                                </div>


                                <div
                                    class="laporan-expense-filter-group"
                                >

                                    <label>
                                        Metode Pembayaran
                                    </label>

                                    <select
                                        id="laporanExpenseModalMetode"
                                    >

                                        <option value="">
                                            Semua Metode
                                        </option>

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


                                <div
                                    class="laporan-expense-filter-actions"
                                >

                                    <button
                                        type="button"
                                        id="laporanExpenseModalResetButton"
                                    >
                                        Reset
                                    </button>

                                </div>

                            </div>

                        </div>


                        <div
                            class="laporan-expense-summary"
                        >

                            <div
                                class="laporan-expense-summary-card"
                            >

                                <span>
                                    Total Transaksi
                                </span>

                                <strong
                                    id="laporanExpenseModalTotalTransaksi"
                                >
                                    0
                                </strong>

                            </div>


                            <div
                                class="laporan-expense-summary-card"
                            >

                                <span>
                                    Total Expense
                                </span>

                                <strong
                                    id="laporanExpenseModalTotal"
                                >
                                    Rp 0
                                </strong>

                            </div>


                            <div
                                class="laporan-expense-summary-card"
                            >

                                <span>
                                    Cash
                                </span>

                                <strong
                                    id="laporanExpenseModalCash"
                                >
                                    Rp 0
                                </strong>

                            </div>


                            <div
                                class="laporan-expense-summary-card"
                            >

                                <span>
                                    Transfer
                                </span>

                                <strong
                                    id="laporanExpenseModalTransfer"
                                >
                                    Rp 0
                                </strong>

                            </div>


                            <div
                                class="laporan-expense-summary-card"
                            >

                                <span>
                                    QRIS
                                </span>

                                <strong
                                    id="laporanExpenseModalQRIS"
                                >
                                    Rp 0
                                </strong>

                            </div>


                            <div
                                class="laporan-expense-summary-card"
                            >

                                <span>
                                    Kartu
                                </span>

                                <strong
                                    id="laporanExpenseModalKartu"
                                >
                                    Rp 0
                                </strong>

                            </div>

                        </div>


                        <div
                            class="laporan-expense-table-card"
                        >

                            <div
                                class="laporan-expense-table-wrapper"
                            >

                                <table
                                    class="laporan-expense-table"
                                >

                                    <thead>

                                        <tr>

                                            <th>
                                                No
                                            </th>

                                            <th>
                                                ID
                                            </th>

                                            <th>
                                                Tanggal
                                            </th>

                                            <th>
                                                Kategori
                                            </th>

                                            <th>
                                                Keterangan
                                            </th>

                                            <th>
                                                Metode
                                            </th>

                                            <th>
                                                Jumlah
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody
                                        id="laporanExpenseModalTableBody"
                                    >

                                        <tr>

                                            <td
                                                colspan="8"
                                                class="laporan-expense-empty"
                                            >
                                                Belum ada data.
                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }

};