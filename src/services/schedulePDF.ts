import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ScheduleItem {
  month: number;
  emi: string;
  principal: string;
  interest: string;
  balance: string;
}

export const downloadAmortizationPDF = (schedule: ScheduleItem[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Amortization Schedule', 14, 15);

  // Add the schedule table
  autoTable(doc, {
    head: [['Month', 'EMI', 'Principal', 'Interest', 'Balance']],
    body: schedule.map(row => [
      row.month,
      row.emi,
      row.principal,
      row.interest,
      row.balance
    ]),
    startY: 25,
    headStyles: {
      fillColor: [230, 243, 230],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  // Save the PDF
  doc.save('Amortization-Schedule.pdf');
};