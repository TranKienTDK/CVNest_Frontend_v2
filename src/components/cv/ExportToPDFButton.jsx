import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cvAPI from '@/api/cv';

/**
 * Button component for exporting CV to PDF
 * @param {Object} props Component props
 * @param {string} props.cvId ID of the CV to export
 * @param {string} props.htmlContent HTML content for the CV
 * @param {string} props.cssContent CSS content for styling the CV
 * @param {string} props.variant Button variant (default, outline, etc.)
 * @param {Object} props.className Additional CSS classes
 */
const ExportToPDFButton = ({ cvId, htmlContent, cssContent, variant = "default", className = "" }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!cvId || !htmlContent) {
      console.error('Missing required data for export (cvId or HTML content)');
      return;
    }

    setIsExporting(true);
    try {
      const response = await cvAPI.exportCVToPDF(cvId, htmlContent, cssContent);
      
      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `cv-export-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CV to PDF:', error);
      // You could add a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleExport}
      disabled={isExporting || !cvId}
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {isExporting ? 'Exporting...' : 'Export to PDF'}
    </Button>
  );
};

export default ExportToPDFButton;