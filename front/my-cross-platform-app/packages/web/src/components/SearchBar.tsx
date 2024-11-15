// src/components/SearchBar.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <SearchContainer onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="카페 이름이나 주소를 입력하세요"
      />
      <SearchButton type="submit">검색</SearchButton>
    </SearchContainer>
  );
};

const SearchContainer = styled.form`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 14px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #357abd;
  }
`;

export default SearchBar;