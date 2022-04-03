import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from "@chakra-ui/react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { usePopper } from 'react-popper';


const GlobalStyle = createGlobalStyle`
  body {
    background-color: #272932;
  }
`;



const Container = styled.div`
  display: flex;
  height: 100vh;

  // Make the 2 columns take up entire screen
  & > * {
    flex: 1;
  }
`;


const ColumnOne = styled.div`
  margin-right: 5px;
  padding: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  background-color: #828489;
  height: 100px;
  //width: 50px;
  border-radius: 10px;

  .input-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
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
  background-color: #4D7EA8;
`;

const InstagramLinkContainer = styled(Link)`
  background-color: #9E90A2;
`;

const AdLibraryLinkContainer = styled(Link)`
  background-color: #B6C2D9;
`;

const TikTokLinkContainer = styled(Link)`
  background-color: #517F98;
`;

const ColumnTwo = styled.div``;

const PlusIcon = styled(FontAwesomeIcon)`
  font-size: 50px;
`;

const Tooltip = styled.div`
  display: inline-block;
  background-color: #FFFFFF;
  color: #643045;
  font-weight: bold;
  padding: 5px 10px;
  font-size: 13px;
  border-radius: 4px;
`;

const Arrow = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
    
  &:after {
    content: " ";
    position: absolute;
    top: -25px; // we account for the PopperContainer padding
    left: 0;
    transform: rotate(45deg);
    width: 10px;
    height: 10px;
    background-color: white;
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
  }
}
&[data-popper-placement^="top"] > .arrow {
  bottom: -30px;
  :after {
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  }
}
`;

function App() {

  const [websiteInfo, setWebsiteInfo] = useState([]);
  const [update, setUpdate] = useState(false);
  // const [isNameFocused, setIsNamedFocused] = useState(false);
  const [isNameFocused, setIsNamedFocused] = useState(false);


  // popover
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { 
        name: 'arrow', 
        options: { 
          element: arrowElement
       }
      },
      {
        name: "offset",
        options: {
          offset: [0, 10]
        }
      }
    ],
  });

  const [showPopper, setShowPopper] = useState(false);


  useEffect(() => {
    fetch("http://localhost:8000/websiteinfo")
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
      body: JSON.stringify({ brand_name: name })
    }

    fetch("http://localhost:8000/websiteinfo/" + id, requestOptions)
      .then(response => {
        console.log("RESPONSE STATUS", response.status);
        return response.json();
      })
      .then(parsedJSON => console.log("RESPONSE BODY", parsedJSON))

  }

  function handleDelete(id) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }

    fetch("http://localhost:8000/websiteinfo/" + id, requestOptions)
      .then(response => {
        console.log("RESPONSE STATUS", response.status);
        return response.json();
      })
  }

  function handleCreateNewWebsite() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_name: null,
        website_url: null,
        instagram_url: null,
        ads_library_url: null,
        tiktok_url: null
      })
    }

    fetch("http://localhost:8000/websiteinfo/", requestOptions)
      .then(resp => setUpdate(!update))
  }

  return (
    <Container>
      <GlobalStyle />
      <ColumnOne>
        <Grid>
          {websiteInfo.map(function (website, index) {
            return (
              <Website key={index}>
                { console.log("FOCUSED", isNameFocused) }
                <DeleteIcon icon={faXmark} onClick={() => handleDelete(website.id)} />    
                <div className="input-container">
                  {!isNameFocused ? (
                    <Typography onClick={() => { setIsNamedFocused(true); }}>
                      {website.brand_name.String}
                    </Typography>
                  ) : (
                    <TextField
                      autoFocus
                      defaultValue={website.brand_name.String}
                      //onChange={(value) => handleWebsiteNameUpdate(website.id, value)}
                      onBlur={e => { setIsNamedFocused(false); handleWebsiteNameUpdate(website.id, e.target.value); }}
                      variant="standard"
                    />
                  )}
                </div>

                <Links>
                  <WebsiteLinkContainer ref={setReferenceElement} onMouseEnter={() => setShowPopper(true)} onMouseLeave={() => setShowPopper(false)}>WEBSITE</WebsiteLinkContainer>
                  <InstagramLinkContainer>Instagram</InstagramLinkContainer>
                  <AdLibraryLinkContainer>AD LIBRARY</AdLibraryLinkContainer>
                  <TikTokLinkContainer>TIK TOK</TikTokLinkContainer>
                </Links>

                {showPopper && (
                   <Tooltip ref={setPopperElement} style={styles.popper} {...attributes.popper}>
                   Popper element
                   <Arrow ref={setArrowElement} style={styles.arrow} />
                 </Tooltip>
                )}
              </Website>
            )
          })}
        </Grid>
        <PlusIcon icon={faPlus} onClick={handleCreateNewWebsite} />
      </ColumnOne>

      <ColumnTwo />
    </Container>
  );
}

export default App;
