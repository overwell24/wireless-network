// src/pages/CafeDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const CafeDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>카페 상세 페이지</h1>
      <p>카페 ID: {id}</p>
    </div>
  );
};

export default CafeDetailPage;