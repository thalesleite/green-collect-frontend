import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import logo from '../../assets/logo.svg';

const CreatePoint = () => {
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

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">State/County</label>
              <select name="uf" id="uf">
                <option value="0">Select State/County</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <select name="city" id="city">
                <option value="0">Select City</option>
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
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Test"/>
              <span>Kitchen Oil</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Test"/>
              <span>Kitchen Oil</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Test"/>
              <span>Kitchen Oil</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Test"/>
              <span>Kitchen Oil</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Test"/>
              <span>Kitchen Oil</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Test"/>
              <span>Kitchen Oil</span>
            </li>
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