/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

import { initSession } from '../reducers/session';
import { loadCountries } from '../reducers/countries';
import getTheme, { muiOldTheme } from '../styles/muiTheme';
import TextForm from './forms/textFieldForm';
import SelectForm from './forms/selectForm';
import ArrayForm from './forms/arrayForm';

import { selectNormalizedCountries } from '../store';


const style = {
  width: '500px',
  height: '500px'
}

const style2 = {
  width: '100%',
  height: '100%'
}
class MapContainer extends Component {
  render() {
    const { children, ...other } = this.props;
    return (
      <Map style={style} google={window.google} {...other} >
        {children}
      </Map>
    )
  }
}

const SectorBase = (props) => {
  const { name, countries } = props;

  return (
    <SelectForm
      fieldName={`${name}.sector`}
      label="sector"
      values={countries}
    />
  )
}

const ConnectedSectorBase = connect(
  state => ({ countries: selectNormalizedCountries(state) })
)(SectorBase)


const Sector = sector => {
  return (
    <ConnectedSectorBase
      name={sector}
    />
  )
}

const MapBounder = (props) => {
  const { map, bounds } = props;
  if (bounds && map) map.fitBounds(bounds);
  return (<div />)
}

class AreaBase extends Component {

  constructor() {
    super()
    this.state = {
      pos: null,
      locations: [],

    }
    this.geocoder = new google.maps.Geocoder();
    this.mapClicked = this.mapClicked.bind(this);
  }

  mapClicked(mapProps, map, clickEvent) {
    this.geocoder.geocode({ location: clickEvent.latLng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK && results) {
        const res = results.filter(loc =>
          loc.types.includes('administrative_area_level_1'))
          .map(loc => loc.formatted_address)
        this.setState({ locations: this.state.locations.concat(res) });
      }
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (JSON.stringify(nextProps.values.sectors) !== JSON.stringify(this.props.values.sectors)) {
      const [matchedName, sectors, index] = this.props.name.match(/(sectors)\[(\d)\]/);
      const address = nextProps.values[sectors][index].sector;
      this.geocoder.geocode({ 'address': this.props.countries[address] }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          this.setState({
            pos: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            bounds: results[0].geometry.viewport,
          })
        }
      });
    }
  }
  render() {
    const { name, values } = this.props;
    const { pos, bounds, locations } = this.state;
    return (
      <div style={style}>
        {locations}
        {pos && <MapContainer
          initialCenter={pos}
          center={pos}
          streetViewControl={false}
          mapTypeControl={false}
          bounds
          onClick={this.mapClicked}
          visible={!!pos}
        >
          <MapBounder bounds={bounds} />
        </MapContainer >}
  </div>
    )
  }
}

const ConnectedAreaBase = connect(
  state => ({
    values: getFormValues('test')(state),
    countries: state.countries,
  })
)(AreaBase)


const Area = sector => {
  return (
    <ConnectedAreaBase
      name={sector}
    />
  )
}





class Dev extends Component {

  render() {
    return (
      <div>
        <wrappedMap
        />
        <ArrayForm
          limit={15}
          fieldName="sectors"
          outerField={Sector}
          innerField={Area}
        />
      </div>

    );
  }
}
const WrappedDev = GoogleApiWrapper({
  version: '3.exp',
  apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'
})(Dev)



export default reduxForm({
  form: 'test',
})(WrappedDev);

