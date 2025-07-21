import { Button, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

const Home = () => {
  const [fname, setFname] = useState('');
  const [list, setList] = useState([]);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(
      'https://api.freeapi.app/api/v1/public/randomproducts?page=1&limit=50&inc=category%252Cprice%252Cthumbnail%252Cimages%252Ctitle%252Cid&query=mens-watches',
    );
    const data = await res.json();
    setList(data.data.data);
  };
  const renderItem = ({ item }) => {
    return (
      <Text
        style={{
          marginVertical: 10,
          marginHorizontal: '10%',
          elevation: 2,
          borderRadius: 5,
          paddingHorizontal: 5,
          backgroundColor: '#ccc',
        }}
      >
        {item.title}
      </Text>
    );
  };
  const increment = () => {
    setCounter(counter + 1);
  };
  return (
    <View style={{ flex: 1 }}>
      <Text>Home {counter}</Text>
      <Button title="increment" onPress={increment}></Button>
      <Image
        source={{ uri: 'https://picsum.photos/200/300' }}
        height={100}
        width={100}
        style={{
          position: 'absolute',
          right: 10,
          bottom: 5,
        }}
      ></Image>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
