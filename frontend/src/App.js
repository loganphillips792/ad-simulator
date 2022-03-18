import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";

const Container = styled.div`
  display: flex;
  height: 100vh;

  // Make the 2 columns take up entire screen
  & > * {
    flex: 1;
  }
`;


const ColumnOne = styled.div`
  background-color: grey;
  margin-right: 5px;
  padding: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 2px solid red;
  gap: 15px;

  // display: flex;
  // flex-wrap: wrap;
  
  // & > * {
  //   flex: 1;
  //   margin: 25px;
  // }
`;

const Website = styled.div`
  position: relative;
  background-color: #FFF;
  height: 100px;
  //width: 50px;
`;


const DeleteIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 15px;
  cursor: pointer;
`;

const Links = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  bottom: 0;

  & > * {
    flex: 1;
  }
`;

const Link = styled.div`
  border-radius: 5px;
`;

const WebsiteLinkContainer = styled(Link)`
  background-color: yellow;
`;

const InstagramLinkContainer = styled(Link)`
  background-color: pink;
`;

const AdLibraryLinkContainer = styled(Link)`
  background-color: blue;
`;

const TikTokLinkContainer = styled(Link)`
  background-color: orange;
`;

const ColumnTwo = styled.div`
  background-color: grey;
`;

const PlusIcon = styled(FontAwesomeIcon)`
  font-size: 50px;
`;

function App() {

  const [websiteInfo, setWebsiteInfo] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/hello")
      .then(response => response.json())
      .then(data => {
        console.log("DATA", data)
        setWebsiteInfo(data);
      })
  }, [update])

  function handleWebsiteNameUpdate(id, name) {
    console.log("SENDIN DATA", id, name)

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({brand_name: name})
    }

    fetch("http://localhost:8000/websiteinfo/"+id, requestOptions)
    .then(response => {
      console.log("RESPONSE STATUS", response.status);
      return response.json();
    })
    .then(parsedJSON =>  console.log("RESPONSE BODY", parsedJSON))
    
  }

  function handleDelete(id) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }     
    }

    fetch("http://localhost:8000/websiteinfo/"+id, requestOptions)
    .then(response => {
      console.log("RESPONSE STATUS", response.status);
      return response.json();
    })
  }

  function handleCreateNewWebsite() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }     
    }

    fetch("http://localhost:8000/websiteinfo/", requestOptions)
    .then(resp => setUpdate(!update))
  }
  
  return (
    <Container>
      <ColumnOne>
        <Grid>
          {websiteInfo.map(function (website, index) {
            return (
              <Website key={index}>
                <DeleteIcon icon={faXmark} onClick={() => handleDelete(website.id)} />
                <Editable defaultValue={website.brand_name.String} onSubmit={(value) => handleWebsiteNameUpdate(website.id, value)}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Links>
                  <WebsiteLinkContainer>WEBSITE</WebsiteLinkContainer>
                  <InstagramLinkContainer>Instagram</InstagramLinkContainer>
                  <AdLibraryLinkContainer>AD LIBRARY</AdLibraryLinkContainer>
                  <TikTokLinkContainer>TIK TOK</TikTokLinkContainer>
                </Links>
              </Website>
            )
          })}
        </Grid>
        <PlusIcon icon={faPlus} onClick={handleCreateNewWebsite}/>
      </ColumnOne>

      <ColumnTwo />
    </Container>
  );
}

export default App;
