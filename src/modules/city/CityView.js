import * as CityState from './CityState';
import * as theme from '../../utils/theme';
import Button from '../../components/Button';
import PageIndicator from '../../components/PageIndicator';
import React, {PropTypes} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  Platform,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

const window = Dimensions.get('window');

// City offices
const offices = require('../../data/sampleLocations.json');

const CityView = React.createClass({
  propTypes: {
    office: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    place: PropTypes.object,
    position: PropTypes.number.isRequired
  },

  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(offices)
    };
  },

  selectOffice(office) {
    this.props.dispatch(CityState.selectOffice(office));
  },

  changePositionPager(position) {
    this.props.dispatch(CityState.changePosition(position));
  },

  renderRow(rowData, section, index) {
    // Show pageIndicator and button for Android on the row because the function
    // 'onChangeVisibleRows' does not work for Android
    let androidView = (Platform.OS === 'android')
      ? (<View style={styles.buttonsContainer}>
          <PageIndicator pageCount={offices.length}
            selectedIndex={+index}
            style={styles.pageIndicator} />
          <Button
              text="WHAT'S FOR LUNCH?"
              style={theme.buttons.primary}
              textStyle={theme.fonts.primary}
              action={() => this.selectOffice(offices[index])} />
        </View>)
      : (<View/>);

    return (
      <View style={styles.cityCard}>
        <TouchableOpacity onPress={() => this.selectOffice(offices[index])}>
          <Image source={{uri: rowData.picture}} style={styles.image} />
        </TouchableOpacity>
        <Text style={[theme.fonts.h2, styles.title]}>
          {rowData.city.toUpperCase()}
        </Text>
        {androidView}
      </View>
    );
  },

  // This method is currently only working on iOS but not on Android
  onChangeVisibleRows(visibleRows) {
    const visibleRowNumbers = Object.keys(visibleRows.s1).map((row) => parseInt(row));
    if (visibleRowNumbers.length === 2) {
      // visible row is visibleRowNumbers[0]
      // but in the case of the last item it is visibleRowNumbers[1]
      if (visibleRowNumbers[1] === (offices.length - 1)) {
        this.changePositionPager(visibleRowNumbers[1]);
      } else {
        this.changePositionPager(visibleRowNumbers[0]);
      }
    }
    if (visibleRowNumbers.length === 3) {
      // visible row is visibleRowNumbers[1]
      this.changePositionPager(visibleRowNumbers[1]);
    }
  },

  render() {
    var spinner = this.props.loading
      ? (<ActivityIndicator style={styles.spinner} size='large' color='white'/>)
      : (<View/>);

    // Hide pageIndicator and button for Android because the function
    // 'onChangeVisibleRows' does not work for Android
    let iosView = (Platform.OS === 'ios')
      ? (<View style={styles.buttonsContainer}>
          <PageIndicator pageCount={offices.length}
            selectedIndex={this.props.position}
            style={styles.pageIndicator} />
          <Button
              text="WHAT'S FOR LUNCH?"
              style={theme.buttons.primary}
              textStyle={theme.fonts.primary}
              action={() => this.selectOffice(offices[this.props.position])} />
         </View>)
      : (<View/>);

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={styles.swiper}
          vertical={false}
          alwaysBounceVertical={false}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={true}
          loop={true}
          onChangeVisibleRows={this.onChangeVisibleRows}
        />
        {iosView}
        {spinner}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  row: {
    flex: 1
  },
  swiper: {
    flex: 1
  },
  cityCard: {
    flex: 1,
    overflow: 'hidden',
    width: window.width,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 30
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: window.height,
    backgroundColor: 'rgba(0,0,0,.7)'
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: theme.colors.tab
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  title: {
    marginTop: 30,
    fontWeight: '500'
  },
  pageIndicator: {
    marginBottom: 30
  },
  buttonsContainer: {
    marginBottom: 40,
    margin: 10
  }
});

export default CityView;
