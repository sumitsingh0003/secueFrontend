import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { API_BASE_URL } from './constant';

const SingleUser = () => {
  const { id } = useParams();
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, 'secret-key');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/forms/${id}`);
      const decryptedForms = decryptData(response.data.data);
      //console.log(decryptedForms, 'decryptedForms')

        setForms(decryptedForms);
    } catch (error) {
      console.log(error, 'error')
    } 
  };

  useEffect(() => {
    
    fetchUser();
    // eslint-disable-next-line
  }, [id]);


  const handleHomePage = () =>{
    navigate('/')
  }


  return (
    <div>
      {forms ? (
        <div>
          <h1>{forms.name}</h1>
          <p>Email: {forms.email}</p>
          <p>Phone: {forms.phone}</p>
          <p>Message: {forms.message}</p>
          {/* Add more fields as necessary */}
        </div>
      ) : (
        <div>No user data</div>
      )}

      <button onClick={handleHomePage}>Back to the Home Page</button>
    </div>
  );
};

export default SingleUser;
