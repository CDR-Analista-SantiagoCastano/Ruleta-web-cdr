import { useState, useEffect } from "react";
import styled from "styled-components";
import { Wheel } from "react-custom-roulette";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { GetResultado } from "../../index";
import useSound from "use-sound";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export function Ruleta() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null); 
  const [isSpinning, setIsSpinning] = useState(false); 

  const { state } = useLocation();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const nit = state?.nit;
  const n_pedido = state?.n_pedido;
  const monto = state?.monto;
  const celular = state?.celular;

  const [gano, setGano] = useState(false);

  const premiosData = state?.premios?.map((p) => ({ option: p })) || [];

  const [playSoundRoulette, { stop: stopSoundRoulette }] = useSound("ruleta-snido-recortado.mp3", {
    volume: 0.75,
    loop: false,
  });

  const [playSoundWinner, { stop: stopSoundWinner }] = useSound("ganador 2.mp3", {
    volume: 0.75,
  });

  const [playSoundLoser, { stop: stopSoundLoser }] = useSound("perder.mp3", {
    volume: 0.5,
  });

  const navigate = useNavigate();

  function mostrarPremio(gano, premio) {
    stopSoundRoulette();
    if (gano) {
      playSoundWinner();
      // SOLUCIÓN: Es mejor establecer explícitamente en true que hacer un toggle.
      setShowConfetti(true);
      Swal.fire({
        title: `<h2 style="color:#2ecc71; font-weight:bold;">🎉 ¡Felicidades! 🎉</h2>`,
        html: `
         <p style="font-size:1.2rem; color:#333;">Has ganado:</p>
         <div style="
           background: linear-gradient(135deg, #f9d423 0%, #ff4e50 100%);
           color: white;
           padding: 20px;
           border-radius: 15px;
           font-size: 1.5rem;
           font-weight: bold;
           margin: 10px 0;
           box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
         ">
           ${premio}
         </div>
         <p style="font-size:1rem; color:#666;">Nuestro equipo se asegurará de entregarte tu premio 🎁</p>
       `,
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "🏆 ¡Genial!",
        confirmButtonColor: "#27ae60",
      }).then(() => {
        navigate("/");
        stopSoundWinner()
      });
    } else {
      playSoundLoser();
      Swal.fire({
        title: `<h2 style="color:#e74c3c; font-weight:bold;">😔 ¡Sigue intentando!</h2>`,
        html: `
         <p style="font-size:1.2rem; color:#333;">Esta vez no ganaste un premio.</p>
         <p style="font-size:1rem; color:#666;">Pero no te desanimes, cada nuevo pedido es otra oportunidad 🎲</p>
         <div style="
           background: #f0f0f0;
           padding: 15px;
           border-radius: 10px;
           font-size: 1.1rem;
           color: #555;
           margin-top: 10px;
         ">
           Realiza tu próximo pedido y participa automáticamente.
         </div>
       `,
        icon: "info",
        showConfirmButton: true,
        confirmButtonText: "🚀 Entendido",
        confirmButtonColor: "#3498db",
        backdrop: `
         rgba(0,0,0,0.4)
         left top
         no-repeat
       `
      }).then(() => {
        navigate("/");
        stopSoundLoser();
      });
    }
  }

  useEffect(() => {
    if (prizeNumber !== null && !mustSpin) {
      setMustSpin(true);
      playSoundRoulette();
    }
  }, [prizeNumber, mustSpin, playSoundRoulette]);


  const handleSpinClick = async () => {
    if (isSpinning || premiosData.length === 0) return;

    setIsSpinning(true);

    const datos = {
      nit: nit,
      n_pedido: n_pedido,
      monto: monto,
      celular: celular
    };

    try {
      const response = await GetResultado(datos);

      if (!response.error) {
        setGano(response.resultado.gano);
        setPrizeNumber(response.resultado.resultado);
      } else {
        throw new Error(response.detail);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Ocurrió un problema al obtener el resultado.",
        icon: "error"
      }).then(() => {
        navigate("/");
      });
      setIsSpinning(false);
    }
  };

  return (
    <Container>
      <img className="logo" src="LOGO CDR.png" alt="logo" />

      <div>
        <h1 style={{ marginBottom: "0px", fontSize: "4rem" }}>
          RULETA DE <span style={{ position: "relative", display: "inline-block" }}>
            REGALOS
            <span
              style={{
                position: "absolute",
                right: "-45px",
                bottom: "0px",
                background: "red",
                color: "white",
                fontSize: "1.2rem",
                padding: "4px 6px",
                transform: "rotate(-25deg)",
                borderRadius: "6px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
            >
              ¡SUERTE!
            </span>
          </span>
        </h1>
      </div>

      <p style={{ margin: "0px" }}>NIT: {nit}, PEDIDO: {n_pedido}, CELULAR: {celular} </p>

      {premiosData.length > 0 && (
        <div className="ruleta-container">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={premiosData}
            spinDuration={0.8} // Se puede ajustar para una sensación más rápida o lenta
            backgroundColors={[
              "#6A1B9A", // Morado
              "#D82133", // Rojo
              "#F67C23", // Naranja
              "#F4E11D", // Amarillo
              "#257E45", // Verde
              "#1565C0", // Azul
            ]}
            textColors={["#FFFFFF"]}
            onStopSpinning={() => {
              setMustSpin(false);
              setIsSpinning(false);
              setPrizeNumber(null); 
              mostrarPremio(gano, premiosData[prizeNumber].option);
            }}
            outerBorderWidth={10}
            outerBorderColor={"#D6AF5C"}
            innerRadius={15}
            radiusLineColor={"#373735"}
          />
        </div>
      )}

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          style={{ zIndex: 2000, position: "fixed", top: 0, left: 0 }}
        />
      )}
      
      <button onClick={handleSpinClick} disabled={isSpinning}>
        {isSpinning ? "Girando..." : "Girar"}
      </button>

      <p style={{ borderTop: "1px solid red", borderBottom: "1px solid red", padding: "10px" }}>
        SIGUENOS EN INSTAGRAM: @cdr.online
      </p>

    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;

  img {
    max-width: 50%;
    max-height: 150;
  }

  .logo {
    position: absolute;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 180px;
    z-index: 0; /* siempre al fondo */
    pointer-events: none;
  }

  button {
    max-width: 80%;
    margin-top: 20px;
    padding: 15px 30px;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 8px;
    border: none;
    background-color: #27ae60;
    color: white;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.2s;

    &:hover:not(:disabled) {
      background-color: #2ecc71;
      transform: translateY(-2px);
    }

    &:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
  }

  .confetti-container {
    z-index: 100;
  }
`;