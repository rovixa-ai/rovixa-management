const LaporanPenjualanDesktopRender = {

    render() {

        return `

            <div class="laporan-penjualan">


                <!-- ==================================
                     HEADER
                ================================== -->

                <div class="laporan-page-header">

                    <div>

                        <h2>
                            Laporan Penjualan
                        </h2>

                        <p>
                            Laporan transaksi penjualan bulanan
                        </p>

                    </div>


                    <div>

                        <button
                            type="button"
                            id="laporanPenjualanLaporan"
                            class="laporan-laporan-button"
                        >
                            <img
                                src="icons/print.png"
                                alt=""
                                class="laporan-laporan-icon"
                                aria-hidden="true"
                            >
                            <span>Print</span>
                        </button>

                    </div>

                </div>


                <!-- ==================================
                     FILTER
                ================================== -->

                <div class="laporan-card">

                    <div class="laporan-card-header">

                        <h3>
                            Filter Laporan
                        </h3>

                    </div>


                    <div class="laporan-form-grid">


                        <!-- BULAN -->

                        <div class="laporan-form-group">

                            <label
                                for="laporanPenjualanTanggal"
                            >
                                Bulan
                            </label>


                            <input
                                type="month"
                                id="laporanPenjualanTanggal"
                            >

                        </div>


                        <!-- KASIR -->

                        <div class="laporan-form-group">

                            <label
                                for="laporanPenjualanKasir"
                            >
                                Kasir
                            </label>


                            <select
                                id="laporanPenjualanKasir"
                            >

                                <option value="">
                                    Semua Kasir
                                </option>

                            </select>

                        </div>

                         <div class="laporan-filter-action">


                            <button
                                type="button"
                                id="laporanPenjualanReset"
                                class="laporan-reset-button"
                            >
                                Reset
                            </button>


                        </div>


                    </div>


                   

                </div>


                <!-- ==================================
                     SUMMARY
                ================================== -->

                <div class="laporan-card laporan-summary-card">


                    <div class="laporan-card-header">

                        <h3>
                            Ringkasan
                        </h3>

                    </div>


                    <div class="laporan-summary-grid">


                        <div class="laporan-summary-item">

                            <span>
                                Total Transaksi
                            </span>


                            <strong
                                id="laporanPenjualanTotalTransaksi"
                            >
                                0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Total Item
                            </span>


                            <strong
                                id="laporanPenjualanTotalItem"
                            >
                                0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Subtotal
                            </span>


                            <strong
                                id="laporanPenjualanSubtotal"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Discount
                            </span>


                            <strong
                                id="laporanPenjualanDiscount"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Total Penjualan
                            </span>


                            <strong
                                id="laporanPenjualanTotal"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Cash
                            </span>


                            <strong
                                id="laporanPenjualanCash"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                QRIS
                            </span>


                            <strong
                                id="laporanPenjualanQRIS"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Debit
                            </span>


                            <strong
                                id="laporanPenjualanDebit"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Transfer
                            </span>


                            <strong
                                id="laporanPenjualanTransfer"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div
                            class="
                                laporan-summary-item
                                laporan-summary-total
                            "
                        >

                            <span>
                                Total Pembayaran
                            </span>


                            <strong
                                id="laporanPenjualanTotalPayment"
                            >
                                Rp 0
                            </strong>

                        </div>


                    </div>

                </div>


                <!-- ==================================
                     TABLE
                ================================== -->

                <div class="laporan-card laporan-result-card">


                    <div class="laporan-card-header">


                        <h3>
                            Rekap Penjualan Harian
                        </h3>


                        <span
                            id="laporanPenjualanCount"
                        >
                            0 hari
                        </span>


                    </div>


                    <div class="laporan-table-wrapper">


                        <table class="laporan-table">


                            <thead>

                                <tr>

                                    <th>
                                        Tanggal
                                    </th>

                                    <th>
                                        Jumlah Transaksi
                                    </th>

                                    <th>
                                        Subtotal Penjualan
                                    </th>

                                    <th>
                                        Aksi
                                    </th>

                                </tr>

                            </thead>


                            <tbody
                                id="laporanPenjualanTableBody"
                            >

                                <tr>

                                    <td
                                        colspan="4"
                                        class="laporan-empty"
                                    >
                                        Tidak ada transaksi.
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