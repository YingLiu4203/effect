import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      console.log(`loading page: ${page}`);
      setLoading(true);
      const apiURL = `http://jsonplaceholder.typicode.com/todos?_limit=10&_page=${page}`;

      fetch(apiURL, { method: "get", signal })
        .then((res) => res.json())
        .then((resJson) => {
          setData(data.concat(resJson));
          setLoading(false);
        })
        .catch((error) => console.log(error.message));

      // cancel function, called the the previous component is destroyed
      return () => {
        console.log(`Aborting fetch ${page}`);
        abortController.abort();
      };
    },

    // dependency
    [page]
  );

  function renderItem({ item, index }) {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{`${index} ${item.title}`}</Text>
      </View>
    );
  }

  function renderFooter() {
    return (
      { loading } && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      )
    );
  }

  function handleLoadMore() {
    setPage(page + 1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={data}
        renderItem={renderItem}
        ListFooterComponent={renderFooter()}
        keyExtractor={(_, index) => index.toString()}
        // Called when all rows have been rendered and the list has been scrolled to within onEndReachedThreshold of the bottom.
        onEndReached={handleLoadMore}
        // Threshold in pixels (virtual, not physical) for calling onEndReached.
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    marginTop: 20,
    backgroundColor: "#f5fcff",
  },
  item: {
    borderBottomColor: "#ccc",
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    padding: 5,
  },
  loader: {
    marginTop: 10,
    alignItems: "center",
  },
});
