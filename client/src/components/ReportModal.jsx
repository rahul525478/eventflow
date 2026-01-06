import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportModal = ({ isOpen, onClose, reportData }) => {
    if (!isOpen || !reportData) return null;

    const { title, columns, data } = reportData;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text(title, 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text("EventFlow Dashboard Report", 14, 36);

        // Table
        autoTable(doc, {
            startY: 45,
            head: [columns],
            body: data,
            theme: 'striped',
            headStyles: {
                fillColor: [63, 81, 181], // Indigo
                fontSize: 12,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            styles: {
                fontSize: 10,
                cellPadding: 6
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, 196, 285, { align: 'right' });
        }

        doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100/50 rounded-xl text-indigo-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                            <p className="text-sm text-slate-500">View and export detailed analytics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-auto flex-1 bg-white">
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    {columns.map((col, idx) => (
                                        <th key={idx} className="px-6 py-4">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="px-6 py-4 text-sm text-slate-700 font-medium">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
