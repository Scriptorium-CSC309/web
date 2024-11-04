// /pages/docs.tsx

import React from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to prevent SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const DocsPage: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      {/* Point SwaggerUI to the API route serving the Swagger spec */}
      <SwaggerUI url="/api/swagger" />
    </div>
  );
};

export default DocsPage; // Protect the docs page if needed
