const DashboardMobileRender = {

    render() {

        return `

            <div class="dashboard-mobile-content">


                <!-- ======================================
                     HEADER MOBILE
                ====================================== -->

                <div class="dashboard-welcome">

                    <div>

                        <h2>
                            Dashboard
                        </h2>

                        <p>
                            Ringkasan aktivitas toko
                        </p>

                    </div>

                </div>


                <!-- ======================================
                     FILTER MOBILE
                ====================================== -->

                <div class="dashboard-filter">

                    <div class="dashboard-filter-group">

                        <label>
                            Periode
                        </label>

                        <input
                            type="month"
                            id="dashboard-periode"
                        >

                    </div>

                </div>


                <!-- ======================================
                     CARDS MOBILE
                ====================================== -->

                <div class="dashboard-cards">


                    <!-- TOTAL BARANG -->

                    <div
                        class="dashboard-card"
                        data-dashboard-page="barang"
                        style="cursor: pointer;"
                    >

                        <div class="dashboard-card-label">
                            Total Barang
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-total-barang"
                        >
                            0
                        </div>

                    </div>


                    <!-- STOK MENIPIS -->

                    <div class="dashboard-card">

                        <div class="dashboard-card-label">
                            Stok Menipis
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-stok-menipis"
                        >
                            0
                        </div>

                    </div>


                    <!-- STOK LAMA -->

                    <div
                        class="dashboard-card"
                        id="dashboard-stok-lama-card"
                        style="cursor: pointer;"
                    >

                        <div class="dashboard-card-label">
                            Stok Lama
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-stok-lama"
                        >
                            0
                        </div>

                    </div>


                    <!-- EXPENSE -->

                    <div
                        class="dashboard-card"
                        data-expense-modal
                        style="cursor: pointer;"
                    >

                        <div class="dashboard-card-label">
                            Expense
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-expense"
                        >
                            Rp 0
                        </div>

                    </div>


                    <!-- PENJUALAN -->

                    <div
                        class="dashboard-card"
                        data-penjualan-modal
                        style="cursor: pointer;"
                    >

                        <div class="dashboard-card-label">
                            Penjualan
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-penjualan-bulan"
                        >
                            Rp 0
                        </div>

                    </div>


                    <!-- PEMBELIAN -->

                    <div
                        class="dashboard-card"
                        data-pembelian-modal
                        style="cursor: pointer;"
                    >

                        <div class="dashboard-card-label">
                            Pembelian
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-pembelian-bulan"
                        >
                            Rp 0
                        </div>

                    </div>


                    <!-- TRANSAKSI HARI INI -->

                    <div class="dashboard-card">

                        <div class="dashboard-card-label">
                            Transaksi Hari Ini
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-transaksi-hari"
                        >
                            0
                        </div>

                    </div>


                    <!-- NILAI STOK -->

                    <div class="dashboard-card">

                        <div class="dashboard-card-label">
                            Nilai Stok
                        </div>

                        <div
                            class="dashboard-card-value"
                            id="dashboard-nilai-stok"
                        >
                            Rp 0
                        </div>

                    </div>


                </div>


                <!-- ======================================
                     CHART MOBILE
                ====================================== -->

                <div class="dashboard-chart-page">

                    <div
                        class="dashboard-chart-mobile"
                        id="dashboard-chart-mobile"
                    >

                        ${
                            typeof DashboardChartMobileRender !==
                            "undefined"
                                ? DashboardChartMobileRender.render()
                                : ""
                        }

                    </div>

                </div>


            </div>

        `;

    }

};