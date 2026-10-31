const LaporanProfitTable = { 
 
    render() { 
 
        const tbody = 
            document.getElementById( 
                "laporanProfitTableBody" 
            ); 
 
        const countElement = 
            document.getElementById( 
                "laporanProfitCount" 
            ); 
 
        if (!tbody) { 
            return; 
        } 
 
 
        tbody.innerHTML = ""; 
 
 
        const data =
    Array.isArray(LaporanProfit.filtered)
        ? [...LaporanProfit.filtered].sort(
            (a, b) =>
                String(b.tanggal || "").localeCompare(
                    String(a.tanggal || "")
                )
        )
        : [];
 
 
        /* 
        ====================================== 
        JUMLAH DATA 
        ====================================== 
        */ 
 
        if (countElement) { 
 
            countElement.textContent = 
                `${data.length} Hari`; 
 
        } 
 
 
        /* 
        ====================================== 
        DATA KOSONG 
        ====================================== 
        */ 
 
        if (!data.length) { 
 
            const tr = 
                document.createElement( 
                    "tr" 
                ); 
 
            const td = 
                document.createElement( 
                    "td" 
                ); 
 
            td.colSpan = 6; 
 
            td.textContent = 
                "Tidak ada data laporan profit."; 
 
            td.className = 
                "laporan-profit-empty"; 
 
            tr.appendChild(td); 
 
            tbody.appendChild(tr); 
 
            return; 
 
        } 
 
 
        /* 
        ====================================== 
        RENDER TABLE 
        ====================================== 
        */ 
 
        data.forEach( 
            row => { 
 
                const tr = 
                    document.createElement( 
                        "tr" 
                    ); 
 
 
                /* 
                ---------------------------------- 
                ROW CLICK 
                ---------------------------------- 
                */ 
 
                tr.style.cursor = "pointer"; 
 
                tr.addEventListener( 
                    "click", 
                    () => { 
 
                        if ( 
                            typeof LaporanProfitModal === 
                            "undefined" 
                        ) { 
 
                            console.error( 
                                "LaporanProfitModal belum tersedia." 
                            ); 
 
                            return; 
 
                        } 
 
                        LaporanProfitModal.open( 
                            row.tanggal 
                        ); 
 
                    } 
                ); 
 
 
                /* 
                ---------------------------------- 
                TANGGAL 
                ---------------------------------- 
                */ 
 
                const tanggal = 
                    document.createElement( 
                        "td" 
                    ); 
 
                tanggal.textContent = 
                    this.formatDate( 
                        row.tanggal 
                    ); 
 
 
                /* 
                ---------------------------------- 
                PENJUALAN 
                ---------------------------------- 
                */ 
 
                const penjualan = 
                    document.createElement( 
                        "td" 
                    ); 
 
                penjualan.textContent = 
                    this.formatCurrency( 
                        row.penjualan 
                    ); 
 
 
                /* 
                ---------------------------------- 
                HPP 
                ---------------------------------- 
                */ 
 
                const hpp = 
                    document.createElement( 
                        "td" 
                    ); 
 
                hpp.textContent = 
                    this.formatCurrency( 
                        row.hpp 
                    ); 
 
 
                /* 
                ---------------------------------- 
                GROSS PROFIT 
                ---------------------------------- 
                */ 
 
                const grossProfit = 
                    document.createElement( 
                        "td" 
                    ); 
 
                grossProfit.textContent = 
                    this.formatCurrency( 
                        row.grossProfit 
                    ); 
 
 
                /* 
                ---------------------------------- 
                EXPENSE 
                ---------------------------------- 
                */ 
 
                const expense = 
                    document.createElement( 
                        "td" 
                    ); 
 
                expense.textContent = 
                    this.formatCurrency( 
                        row.expense 
                    ); 
 
 
                /* 
                ---------------------------------- 
                NET PROFIT 
                ---------------------------------- 
                */ 
 
                const netProfit = 
                    document.createElement( 
                        "td" 
                    ); 
 
                netProfit.textContent = 
                    this.formatCurrency( 
                        row.netProfit 
                    ); 
 
 
                /* 
                ---------------------------------- 
                APPEND 
                ---------------------------------- 
                */ 
 
                tr.appendChild( 
                    tanggal 
                ); 
 
                tr.appendChild( 
                    penjualan 
                ); 
 
                tr.appendChild( 
                    hpp 
                ); 
 
                tr.appendChild( 
                    grossProfit 
                ); 
 
                tr.appendChild( 
                    expense 
                ); 
 
                tr.appendChild( 
                    netProfit 
                ); 
 
 
                tbody.appendChild( 
                    tr 
                ); 
 
            } 
        ); 
 
    }, 
 
 
    formatDate(value) { 
 
        const text = 
            String( 
                value || "" 
            ).trim(); 
 
 
        if (!text) { 
            return "-"; 
        } 
 
 
        /* 
        ====================================== 
        JANGAN MENGGUNAKAN new Date() 
        UNTUK YYYY-MM-DD 
        ====================================== 
        */ 
 
        const match = 
            text.match( 
                /^(\d{4})-(\d{2})-(\d{2})/ 
            ); 
 
 
        if (match) { 
 
            const tahun = 
                Number( 
                    match[1] 
                ); 
 
            const bulan = 
                Number( 
                    match[2] 
                ); 
 
            const tanggal = 
                Number( 
                    match[3] 
                ); 
 
 
            const bulanNama = [ 
 
                "Jan", 
                "Feb", 
                "Mar", 
                "Apr", 
                "Mei", 
                "Jun", 
                "Jul", 
                "Agu", 
                "Sep", 
                "Okt", 
                "Nov", 
                "Des" 
 
            ]; 
 
 
            if ( 
                bulan >= 1 && 
                bulan <= 12 && 
                tanggal >= 1 && 
                tanggal <= 31 
            ) { 
 
                return `${tanggal} ${bulanNama[bulan - 1]} ${tahun}`; 
 
            } 
 
        } 
 
 
        return text; 
 
    }, 
 
 
    formatCurrency(value) { 
 
        const number = 
            Number(value) || 0; 
 
 
        return new Intl.NumberFormat( 
            "id-ID", 
            { 
                style: "currency", 
                currency: "IDR", 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            } 
        ).format( 
            number 
        ); 
 
    } 
 
};