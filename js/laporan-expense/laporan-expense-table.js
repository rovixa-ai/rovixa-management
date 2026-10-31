
const LaporanExpenseTable = { 
 
    render(transactions) { 
 
        const tbody = 
            document.getElementById( 
                "laporanExpenseTableBody" 
            ); 
 
 
        if (!tbody) { 
 
            return; 
 
        } 
 
 
        const data =
    Array.isArray(transactions)
        ? [...transactions].sort(
            (a, b) =>
                String(
                    b.spreadsheetId || ""
                ).localeCompare(
                    String(
                        a.spreadsheetId || ""
                    )
                )
        )
        : [];
 
 
        if (!data.length) { 
 
            tbody.innerHTML = ` 
 
                <tr> 
 
                    <td 
                        colspan="8" 
                        class="laporan-expense-empty" 
                    > 
                        Tidak ada data Expense. 
                    </td> 
 
                </tr> 
 
            `; 
 
            return; 
 
        } 
 
 
        tbody.innerHTML = 
            data 
                .map( 
                    (expense, index) => { 
 
                        const status = 
                            String( 
                                expense.status || 
                                "Aktif" 
                            ).trim(); 
 
 
                        const statusLower = 
                            status.toLowerCase(); 
 
 
                        const statusClass = 
                            statusLower === 
                            "aktif" 
                                ? "laporan-expense-status-aktif" 
                                : "laporan-expense-status-nonaktif"; 
 
 
                        /* 
                         * ID yang ditampilkan 
                         * adalah ID dari Spreadsheet. 
                         * 
                         * Jika belum tersinkron, 
                         * tampilkan "-". 
                         */ 
 
                        const displayId = 
                            String( 
                                expense.spreadsheetId || 
                                "" 
                            ).trim(); 
 
 
                        return ` 
 
                            <tr> 
 
                                <td> 
                                    ${index + 1} 
                                </td> 
 
                                <td> 
                                    ${ 
                                        displayId 
                                            ? this.escapeHtml( 
                                                displayId 
                                            ) 
                                            : "-" 
                                    } 
                                </td> 
 
                                <td> 
                                    ${this.formatTanggal( 
                                        expense.tanggal 
                                    )} 
                                </td> 
 
                                <td> 
                                    ${this.escapeHtml( 
                                        expense.kategori 
                                    )} 
                                </td> 
 
                                <td> 
                                    ${this.escapeHtml( 
                                        expense.keterangan 
                                    )} 
                                </td> 
 
                                <td> 
                                    ${this.escapeHtml( 
                                        expense.metode 
                                    )} 
                                </td> 
 
                                <td 
                                    class="laporan-expense-amount" 
                                > 
                                    ${this.formatRupiah( 
                                        expense.jumlah 
                                    )} 
                                </td> 
 
                                <td> 
 
                                    <span 
                                        class=" 
                                            laporan-expense-status 
                                            ${statusClass} 
                                        " 
                                    > 
                                        ${this.escapeHtml( 
                                            status 
                                        )} 
                                    </span> 
 
                                </td> 
 
                            </tr> 
 
                        `; 
 
                    } 
                ) 
                .join(""); 
 
    }, 
 
 
    formatTanggal(value) { 
 
        if (!value) { 
 
            return "-"; 
 
        } 
 
 
        const text = 
            String(value); 
 
 
        const date = 
            new Date( 
                text 
            ); 
 
 
        if ( 
            isNaN( 
                date.getTime() 
            ) 
        ) { 
 
            return this.escapeHtml( 
                text 
            ); 
 
        } 
 
 
        const day = 
            String( 
                date.getDate() 
            ).padStart( 
                2, 
                "0" 
            ); 
 
 
        const month = 
            String( 
                date.getMonth() + 1 
            ).padStart( 
                2, 
                "0" 
            ); 
 
 
        const year = 
            date.getFullYear(); 
 
 
        return ( 
            day + 
            "-" + 
            month + 
            "-" + 
            year 
        ); 
 
    }, 
 
 
    formatRupiah(value) { 
 
        const number = 
            Number( 
                value 
            ) || 0; 
 
 
        return ( 
            "Rp " + 
            number.toLocaleString( 
                "id-ID" 
            ) 
        ); 
 
    }, 
 
 
    escapeHtml(value) { 
 
        return String( 
            value ?? "" 
        ) 
        .replace( 
            /&/g, 
            "&amp;" 
        ) 
        .replace( 
            /</g, 
            "&lt;" 
        ) 
        .replace( 
            />/g, 
            "&gt;" 
        ) 
        .replace( 
            /"/g, 
            "&quot;" 
        ) 
        .replace( 
            /'/g, 
            "&#039;" 
        ); 
 
    } 
 
};
