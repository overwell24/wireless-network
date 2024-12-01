import React, { useState } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = () => {
    onSearch(keyword);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="카페 이름이나 주소를 입력하세요"
        placeholderTextColor="#999"
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={handleSubmit}
      >
        <Text style={styles.searchButtonText}>검색</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default SearchBar;