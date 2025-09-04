import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

type Donation = {
  name: string;
  amount: number;
  date: string;
  type: string;
};

const isAdmin = true;

function DonorDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filterName, setFilterName] = useState('');
  const [filterAmount, setFilterAmount] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
  axios.get("http://localhost:3001/api/don/get").then(res => {
  setDonations(res.data);
});
  }, []);

  const inputStyle: React.CSSProperties = {
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
    minWidth: 100,
    background: "#fff",
    color: "#000"
  };

  const filtered = donations.filter(d =>
    (filterName === '' || d.name.includes(filterName)) &&
    (filterAmount === '' || Number(d.amount) === Number(filterAmount)) &&
    (filterType === '' || d.type === filterType) &&
    (filterDate === '' || d.date === filterDate)
  );

  const totalAmount = filtered.reduce((sum, d) => sum + Number(d.amount), 0);

  const exportToExcel = () => {
    const dataForExport = filtered.map(d => ({
      "שם תורם": d.name,
      "סכום": d.amount,
      "תאריך": new Date(d.date).toLocaleDateString('he-IL'), // תאריך אמיתי בפורמט יום/חודש/שנה
      "סוג": d.type
    }));
    const csv = Papa.unparse(dataForExport, { quotes: false });
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "donations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chartData = {
    labels: filtered.map(d => d.date),
    datasets: [{
      label: "סכום תרומות",
      data: filtered.map(d => d.amount),
      fill: false,
      borderColor: "#FE328E",
      backgroundColor: "#FE328E",
      tension: 0.2,
    }],
  };

  if (!isAdmin) {
    return <div style={{ direction: "rtl", textAlign: "center", marginTop: 80 }}><h2>אין לך הרשאה לצפות בדף זה</h2></div>;
  }

  return (
    <div style={{ direction: "rtl", padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 24 }}>Donor Dashboard</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <input type="text" placeholder="חפש לפי שם" value={filterName} onChange={e => setFilterName(e.target.value)} style={inputStyle} />
        <input type="number" placeholder="סנן לפי סכום מדויק" value={filterAmount} onChange={e => setFilterAmount(e.target.value)} style={inputStyle} />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={inputStyle}>
          <option value="">כל הסוגים</option>
          <option value="monthly">monthly</option>
          <option value="one-time">one-time</option>
        </select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={inputStyle} />
        <button onClick={exportToExcel} style={{
          padding: "8px 16px", borderRadius: 4, border: "none",
          background: "#FE328E", color: "#fff", fontWeight: "bold", cursor: "pointer", marginRight: "auto"
        }}>
          ייצוא ל-Excel
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
        <thead>
          <tr style={{ background: "#e6e6e6", color: "#222", fontWeight: "bold" }}>
            <th style={{ padding: 12, border: "1px solid #bbb", textAlign: "right" }}>שם תורם</th>
            <th style={{ padding: 12, border: "1px solid #bbb", textAlign: "right" }}>סכום</th>
            <th style={{ padding: 12, border: "1px solid #bbb", textAlign: "right" }}>תאריך</th>
            <th style={{ padding: 12, border: "1px solid #bbb", textAlign: "right" }}>סוג</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 16, color: "#888" }}>
                לא נמצאו תרומות
              </td>
            </tr>
          ) : (
            filtered.map((d, i) => (
              <tr key={i}>
                <td style={{ padding: 10, border: "1px solid #eee", textAlign: "right" }}>{d.name}</td>
                <td style={{ padding: 10, border: "1px solid #eee", textAlign: "right" }}>{d.amount} ₪</td>
                <td style={{ padding: 10, border: "1px solid #eee", textAlign: "right" }}>{new Date(d.date).toLocaleDateString('he-IL')}</td>
                <td style={{ padding: 10, border: "1px solid #eee", textAlign: "right" }}>{d.type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>


      <div style={{ background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 2px 8px #eee" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: "#FE328E" }}>סכום תרומות לפי תאריך</h3>
          <span style={{ fontWeight: "bold", color: "#FE328E", fontSize: 18 }}>
            סה"כ: {totalAmount.toLocaleString()} ₪
          </span>
        </div>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default DonorDashboard;
// export {};