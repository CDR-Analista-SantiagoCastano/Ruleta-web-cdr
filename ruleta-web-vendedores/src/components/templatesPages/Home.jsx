import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export function Home() {

  const navigate = useNavigate();

  function handleRedirectToForm(inicial, final) {
    navigate("/form", { state: { inicial, final } });
  }

  return (
    <Container>
      <img style={{ margin: "0px" }} src="LOGO CDR.png" alt="logo" />

      <div style={{ margin: "0px" }}>
        <h1 style={{ margin: "0px" }}>GIRA Y GANA</h1>
      </div>

      <div className="text-and-buttons">
        <p>Selecciona el rango de tu compra y obtén tu premio</p>
        <div className="buttons">
          <button onClick={() => handleRedirectToForm(5000000, 9999999)}>$5.000.000 - $10.000.000</button>
          <button onClick={() => handleRedirectToForm(10000000, 19999999)}>$10.000.000 - $20.000.000</button>
          <button onClick={() => handleRedirectToForm(20000000)}>Más de $20.000.000</button>
        </div>
      </div>

      

    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .text-and-buttons {
    display: flex;
    font-size: 1.5rem;
    flex-direction: column;
    align-items: center;
    width: fit-content;

    .buttons {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 20px;

      button { 
        min-width: 100%;
      }
    }
  }

  img {
    max-width: 60%;
    max-height: 200px;
  }
`;
