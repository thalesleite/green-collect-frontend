import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import { LeafletMouseEvent } from 'leaflet';
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [ selectedState, setSelectedState ] = useState('0');
  const [ selectedCity, setSelectedCity ] = useState('0');
  const [ selectedItems, setSelectedItems ] = useState<number[]>([]);
  const [ initialPosition, setInitialPosition ] = useState<[number, number]>([0,0]);
  const [ selectedPosition, setSelectedPosition ] = useState<[number, number]>([0,0]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

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

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value});
  }

  function handleSelectItem(id: number) {
    const wasSelected = selectedItems.findIndex(item => item === id);

    if ( wasSelected >= 0 ) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, phone } = formData;
    const uf = selectedState;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      phone,
      uf,
      city,
      latitude,
      longitude,
      items
    }

    await api.post('points', data);

    alert('Collection Point Registered!');

    history.push('/');
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

      <form onSubmit={handleSubmit}>
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
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input 
                type="text"
                name="phone"
                id="phone"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Choose the address in the map</span>
          </legend>

          <Map 
            center={initialPosition} 
            zoom={15}
            onclick={handleMapClick}>

            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
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
              <li 
                key={item.id} 
                className={selectedItems.includes(item.id) ? 'selected' : ''}
                onClick={() => handleSelectItem(item.id)}
              >

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