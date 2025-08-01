import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ScheduleItem {
  month: number;
  emi: string;
  principal: string;
  interest: string;
  balance: string;
}

export const downloadAmortizationExcel = async (schedule: ScheduleItem[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Amortization Schedule");

  // Header Row
  worksheet.columns = [
    { header: "Month", key: "month", width: 10 },
    { header: "EMI", key: "emi", width: 15 },
    { header: "Principal", key: "principal", width: 15 },
    { header: "Interest", key: "interest", width: 15 },
    { header: "Balance", key: "balance", width: 15 },
  ];

  // Set the Header Row 
  worksheet.getRow(1).font = {bold: true}; // Bold
  worksheet.getRow(1).alignment = { horizontal: 'center' }; // Center alignment
  worksheet.getRow(1).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  // Set background color for header row  till the end of the row
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '98FB98' }, // Light gray background
};


  // Add rows
  schedule.forEach((row) => {
    worksheet.addRow({
      month: row.month,
      emi: row.emi,
      principal: row.principal,
      interest: row.interest,
      balance: row.balance,  
    });
  });

  // Generate buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  saveAs(blob, "Amortization-Schedule.xlsx");
};
