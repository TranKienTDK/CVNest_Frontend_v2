import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { TemplateCV1 } from '@/pages/user/my-cv/components/CVTemplate/TemplateCV1';

function ViewCVDocument() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleHotUpdate = () => {
      console.log('Hot update detected, re-rendering PDF viewer...');
      setKey(prevKey => prevKey + 1);
    };

    if (import.meta.hot) {
      import.meta.hot.accept();

      import.meta.hot.accept('@/pages/user/my-cv/components/CVTemplate/TemplateCV1', () => {
        handleHotUpdate();
      });
    }

    return () => {
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-screen">
      <h1 className="text-2xl font-bold">CV Document Viewer</h1>

      <div className="w-full h-[800px] border shadow-md">
        <PDFViewer width="100%" height="100%" showToolbar key={`viewer-${key}`}>
          {React.createElement(TemplateCV1)}
        </PDFViewer>
      </div>

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
