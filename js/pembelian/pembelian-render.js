const PembelianRender = {

    render() {

        return `

            <div class="page-header">

                <div>
                    <h2>Pembelian Baru</h2>
                    <p>Input transaksi pembelian barang</p>
                </div>

            </div>


            <!-- ==============================
                 INFORMASI PEMBELIAN
            ============================== -->

            <div class="card">

                <div class="form-grid">

                    <div class="form-group">

                        <label>Tanggal</label>

                        <input
                            type="date"
                            id="pembelian-tanggal"
                        >

                    </div>


                    <div class="form-group">

                        <label>Supplier</label>

                        <input
                            type="text"
                            id="pembelian-supplier"
                            placeholder="Nama supplier"
                        >

                    </div>


                    <div class="form-group">

                        <label>No. Invoice</label>

                        <input
                            type="text"
                            id="pembelian-invoice"
                            placeholder="Nomor invoice"
                        >

                    </div>

                </div>

            </div>


            <!-- ==============================
                 DETAIL PEMBELIAN
            ============================== -->

            <div class="card">

                <div class="card-header">

                    <div>

                        <h3>Detail Barang</h3>

                        <p>
                            Scan barcode untuk menambahkan barang
                        </p>

                    </div>


                    <div class="pembelian-barcode">

                        <input
                            type="text"
                            id="pembelian-barcode"
                            placeholder="Scan barcode..."
                            autocomplete="off"
                        >

                        <button
                            type="button"
                            id="pembelian-scan-barcode"
                        >
                            Scan
                        </button>

                    </div>

                </div>


                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>Barcode</th>

                                <th>Barang</th>

                                <th>Satuan</th>

                                <th>Qty</th>

                                <th>Harga</th>

                                <th>Disc</th>

                                <th>Total</th>

                                <th></th>

                            </tr>

                        </thead>


                        <tbody id="pembelian-items"></tbody>

                    </table>

                </div>

            </div>


            <!-- ==============================
                 PEMBAYARAN
            ============================== -->

            <div class="card">

                <div class="card-header">

                    <div>

                        <h3>Pembayaran</h3>

                        <p>
                            Masukkan pembayaran pembelian
                        </p>

                    </div>


                    <button
                        type="button"
                        id="pembelian-tambah-payment"
                    >
                        + Pembayaran
                    </button>

                </div>


                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>Metode</th>

                                <th>Jumlah</th>

                                <th></th>

                            </tr>

                        </thead>


                        <tbody id="pembelian-payments"></tbody>

                    </table>

                </div>


                <div class="pembelian-payment-summary">

                    <div>

                        <span>Total Pembelian</span>

                        <strong id="pembayaran-total">
                            Rp 0
                        </strong>

                    </div>


                    <div>

                        <span>Total Dibayar</span>

                        <strong id="pembayaran-dibayar">
                            Rp 0
                        </strong>

                    </div>


                    <div>

                        <span>Sisa</span>

                        <strong id="pembayaran-sisa">
                            Rp 0
                        </strong>

                    </div>

                </div>

            </div>


            <!-- ==============================
                 FOOTER
            ============================== -->

            <div class="pembelian-footer">

                <div>

                    <span>
                        Grand Total
                    </span>

                    <strong id="pembelian-grand-total">
                        Rp 0
                    </strong>

                </div>


                <div class="pembelian-footer-actions">

                    <button
                        type="button"
                        id="pembelian-batal"
                    >
                        Batal
                    </button>


                    <button
                        type="button"
                        id="pembelian-simpan"
                    >
                        Simpan Pembelian
                    </button>

                </div>

            </div>

        `;

    }

};