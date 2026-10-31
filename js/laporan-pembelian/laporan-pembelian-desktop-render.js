const LaporanPembelianDesktopRender = {

    render() {

        return `

            <div class="laporan-pembelian">

                <div class="laporan-page-header">

                    <div>

                        <h2>
                            Laporan Pembelian
                        </h2>

                        <p>
                            Laporan transaksi pembelian bulanan
                        </p>

                    </div>


                    <div>

                        <button
                            type="button"
                            id="laporanPembelianLaporan"
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


                <div class="laporan-card">

                    <div class="laporan-card-header">

                        <h3>
                            Filter Laporan
                        </h3>

                    </div>


                    <div class="laporan-form-grid">

                        <div class="laporan-form-group">

                            <label
                                for="laporanPembelianTanggal"
                            >
                                Bulan
                            </label>

                            <input
                                type="month"
                                id="laporanPembelianTanggal"
                            >

                        </div>


                        <div class="laporan-form-group">

                            <label
                                for="laporanPembelianSupplier"
                            >
                                Supplier
                            </label>

                            <select
                                id="laporanPembelianSupplier"
                            >

                                <option value="">
                                    Semua Supplier
                                </option>

                            </select>

                        </div>

                         <div class="laporan-filter-action">

                                <button
                                    type="button"
                                    id="laporanPembelianReset"
                                    class="laporan-reset-button"
                                >
                                    Reset
                                </button>

                        </div>


                    </div>

                    
                </div>


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
                                id="laporanPembelianTotalTransaksi"
                            >
                                0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Total Item
                            </span>

                            <strong
                                id="laporanPembelianTotalItem"
                            >
                                0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Subtotal
                            </span>

                            <strong
                                id="laporanPembelianSubtotal"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Discount
                            </span>

                            <strong
                                id="laporanPembelianDiscount"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Total
                            </span>

                            <strong
                                id="laporanPembelianTotal"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Cash
                            </span>

                            <strong
                                id="laporanPembelianCash"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                QRIS
                            </span>

                            <strong
                                id="laporanPembelianQRIS"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Debit
                            </span>

                            <strong
                                id="laporanPembelianKartu"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Transfer
                            </span>

                            <strong
                                id="laporanPembelianTransfer"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <div class="laporan-summary-item">

                            <span>
                                Total Payment
                            </span>

                            <strong
                                id="laporanPembelianTotalPayment"
                            >
                                Rp 0
                            </strong>

                        </div>

                    </div>

                </div>


                <div class="laporan-card laporan-result-card">

                    <div class="laporan-card-header">

                        <h3>
                            Rekap Pembelian Harian
                        </h3>

                        <span
                            id="laporanPembelianCount"
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
                                        Subtotal Pembelian
                                    </th>

                                    <th>
                                        Aksi
                                    </th>

                                </tr>

                            </thead>


                            <tbody
                                id="laporanPembelianTableBody"
                            >

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        `;

    }

};