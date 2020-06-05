import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import './styles.css';

import logo from '../../assets/logo.svg';

const Home = () => {
  return (
    <div id="home-page">
      <div className="content">
        <header>
          <img src={logo} alt="Green Collect"/>
        </header>

        <main>
          <h1>Your market for waste collection</h1>
          <p>We help people to find collection point efficiently.</p>

          <Link to ="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Register a collection point</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home;