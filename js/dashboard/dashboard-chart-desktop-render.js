const DashboardChartDesktopRender = {

    render() {

        return `

            <div class="dashboard-chart-desktop-content">

                <div class="dashboard-chart-header">

                    <div>

                        <h3>
                            Omset Penjualan
                        </h3>

                        <p>
                            Omset penjualan per hari
                        </p>

                    </div>

                </div>


                <div
                    class="dashboard-chart-body dashboard-omset-chart"
                    id="dashboard-desktop-chart-1-content"
                >
                </div>

            </div>


            <div class="dashboard-chart-desktop-content">

                <div class="dashboard-chart-header">

                    <div>

                        <h3>
                            Jumlah Transaksi
                        </h3>

                        <p>
                            Jumlah transaksi per hari
                        </p>

                    </div>

                </div>


                <div
                    class="dashboard-chart-body"
                    id="dashboard-desktop-chart-2-content"
                >
                </div>

            </div>

        `;

    },


    async load() {

        const omset =
            await Dashboard.loadChartOmsetHarian();

        const transaksi =
            await Dashboard.loadChartTransaksiHarian();


        this.renderOmset(
            omset
        );

        this.renderTransaksi(
            transaksi
        );

    },


    renderOmset(data) {

        const container =
            document.getElementById(
                "dashboard-desktop-chart-1-content"
            );

        if (!container) {
            return;
        }


        if (!Array.isArray(data)) {
            return;
        }


        const maxOmset =
            Math.max(
                ...data.map(
                    item =>
                        Number(
                            item.omset
                        ) || 0
                ),
                0
            );


        container.innerHTML = `

            <div class="dashboard-chart-y-axis">

                <span>
                    Rp ${maxOmset.toLocaleString("id-ID")}
                </span>

                <span>
                    Rp ${Math.round(
                        maxOmset * 0.75
                    ).toLocaleString("id-ID")}
                </span>

                <span>
                    Rp ${Math.round(
                        maxOmset * 0.50
                    ).toLocaleString("id-ID")}
                </span>

                <span>
                    Rp ${Math.round(
                        maxOmset * 0.25
                    ).toLocaleString("id-ID")}
                </span>

                <span>
                    Rp 0
                </span>

            </div>


            <div class="dashboard-chart-graph">

                <div class="dashboard-chart-grid">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                </div>


                <div class="dashboard-chart-bars">

                    ${data.map(
                        item => {

                            const omset =
                                Number(
                                    item.omset
                                ) || 0;


                            let height =
                                0;


                            if (
                                maxOmset >
                                0
                            ) {

                                height =
                                    (
                                        omset /
                                        maxOmset
                                    ) *
                                    100;

                            }


                            return `

                                <div
                                    class="dashboard-chart-bar-item"
                                    title="Tanggal ${item.tanggal}: Rp ${omset.toLocaleString("id-ID")}"
                                >

                                    <div
                                        class="dashboard-chart-bar"
                                        style="height: ${height}%;"
                                    >
                                    </div>

                                    <span
                                        class="dashboard-chart-date"
                                    >
                                        ${item.tanggal}
                                    </span>

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>

        `;

    },


    renderTransaksi(data) {

        const container =
            document.getElementById(
                "dashboard-desktop-chart-2-content"
            );

        if (!container) {
            return;
        }


        if (!Array.isArray(data)) {
            return;
        }


        const maxTransaksi =
            Math.max(
                ...data.map(
                    item =>
                        Number(
                            item.transaksi
                        ) || 0
                ),
                0
            );


        container.innerHTML = `

            <div class="dashboard-chart-y-axis">

                <span>
                    ${maxTransaksi.toLocaleString("id-ID")}
                </span>

                <span>
                    ${Math.round(
                        maxTransaksi * 0.75
                    ).toLocaleString("id-ID")}
                </span>

                <span>
                    ${Math.round(
                        maxTransaksi * 0.50
                    ).toLocaleString("id-ID")}
                </span>

                <span>
                    ${Math.round(
                        maxTransaksi * 0.25
                    ).toLocaleString("id-ID")}
                </span>

                <span>
                    0
                </span>

            </div>


            <div class="dashboard-chart-graph">

                <div class="dashboard-chart-grid">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                </div>


                <div class="dashboard-chart-bars">

                    ${data.map(
                        item => {

                            const transaksi =
                                Number(
                                    item.transaksi
                                ) || 0;


                            let height =
                                0;


                            if (
                                maxTransaksi >
                                0
                            ) {

                                height =
                                    (
                                        transaksi /
                                        maxTransaksi
                                    ) *
                                    100;

                            }


                            return `

                                <div
                                    class="dashboard-chart-bar-item"
                                    title="Tanggal ${item.tanggal}: ${transaksi.toLocaleString("id-ID")} transaksi"
                                >

                                    <div
                                        class="dashboard-chart-bar"
                                        style="height: ${height}%;"
                                    >
                                    </div>

                                    <span
                                        class="dashboard-chart-date"
                                    >
                                        ${item.tanggal}
                                    </span>

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>

        `;

    }

};