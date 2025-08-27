import styled from 'styled-components';
import './App.css'
import { MyRoutes, RouletteImages } from "./index"
import Marquee from 'react-fast-marquee';

function App() {
  return (
    <PageLayout>
      <MainContent>
        <MyRoutes />
      </MainContent>

      <RouletteImages />

    </PageLayout>
  );
}

export default App;



const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  margin-bottom: 25px;
`;
