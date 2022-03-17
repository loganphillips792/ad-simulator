import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'


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
  border: 2px solid blue;
  margin-right: 5px;
  //   margin-right: 2px;
`;

const Grid = styled.div`
  display: flex;
  
  & > * {
    flex: 1;
    margin: 25px;
  }
`;

const Website = styled.div`
  position: relative;
  background-color: white;
  border: 2px solid red;
  height: 150px;
  width: 50px;
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
  return (
    <Container>
      <ColumnOne>
        <Grid>
          <Website>
            <span>Google.com</span>
            <Links>
              <WebsiteLinkContainer>WEBSITE</WebsiteLinkContainer>
              <InstagramLinkContainer>Instagram</InstagramLinkContainer>
              <AdLibraryLinkContainer>AD LIBRARY</AdLibraryLinkContainer>
              <TikTokLinkContainer>TIK TOK</TikTokLinkContainer>
            </Links>
          </Website>

          <Website>
            <Links>
                <WebsiteLinkContainer>WEBSITE</WebsiteLinkContainer>
                <InstagramLinkContainer>Instagram</InstagramLinkContainer>
                <AdLibraryLinkContainer>AD LIBRARY</AdLibraryLinkContainer>
                <TikTokLinkContainer>TIK TOK</TikTokLinkContainer>
            </Links>
          </Website>
        </Grid>
        <PlusIcon icon={faPlus} />
      </ColumnOne>

      <ColumnTwo />
    </Container>
  );
}

export default App;
