import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export function Home() {
  const navigate = useNavigate();

  function handleRedirectToForm(inicial, final) {
    navigate("/form", { state: { inicial, final } });
  }

  return (
    <Container>
      <Logo src="LOGO CDR.png" alt="logo" />
      
      <Title>🎉 GIRA Y GANA 🎉</Title>
      
      <Subtitle>¡Participa y gana al instante!</Subtitle>

      <CTAButton onClick={() => handleRedirectToForm(500000, 1000000)}>
        🎁 ¡Jugar ahora!
      </CTAButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  padding: 20px;
  text-align: center;
`;

const Logo = styled.img`
  max-width: 40%;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 10px 0;
  text-shadow: 2px 2px 5px rgba(155,155,155,0.3);
  animation: pulse 3s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  font-weight: 500;
`;

const CTAButton = styled.button`
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  padding: 15px 25px;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0,0,0,0.3);
  }

  &:active {
    transform: scale(0.97);
  }
`;
