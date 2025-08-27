import styled from 'styled-components';
import './App.css'
import { MyRoutes, RouletteImages } from "./index"

function App() {
  return (
    <PageLayout>
      <MainContent>
        <MyRoutes />
      </MainContent>

      <MarqueeContainer>
        <RouletteImages />
      </MarqueeContainer>
    </PageLayout>
  );
}

export default App;

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; 
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  margin-bottom: 25px;
`;

const MarqueeContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
`;