const PenjualanLaporanModalMobileRender = {

    render() {

        return `

            <div
                class="penjualan-laporan-modal-overlay"
                data-action="close"
            >

                <div
                    class="penjualan-laporan-modal-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="penjualanLaporanModalTitle"
                >

                    <!-- ======================================
                         HEADER
                    ====================================== -->

                    <div
                        class="penjualan-laporan-modal-header"
                    >

                        

                            <div
                                class="penjualan-laporan-modal-label"
                            >
                                Laporan Penjualan
                            </div>

                            <button
                                type="button"
                                class="penjualan-laporan-modal-close"
                                data-action="close"
                                aria-label="Tutup"
                            >
                                ×
                            </button>
                           
                        
                        
                    </div>


                    <!-- ======================================
                         BODY
                    ====================================== -->

                    <div
                        class="penjualan-laporan-modal-body"
                    >


                        <!-- ==================================
                             FILTER
                        ================================== -->

                        <div
                            class="penjualan-laporan-modal-card"
                        >

                            


                            <div
                                class="penjualan-laporan-modal-form-grid"
                            >

                                <div
                                    class="penjualan-laporan-modal-form-group"
                                >

                                    <label
                                        for="penjualanLaporanModalBulan"
                                    >
                                        Bulan
                                    </label>

                                    <input
                                        type="month"
                                        id="penjualanLaporanModalBulan"
                                    >

                                </div>


                                <div
                                    class="penjualan-laporan-modal-form-group"
                                >

                                    <label
                                        for="penjualanLaporanModalKasir"
                                    >
                                        Kasir
                                    </label>

                                    <select
                                        id="penjualanLaporanModalKasir"
                                    >

                                        <option value="">
                                            Semua Kasir
                                        </option>

                                    </select>

                                </div>

                            </div>


                            

                        </div>


                        <!-- ==================================
                             SUMMARY
                        ================================== -->

                        


                            <div
                                class="penjualan-laporan-modal-summary-grid"
                            >

                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Total Transaksi
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalTotalTransaksi"
                                    >
                                        0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Total Item
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalTotalItem"
                                    >
                                        0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalSubtotal"
                                    >
                                        Rp 0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Discount
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalDiscount"
                                    >
                                        Rp 0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Total Penjualan
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalTotal"
                                    >
                                        Rp 0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Cash
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalCash"
                                    >
                                        Rp 0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        QRIS
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalQRIS"
                                    >
                                        Rp 0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Debit
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalDebit"
                                    >
                                        Rp 0
                                    </strong>

                                </div>


                                <div
                                    class="penjualan-laporan-modal-summary-item"
                                >

                                    <span>
                                        Transfer
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalTransfer"
                                    >
                                        Rp 0
                                    </strong>

                                </div>


                                <div
                                    class="
                                        penjualan-laporan-modal-summary-item
                                        penjualan-laporan-modal-summary-total
                                    "
                                >

                                    <span>
                                        Total Pembayaran
                                    </span>

                                    <strong
                                        id="penjualanLaporanModalTotalPayment"
                                    >
                                        Rp 0
                                    </strong>

                                </div>

                            </div>

                        


                        <!-- ==================================
                             RESULT
                        ================================== -->

                        <div
                            class="
                                penjualan-laporan-modal-card
                                penjualan-laporan-modal-result-card
                            "
                        >

                            <div
                                class="
                                    penjualan-laporan-modal-card-header
                                    penjualan-laporan-modal-result-header
                                "
                            >

                                <h3>
                                    Rekap Penjualan Harian
                                </h3>

                                <span
                                    id="penjualanLaporanModalCount"
                                >
                                    0 hari
                                </span>

                            </div>


                            <div
                                class="penjualan-laporan-modal-table-wrapper"
                            >

                                <table
                                    class="penjualan-laporan-modal-table"
                                >

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
                                        id="penjualanLaporanModalTableBody"
                                    >

                                        <tr>

                                            <td
                                                colspan="4"
                                                class="
                                                    penjualan-laporan-modal-empty
                                                "
                                            >
                                                Memuat data...
                                            </td>

                                        </tr>

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>


                    <!-- ======================================
                         FOOTER
                    ====================================== -->

                    <div
                        class="penjualan-laporan-modal-footer"
                    >

                        <div
                            class="
                                penjualan-laporan-modal-footer-total
                            "
                        >

                            <span>
                                Total Penjualan
                            </span>

                            <strong
                                id="penjualanLaporanModalFooterTotal"
                            >
                                Rp 0
                            </strong>

                        </div>


                        <button
                            type="button"
                            class="
                                penjualan-laporan-modal-footer-button
                            "
                            data-action="close"
                        >
                            Tutup
                        </button>

                    </div>

                </div>

            </div>

        `;

    }

};