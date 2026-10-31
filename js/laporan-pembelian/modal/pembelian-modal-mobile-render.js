const PembelianLaporanModalMobileRender = {

    render() {

        return `

            <div
                class="pembelian-laporan-modal-overlay"
            >

                <div
                    class="pembelian-laporan-modal-container"
                >

                    <!-- ==============================
                         HEADER
                    ============================== -->

                    <div
                        class="pembelian-laporan-modal-header"
                    >

                        <div
                            class="pembelian-laporan-modal-label"
                        >
                            Laporan Pembelian
                        </div>

                        <button
                            type="button"
                            class="pembelian-laporan-modal-close"
                            data-action="close"
                        >
                            ×
                        </button>

                    </div>


                    <!-- ==============================
                         BODY
                    ============================== -->

                    <div
                        class="pembelian-laporan-modal-body"
                    >

                        <!-- ==========================
                             FILTER
                        =========================== -->

                        <div
                            class="pembelian-laporan-modal-filter-card"
                        >

                            <div
                                class="pembelian-laporan-modal-filter-grid"
                            >

                               <div
                                    class="pembelian-laporan-modal-filter-group"
                                >

                                    <label>
                                        Bulan
                                    </label>

                                    <input
                                        type="month"
                                        id="pembelianLaporanModalTanggal"
                                    >

                                </div>


                                <div
                                    class="pembelian-laporan-modal-filter-group"
                                >

                                    <label>
                                        Supplier
                                    </label>

                                    <select
                                        id="pembelianLaporanModalSupplier"
                                    >

                                        <option value="">
                                            Semua Supplier
                                        </option>

                                    </select>

                                </div>

                            </div>


                           

                        </div>


                        <!-- ==========================
                             SUMMARY
                        =========================== -->

                        <div
                            class="pembelian-laporan-modal-summary"
                        >

                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Total Transaksi
                                </span>

                                <strong
                                    id="pembelianLaporanModalTotalTransaksi"
                                >
                                    0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Total Item
                                </span>

                                <strong
                                    id="pembelianLaporanModalTotalItem"
                                >
                                    0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Subtotal
                                </span>

                                <strong
                                    id="pembelianLaporanModalSubtotal"
                                >
                                    Rp 0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Discount
                                </span>

                                <strong
                                    id="pembelianLaporanModalDiscount"
                                >
                                    Rp 0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Total
                                </span>

                                <strong
                                    id="pembelianLaporanModalTotal"
                                >
                                    Rp 0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Cash
                                </span>

                                <strong
                                    id="pembelianLaporanModalCash"
                                >
                                    Rp 0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    QRIS
                                </span>

                                <strong
                                    id="pembelianLaporanModalQRIS"
                                >
                                    Rp 0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Kartu
                                </span>

                                <strong
                                    id="pembelianLaporanModalKartu"
                                >
                                    Rp 0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Transfer
                                </span>

                                <strong
                                    id="pembelianLaporanModalTransfer"
                                >
                                    Rp 0
                                </strong>
                            </div>


                            <div
                                class="pembelian-laporan-modal-summary-card"
                            >
                                <span>
                                    Total Payment
                                </span>

                                <strong
                                    id="pembelianLaporanModalTotalPayment"
                                >
                                    Rp 0
                                </strong>
                            </div>

                        </div>


                        <!-- ==========================
                             RESULT
                        =========================== -->

                        <div
                            id="pembelian-laporan-modal-result-card"
                            class="pembelian-laporan-modal-result-card"
                        >

                            <div
                                class="pembelian-laporan-modal-result-header"
                            >

                                <div>
                                    Detail Pembelian
                                </div>

                                <span
                                    id="pembelianLaporanModalCount"
                                >
                                    0 transaksi
                                </span>

                            </div>


                            <div
                                class="pembelian-laporan-modal-table-wrapper"
                            >

                                <table
                                    class="pembelian-laporan-modal-table"
                                >

                                    <thead>

                                        <tr>

                                            <th>
                                                Tanggal
                                            </th>

                                            <th>
                                                Transaksi
                                            </th>

                                            <th>
                                                Subtotal
                                            </th>

                                            <th>
                                                Aksi
                                            </th>

                                            

                                        </tr>

                                    </thead>


                                    <tbody
                                        id="pembelianLaporanModalTableBody"
                                    >

                                        <tr>

                                            <td
                                                colspan="8"
                                                class="pembelian-laporan-modal-empty"
                                            >
                                                Tidak ada data
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