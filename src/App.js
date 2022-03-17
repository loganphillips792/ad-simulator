import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div``;

const WidgetsPreviewContainer = styled.div`
  display: flex;

  & > * {
    flex: 1;
  }

`;

const WidgetsContainer = styled.div`
  background-color: grey;
  margin-right: 2px;
`;


const WidgetsGrid = styled.div`
  display: flex;

  & > * {
    flex: 1;
  }
`;

const WidgetsLinkRow = styled.div`
  display: flex;
`;

const LinkContainer = styled.div`
  border-radius: 5px;
`;

const WebsiteLinkContainer = styled(LinkContainer)`
  background-color: yellow;
`;

const InstagramLinkContainer = styled(LinkContainer)`
  background-color: pink;
`;

const AdLibraryLinkContainer = styled(LinkContainer)`
  background-color: blue;
`;

const TikTokLinkContainer = styled(LinkContainer)`
  background-color: orange;
`;

const Widget = styled.div`
  background-color: white;
  border: 2px solid red;
`;


const PreviewContainer = styled.div`
  background-color: grey;
`;



function App() {
  return (
    <Container>
      hello
      

      <WidgetsPreviewContainer>
        <WidgetsContainer>

         <WidgetsGrid>
           <Widget>
             <WidgetsLinkRow>
              <WebsiteLinkContainer>WEBSITE</WebsiteLinkContainer>
              <InstagramLinkContainer>InstagramLinkContainer</InstagramLinkContainer>
              <AdLibraryLinkContainer>AD LIBARRA</AdLibraryLinkContainer>
              <TikTokLinkContainer>TIK TOK LIBARARY</TikTokLinkContainer>
             </WidgetsLinkRow>
           </Widget>
           <Widget>Two</Widget>
         </WidgetsGrid>

          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </WidgetsContainer>
        <PreviewContainer />
      </WidgetsPreviewContainer>

    </Container>
  );
}

export default App;
