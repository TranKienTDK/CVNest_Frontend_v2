import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { TemplateCV1 } from '@/pages/user/my-cv/components/CVTemplate/TemplateCV1';

function ViewCVDocument() {
  // Add state to track changes and force re-render
  const [key, setKey] = useState(0);

  // Set up HMR listener
  useEffect(() => {
    // This will force a re-render when the module is hot-updated
    const handleHotUpdate = () => {
      console.log('Hot update detected, re-rendering PDF viewer...');
      setKey(prevKey => prevKey + 1);
    };

    // Check if we're in development mode and HMR is available
    if (import.meta.hot) {
      // Accept updates for this module
      import.meta.hot.accept();

      // Accept updates for the CVDocument component
      import.meta.hot.accept('@/pages/user/my-cv/components/TemplateCV1', () => {
        handleHotUpdate();
      });
    }

    return () => {
      // Clean up if needed
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-screen">
      <h1 className="text-2xl font-bold">CV Document Viewer</h1>

      {/* PDF Viewer with key prop to force re-render */}
      <div className="w-full h-[800px] border shadow-md">
        <PDFViewer width="100%" height="100%" showToolbar key={`viewer-${key}`}>
          {/* Create a new instance of CVDocument on each render */}
          {React.createElement(TemplateCV1)}
        </PDFViewer>
      </div>

      {/* Download Button with key prop to force re-render */}
      <PDFDownloadLink
        document={React.createElement(TemplateCV1)}
        fileName="CV_Document.pdf"
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        key={`download-${key}`}
      >
        {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
}

export default ViewCVDocument;
