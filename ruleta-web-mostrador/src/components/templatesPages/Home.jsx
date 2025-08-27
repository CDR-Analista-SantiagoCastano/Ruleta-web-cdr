import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {RouletteImages} from "../../index"

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
        <p>Ingresa y obtén tu premio</p>
        <div className="buttons">
          <button onClick={() => handleRedirectToForm(500000, 1000000)}>Entrar</button>
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

  @keyframes crecerElemento {
    0% {
      transform: scale(1); /* Estado inicial */
    }
    50% {
      transform: scale(1.2); /* Se hace más grande */
    }
    100% {
      transform: scale(1); /* Vuelve a su tamaño original */
    }
  }
`;
