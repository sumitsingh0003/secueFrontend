import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { TextField, Button, Container, Typography, Grid, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './constant';


const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const navigate = useNavigate()

  const [forms, setForms] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'secret-key').toString();
  };

  const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, 'secret-key');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('formData:-', formData)
    const encryptedData = encryptData(formData);
    // console.log('encryptedData:-', encryptedData)

    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/api/forms/${editId}`, { data: encryptedData });
        setEditId(null);
      } else {
        await axios.post(`${API_BASE_URL}/api/forms/`, { data: encryptedData });
      }
      alert('Form submitted successfully');
      setFormData({ name: '', email: '', phone: '', message: '' });
      fetchForms();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/forms/`);   
      const decryptedForms = response.data.data.map(obj => {
        return decryptData(obj);
      });
      // console.log(decryptedForms, 'decryptedForms')
      setForms(decryptedForms);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleEdit = (form) => {
    setFormData({ name: form.name, email: form.email, phone: form.phone, message: form.message });
    setEditId(form._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/forms/${id}`);
      fetchForms();
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const handleViewSingle =(id) =>{
    navigate(`/${id}`)
  }


  useEffect(() => {
    fetchForms();

    // eslint-disable-next-line
  }, []);

  return (

    <Container maxWidth="sm" style={{ display: 'flex', justifyContent:'space-between', maxWidth:'60%'}}>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginRight: '30px' }}>
        <Typography variant="h5" gutterBottom>
          Contact Us
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {editId ? 'Update' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Submitted Forms
        </Typography>
        <List style={{ overflow: 'hidden scroll', maxHeight: '350px'}}>
          {forms.map((form) => (
            <ListItem key={form._id}>
              <ListItemText
                primary={form.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {form.email}
                    </Typography>
                    <br />
                    {form.phone}
                    <br />
                    {form.message}
                  </>
                }
              />
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(form)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(form._id)}>
                <Delete />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleViewSingle(form._id)}>
                <Visibility />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default FormComponent;
