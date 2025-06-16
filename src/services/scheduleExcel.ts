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

  // Add rows
  schedule.forEach((row) => {
    worksheet.addRow({
      month: row.month,
      emi: parseFloat(row.emi.replace(/,/g, "") ),
      principal: parseFloat(row.principal.replace(/,/g, "") ),
      interest: parseFloat(row.interest.replace(/,/g, "") ),
      balance: parseFloat(row.balance.replace(/,/g, "") ),
    });
  });

  // Generate buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  saveAs(blob, "Amortization-Schedule.xlsx");
};
