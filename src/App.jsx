// Giovanni Pio Tomasela, 04 July 2023
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Collapse, Typography, useMediaQuery  } from '@mui/material';
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { UilPhone, UilAt, UilGlobe, UilLocationPoint } from '@iconscout/react-unicons'
import './App.css'

function App() {
  const [contacts, setContacts] = useState([]);
  const [expanded, setExpanded] = React.useState(-1);
  const responsive = useTheme();
  const screenMobile = useMediaQuery(responsive.breakpoints.down('sm'));

  // General API-call boilerplate function
  const APICall = (requestBody, path, methodType, headersData) => {
    if (requestBody !== null) requestBody = JSON.stringify(requestBody);
    return new Promise((resolve, reject) => {
      const init = {
        method: methodType,
        headers: headersData,
        body: requestBody,
      }
      fetch(`${path}`, init)
        .then(response => {
          if (response.status === 200) {
            return response.json().then(resolve);
          } else if (response.status === 400) {
            return response.json().then(obj => {
              reject(obj.message);
            });
          } else if (response.status === 403) {
            return response.json().then(obj => {
              reject(obj.message);
            });
          } else {
            throw new SyntaxError(`Error with API call`);
          }
        });
    })
  }

  const fetchContacts = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const data = await APICall(null, 'https://jsonplaceholder.typicode.com/users', 'GET', headers);
      // const sortedData = data.sort((a, b) => a.name-b.name);
      const sortedData = [...data].sort((a, b) =>
      a.name > b.name ? 1 : -1,
      );
      setContacts(sortedData);
    } catch (error) {
      alert('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
    // console.log(contacts)
  }, );

  const handleCardClick = (contactId) => {
    setExpanded(contactId === expanded ? -1 : contactId);
  };

  let theme = createTheme({
    typography: {
      color: '#e3e3ed',
      fontFamily: [
        'Quicksand', 
        'sans-serif',
      ].join(','),
      fontSize: screenMobile ? 11 : 14
    },
  });

  const iconscoutSize = screenMobile ? 15 : 20
  return (
    <ThemeProvider theme={theme}>
      <div className='background' sx={{ fontFamily: 'Quicksand, sans-serif' }}>
        <Box sx={{ padding: '2rem', color: '#101019'}}>
          <Typography variant="h2" sx={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            Contact List
          </Typography>
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              sx={{ margin: '0 auto', marginBottom: '1rem', cursor: 'pointer', width: screenMobile ? '85%' : '65%', backgroundColor: '#545284' , color: '#e3e3ed'}}
              onClick={() => handleCardClick(contact.id)}
              className='card'
            >
              <CardContent sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#e3e3ed'}}>
                <div>
                  <Typography variant="h5" component="div" sx={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {contact.name}
                  </Typography>
                  <Box sx={{display: 'flex' , color: '#e3e3ed'}}>
                    <UilPhone size={iconscoutSize} /> 
                    <Typography variant="h6" component="div" sx={{ marginLeft: '5px', marginTop: '-1px' }}>
                      {contact.phone} 0
                    </Typography>
                  </Box>
                </div>
              </CardContent>
              <Collapse  in={expanded === contact.id} timeout="auto">
                <CardContent>
                <Box sx={{display: 'flex' , color: '#e3e3ed' , flexWrap: 'wrap'}}>
                  <Box sx={{display: 'flex' , color: '#e3e3ed'}}>
                    <UilAt size={iconscoutSize}/> 
                    <Typography ariant="h8" component="div" sx={{ marginLeft: '5px', marginTop: '-1px', marginRight: screenMobile ? '0px' : '5px' }}>
                      {contact.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{display: 'flex' , color: '#e3e3ed'}}>
                  <UilGlobe size={iconscoutSize} />
                  <Typography ariant="h8" component="div" sx={{ marginLeft: '5px', marginTop: '-1px' }}>
                    {contact.website}
                  </Typography>
                </Box>
                <Box sx={{display: 'flex' , color: '#e3e3ed', flexWrap: 'nowrap'}}>
                  <UilLocationPoint size={iconscoutSize} />
                  <Typography ariant="h8" component="div" sx={{ marginLeft: '5px', marginTop: '-1px' }}>
                    {contact.address.suite} {contact.address.street}, {contact.address.city}
                  </Typography>
                </Box>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
