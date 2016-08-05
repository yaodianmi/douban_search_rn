/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  ScrollView,
  ListView,
  Text,
  TextInput,
  Switch,
  View
} from 'react-native';

var MOCKED_MOVIES_DATA = [
  {uri: 'https://img3.doubanio.com/f/shire/8308f83ca66946299fc80efb1f10ea21f99ec2a5/pics/nav/lg_main_a11_1.png'},
];
var REQUEST_URL = 'https://api.douban.com/v2/book/search'
var debounce = require('debounce');

class Logo extends Component{
  render(){
    var movie = MOCKED_MOVIES_DATA[0];
    return (
      <Image
        source={{uri: movie.uri}}
        style={styles.logo}
      />
    );
  }
}

class SearchBox extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  render(){
    return (
      <View>
        <TextInput
          style={styles.input}
          placeholder="请输入搜索关键词"
          value={this.props.keyword}
          ref="keywordTextInput"
          onChange={this.handleChange}/>
        <View style={styles.switchWrapper}>
          <Switch
            onValueChange={value => this.handleChange(value)}
            value={this.props.highRatingOnly} />
          <Text style={styles.switchText}>只显示8星以上</Text>
        </View>
      </View>
      //<Text>测试</Text>
    );
  }
  handleChange(obj){
    if (typeof obj == "object") {
      this.props.onUserInput(
        obj.nativeEvent.text,  // obj is event
        this.props.highRatingOnly
      );
    } else {
      this.props.onUserInput(
        this.props.keyword,
        obj  // obj is checked
      );
    }
  }
}

class BookList extends Component{
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }
  renderRow(book){
    return (
      <View style={styles.container}>
        <Image
          source={{uri: book.image}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.title}>{book.author}</Text>
          <Text style={styles.title}>{book.rating.average}</Text>
        </View>
      </View>
    )
  }
  render(){
    if (!this.props.dataSource) {
      return <Text style={styles.container}>...无相关书籍，请重新输入搜索关键词</Text>
    }
    let star8Books = this.props.dataSource.filter((book)=>{
      if(this.props.highRatingOnly && book.rating.average < 8.0){
        return false;
      }
      return true;
    });
    console.log('star8Books: ' + star8Books);
    return (
      <ListView
        dataSource={this.ds.cloneWithRows(star8Books)}
        renderRow={this.renderRow}
        enableEmptySections={true}
      />
    );
  }
}

class douban_search_rn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      keyword: '',
      highRatingOnly: false,
    };
    this.fetchBooksFromApiAsync = debounce(this.fetchBooksFromApiAsync, 500);
    // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向会变为空
    // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
    this.fetchBooksFromApiAsync = this.fetchBooksFromApiAsync.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }
  async fetchBooksFromApiAsync(keyword) {
    try {
      let response = await fetch(REQUEST_URL + '?q=' + keyword + '&count=10');
      let responseJson = await response.json();
      this.setState({
        dataSource: responseJson.books,
      });
    } catch(error) {
      console.error(error);
      alert('🐛🐛🐛');
    }
  }
  handleUserInput(keyword, highRatingOnly){
    this.setState({
        keyword: keyword,
        highRatingOnly: highRatingOnly,
    });
    this.fetchBooksFromApiAsync(keyword);
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <Logo />
        <SearchBox keyword={this.state.keyword} highRatingOnly={this.state.highRatingOnly} onUserInput={this.handleUserInput} />
        <BookList dataSource={this.state.dataSource} highRatingOnly={this.state.highRatingOnly}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:30,
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  logo: {
    width: 153,
    height: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  switchWrapper: {
    flex:1,
    flexDirection: 'row',
    marginBottom:15,
  },
  switchText: {
    marginLeft:10,
    lineHeight: 25,
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
});

AppRegistry.registerComponent('douban_search_rn', () => douban_search_rn);
