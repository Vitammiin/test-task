import React, { useState } from 'react';
import { Button, Input, Spacer } from '@nextui-org/react';
import axios from 'axios';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { email });
      setMessage(response.data.message || 'Registration successful!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred!');
    }
  };

  return (
    <div
      style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}
    >
      {/* <Text h2>Register</Text> */}
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <Spacer y={1.5} />
        <Button type="submit" color="primary" fullWidth>
          Submit
        </Button>
      </form>
      <Spacer y={1} />
      {/* {message && <Text color="success">{message}</Text>} */}
    </div>
  );
};

export default RegistrationForm;
