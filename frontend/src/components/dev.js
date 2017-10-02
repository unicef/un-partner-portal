/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, arrayPush, arrayRemove, FieldArray } from 'redux-form';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography'
import { initSession } from '../reducers/session';
import { loadCountries } from '../reducers/countries';
import getTheme, { muiOldTheme } from '../styles/muiTheme';
import TextForm from './forms/textFieldForm';
import SelectForm from './forms/selectForm';
import LocationForm from './forms/locationForm';
import ArrayForm from './forms/arrayForm';
import SpreadContent from './common/spreadContent';
import GridColumn from './common/grid/gridColumn';
import Divider from 'material-ui/Divider';


import { selectNormalizedCountries } from '../store';


const style = {
  position: 'relative',
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
      <Map containerStyle={style} google={window.google} {...other} >
        {children}
      </Map>
    )
  }
}

const SectorBase = (props) => {
  const { name, countries } = props;

  return (
    <SelectForm
      fieldName={`${name}.country`}
      label="Country"
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
  const { map, bounds, rebound, clearBounds } = props;
  if (bounds && map && rebound) {
    map.fitBounds(bounds);
    clearBounds()
  }
  return (<div />)
}

class AreaBase extends Component {

  constructor() {
    super()
    this.state = {
      pos: null,
      locations: [],
      showMap: true,
      activeMarker: null,
      showingInfoWindow: false,
      hoverMarker: null,
      activeMarkerNumber: null,
      activeLocation: null,
      rebound: true,
    }
    this.geocoder = new google.maps.Geocoder();
    this.mapClicked = this.mapClicked.bind(this);
    this.switchMap = this.switchMap.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.clearBounds = this.clearBounds.bind(this);
  }

  mapClicked(mapProps, map, clickEvent) {
    const {name, index} = this.props;
    this.geocoder.geocode({ location: clickEvent.latLng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK && results) {
        const res = results.filter(loc =>
            loc.types.includes('administrative_area_level_1'))
          .forEach(loc => {
            const newLocation = {
              country_code: loc.address_components[1].short_name,
              admin_level_1: { name: loc.address_components[0].long_name },
              lat: clickEvent.latLng.lat(),
              lon: clickEvent.latLng.lng(),
              formatted_address: loc.formatted_address,
            };
            this.props.dispatch(arrayPush('test', `${name}.locations`, newLocation));
          })
      }
    })
  }

  switchMap() {
    this.setState({ showMap: !this.state.showMap })
  }

  clearBounds() {
    this.setState({rebound: false})
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      activeLocation: props.location,
      activeMarker: marker,
      activeMarkerNumber: props.number,
      showingInfoWindow: true

    });
  }

  renderMarkers() {
    const locations = this.props.values.countries[this.props.index].locations || [];
    return locations.map((location, index) => (
      <Marker
        name={'Marker'+ name + index}
        number={index}
        onMouseEnter={()=> this.setState({hoverMarker: index})}
        location={location.formatted_address}
        onClick={this.onMarkerClick}
        position={{lat: location.lat, lng: location.lon}}
      />)
    )
  }

  renderLocationForms({ fields }) {
    return (<div style={{marginBottom:'8px'}}>
      {fields.map((member, index) => {
        return (
          <SpreadContent>
          <LocationForm fieldName={member}/>
          <Button color="accent" onClick={()=>{fields.remove(index);}}>X</Button>
          </SpreadContent>
        )
      })
      }
      <Divider />
    </div>)
  }

  componentWillUpdate(nextProps, nextState) {
    const { index, countries, values }= this.props;
    const currentCountry = values.countries[index].country;
    const nextCountry = nextProps.values.countries[index].country
    if (currentCountry !== nextCountry) {
      this.geocoder.geocode({ 'address': countries[nextCountry] }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          this.setState({
            pos: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            bounds: results[0].geometry.viewport,
            rebound: true,
          })
        }
      });
    }
  }

  render() {
    const { name, values, index } = this.props;
    const { pos, bounds, rebound, locations, showMap, activeMarkerNumber, activeMarker, showingInfoWindow, activeLocation } = this.state;
    console.log(this.state.hoverMarker)
    return (
      <div>
        <SpreadContent>
          <Typography type="caption">Choose Admin 1 location(s) for this country - pick location(s) from the map
          (optional)
        </Typography>
          <Button color="accent" disabled={!pos} onClick={this.switchMap} >{showMap ? 'hide map' : 'show map'} </Button>
        </SpreadContent>
        <FieldArray
          name={`${name}.locations`}
          component={this.renderLocationForms}
        />
        {pos && showMap && <MapContainer
          initialCenter={pos}
          center={pos}
          streetViewControl={false}
          mapTypeControl={false}
          bounds
          onClick={this.mapClicked}
          visible={!!pos}
        >
          <MapBounder bounds={bounds} rebound={rebound} clearBounds={this.clearBounds} />
          {this.renderMarkers()}
          <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}>
            <SpreadContent>
              <Typography>
                {activeLocation}
              </Typography>
              <button 
                onClick={() => {
                    console.log('dupa')
                    this.props.dispatch(arrayRemove('test', `countries[${index}].locations`, activeMarkerNumber));
                  }
                }
              >
                X
              </button>
            </SpreadContent>
        </InfoWindow>
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


const Area = (sector, index) => {
  return (
    <ConnectedAreaBase
      name={sector}
      index={index}
    />
  )
}


class Dev extends Component {
  render() {
    return (
      <div>
        <ArrayForm
          limit={15}
          fieldName="countries"
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

