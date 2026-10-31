const LaporanProfitMobileRender = {

    render() {

        return `

            <div class="laporan-profit-page">


                <!-- ==================================
                     HEADER
                ================================== -->

                <div class="laporan-content-header">

                    <div>

                        <h2>
                            Laporan Profit
                        </h2>

                        <p>
                            Laporan keuntungan toko
                        </p>

                    </div>

                </div>


                <!-- ==================================
                     FILTER
                ================================== -->

                <div class="laporan-profit-filter">

                    <div class="laporan-profit-filter-item">

                        <label for="laporanProfitTanggal">
                            Bulan
                        </label>

                        <input
                            type="month"
                            id="laporanProfitTanggal"
                        >

                    </div>


                    <div class="laporan-profit-filter-item">

                        <label for="laporanProfitKasir">
                            Kasir
                        </label>

                        <select
                            id="laporanProfitKasir"
                        >

                            <option value="">
                                Semua Kasir
                            </option>

                        </select>

                    </div>


                    <div class="laporan-profit-filter-actions">

                        <button
                            type="button"
                            id="laporanProfitResetButton"
                        >
                            Reset
                        </button>

                    </div>

                </div>


                <!-- ==================================
                     SUMMARY
                ================================== -->

                <div class="laporan-profit-summary">


                    <div class="laporan-profit-summary-card">

                        <span>
                            Total Penjualan
                        </span>

                        <strong id="laporanProfitTotalPenjualan">
                            Rp 0
                        </strong>

                    </div>


                    <div class="laporan-profit-summary-card">

                        <span>
                            Total HPP
                        </span>

                        <strong id="laporanProfitTotalHpp">
                            Rp 0
                        </strong>

                    </div>


                    <div class="laporan-profit-summary-card">

                        <span>
                            Gross Profit
                        </span>

                        <strong id="laporanProfitGrossProfit">
                            Rp 0
                        </strong>

                    </div>


                    <div class="laporan-profit-summary-card">

                        <span>
                            Expense
                        </span>

                        <strong id="laporanProfitTotalExpense">
                            Rp 0
                        </strong>

                    </div>


                    <div class="laporan-profit-summary-card">

                        <span>
                            Net Profit
                        </span>

                        <strong id="laporanProfitNetProfit">
                            Rp 0
                        </strong>

                    </div>


                </div>


                <!-- ==================================
                     TABLE
                ================================== -->

                <div class="laporan-profit-table-card">


                    <div class="laporan-profit-table-header">

                        <div>

                            <h3>
                                Rekap Profit
                            </h3>

                            <p id="laporanProfitCount">
                                0 hari
                            </p>

                        </div>

                    </div>


                    <div class="laporan-profit-table-wrapper">

                        <table class="laporan-profit-table">

                            <thead>

                                <tr>

                                    <th>
                                        Tanggal
                                    </th>

                                    <th>
                                        Penjualan
                                    </th>

                                    <th>
                                        HPP
                                    </th>

                                    <th>
                                        Gross Profit
                                    </th>

                                    <th>
                                        Expense
                                    </th>

                                    <th>
                                        Net Profit
                                    </th>

                                </tr>

                            </thead>


                            <tbody id="laporanProfitTableBody">

                                <tr>

                                    <td
                                        colspan="6"
                                        class="laporan-profit-empty"
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