const LaporanDesktopRender = {

    render() {

        return `

            <div class="laporan-page">


                <!-- HEADER LAPORAN -->

                <div class="laporan-content-header">

                    <div>

                        <h2>
                            LAPORAN
                        </h2>

                        <p>
                            Laporan transaksi dan aktivitas toko
                        </p>

                    </div>

                </div>


                <!-- MENU LAPORAN -->

                <nav
                    class="laporan-sidebar"
                    id="laporan-sidebar-menu"
                >

                    <button
                        type="button"
                        class="laporan-menu-item active"
                        data-laporan="pembelian"
                    >
                        <span class="laporan-menu-icon">🛒</span>
                        <span class="laporan-menu-text">Pembelian</span>
                    </button>

                    <button
                        type="button"
                        class="laporan-menu-item"
                        data-laporan="penjualan"
                    >
                        <span class="laporan-menu-icon">🛍️</span>
                        <span class="laporan-menu-text">Penjualan</span>
                    </button>

                    <button
                        type="button"
                        class="laporan-menu-item"
                        data-laporan="expense"
                    >
                        <span class="laporan-menu-icon">💸</span>
                        <span class="laporan-menu-text">Expense</span>
                    </button>

                    <button
                        type="button"
                        class="laporan-menu-item"
                        data-laporan="profit"
                    >
                        <span class="laporan-menu-icon">📈</span>
                        <span class="laporan-menu-text">Profit</span>
                    </button>

                </nav>


                <!-- ISI LAPORAN -->

                <main
                    class="laporan-content"
                    id="laporan-content"
                >

                </main>


            </div>

        `;

    }

};