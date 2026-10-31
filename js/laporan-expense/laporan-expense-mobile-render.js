/*======================================
LAPORAN EXPENSE
MOBILE RENDER
======================================*/

const LaporanExpenseMobileRender = {

    render() {

        return `

            <div class="laporan-expense-page">


                <div class="laporan-expense-page-header">

                    <div>

                        <h2>
                            Laporan Expense
                        </h2>

                        <p>
                            Laporan pengeluaran
                        </p>

                    </div>

                </div>


                <!-- ==================================
                     FILTER
                ================================== -->

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
                                id="laporanExpenseTanggal"
                            >

                        </div>


                        <div
                            class="laporan-expense-filter-group"
                        >

                            <label>
                                Kategori
                            </label>

                            <select
                                id="laporanExpenseKategori"
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
                                id="laporanExpenseMetode"
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
                                id="laporanExpenseResetButton"
                            >
                                Reset
                            </button>

                        </div>


                    </div>

                </div>


                <!-- ==================================
                     SUMMARY
                ================================== -->

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
                            id="laporanExpenseTotalTransaksi"
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
                            id="laporanExpenseTotal"
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
                            id="laporanExpenseCash"
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
                            id="laporanExpenseTransfer"
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
                            id="laporanExpenseQRIS"
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
                            id="laporanExpenseKartu"
                        >
                            Rp 0
                        </strong>

                    </div>


                </div>


                <!-- ==================================
                     TABLE
                ================================== -->

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
                                id="laporanExpenseTableBody"
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

        `;

    }

};
