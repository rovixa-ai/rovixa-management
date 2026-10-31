const DashboardDesktopRender = {

    render() {

        return `

            <div class="dashboard-desktop-content">


                <!-- ======================================
                     HEADER
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
                     FILTER
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
                     DASHBOARD CARDS
                ====================================== -->

                <div class="dashboard-cards">


                    <!-- 1. TOTAL BARANG -->

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


                    <!-- 2. STOK MENIPIS -->

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


                    <!-- 3. STOK LAMA -->

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


                    <!-- 4. EXPENSE -->

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


                    <!-- 5. PENJUALAN -->

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


                    <!-- 6. PEMBELIAN -->

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


                    <!-- 7. TRANSAKSI HARI INI -->

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


                    <!-- 8. NILAI STOK -->

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
                     CHART DESKTOP
                ====================================== -->

                <div class="dashboard-chart-page">

                    <div
                        class="dashboard-chart-desktop"
                        id="dashboard-chart-desktop"
                    >

                        ${
                            typeof DashboardChartDesktopRender !==
                            "undefined"
                                ? DashboardChartDesktopRender.render()
                                : ""
                        }

                    </div>

                </div>


            </div>

        `;

    }

};