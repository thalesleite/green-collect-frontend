import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { FiArrowLeft } from 'react-icons/fi';

import axios from 'axios';
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface State {
  sigla: string
}

interface City {
  nome: string
}

const CreatePoint = () => {
  const [ items, setItems ] = useState<Item[]>([]);
  const [ states, setStates ] = useState<string[]>([]);
  const [ cities, setCities ] = useState<string[]>([]);

  const [ selectedState, setSelectedState ] = useState('0');
  const [ selectedCity, setSelectedCity ] = useState('0');

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
   }, []);

  useEffect(() => {
    axios.get<State[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const initials = response.data.map(uf => uf.sigla);
      setStates(initials);
    });
  }, []);

  useEffect(() => {
    if ( selectedState === '0' )
      return;

    axios
      .get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
      .then(response => {
        const names = response.data.map(city => city.nome);
        setCities(names);
    });
  }, [selectedState]);

  function handleSelectState(event: ChangeEvent<HTMLSelectElement> ) {
    setSelectedState(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement> ) {
    setSelectedCity(event.target.value);
  }

  return (
    <div id="create-point-page">
      <header>
        <img src={logo} alt="Green Collect" />

        <Link to="/">
          <FiArrowLeft />
          Back to Home
        </Link>
      </header>

      <form>
        <h1>Register Form <br />for Collection Point</h1>

        <fieldset>
          <legend>
            <h2>Data</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Name</label>
            <input 
              type="text"
              name="name"
              id="name"
              />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                name="email"
                id="email"
                />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input 
                type="text"
                name="phone"
                id="phone"
                />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Choose the address in the map</span>
          </legend>

          <Map center={[53.3594112, -6.2455808]} zoom={15}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[53.3594112, -6.2455808]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">State/County</label>
              <select 
                name="uf" 
                id="uf"
                onChange={handleSelectState}>

                <option value="0">Select State/County</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <select 
                name="city" 
                id="city"
                onChange={handleSelectCity}>

                <option value="0">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Collect Items</h2>
            <span>Choose one or more items below</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button>
          Register Collection Point
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;