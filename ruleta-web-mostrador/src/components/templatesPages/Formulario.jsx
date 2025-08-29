import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GetPremios, Input } from "../../index"
import Swal from "sweetalert2";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";

export function Formulario() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const rango_inicial = state?.inicial;
    const rango_final = state?.final;

    const methods = useForm();

    useEffect(() => {
        Swal.fire({
            title: "Información importante",
            text: "Te recomendamos activar la geolocalización para una mejor experiencia y registro de tus datos.",
            icon: "info",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#2563eb", // azul
        });
    }, []);

    // 🚩 Función para solicitar ubicación
    const solicitarUbicacion = () => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn("Tu navegador no soporta geolocalización");
                resolve(null); // devolvemos null si no hay soporte
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    resolve(coords);
                },
                (error) => {
                    console.warn("No se pudo obtener la ubicación:", error.message);
                    resolve(null); // si el usuario niega o falla, seguimos con null
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    };

    const onSubmit = methods.handleSubmit(async (data) => {

        const coords = await solicitarUbicacion();

        console.log("Coordenadas obtenidas:", coords);
        const datos = {
            nit: data.nit,
            n_pedido: data.n_pedido,
            monto: data.monto,
            celular: data.celular,
            coordenadas: coords,
        };

        // Llamar API
        const response = await GetPremios(datos);

        // Mandar la respuesta a otra página
        if (!response.error) {
            navigate("/ruleta", { state: response.premios });
        } else {
            Swal.fire({
                title: "Error",
                text: response.detail,
                icon: "error"
            });
        }
    })

    return (
        <Container>
            <img style={{ margin: "0px" }} src="LOGO CDR.png" alt="logo" />

            <div style={{ margin: "0px" }}>
                <h1 style={{ margin: "0px" }}>GIRA Y GANA</h1>
            </div>

            <div>
                <p>Antes de probar tu suerte, debes llenar la siguiente información</p>
                <FormProvider {...methods}>
                    <form onSubmit={e => e.preventDefault()} noValidate autoComplete="off">
                        <Input
                            label={"NIT"}
                            name="nit"
                            type="number"
                            id="nit"
                            placeholder="Ingresa tu nit"
                            validation={{
                                required: {
                                    value: true,
                                    message: 'Obligatorio'
                                },
                                min: {
                                    value: 1000,
                                    message: 'Longitud minima de 4 caracteres'
                                }
                            }}
                        />

                        <Input
                            label={"Numero del pedido"}
                            name="n_pedido"
                            type="number"
                            id="n_pedido"
                            placeholder="Ingresa el numero del pedido..."
                            validation={{
                                required: {
                                    value: true,
                                    message: 'Obligatorio'
                                },
                                min: {
                                    value: 1,
                                    message: 'Ingresa un numero valido'
                                }
                            }}
                        />

                        <Input
                            label={"Monto del pedido"}
                            name="monto"
                            type="number"
                            id="monto"
                            placeholder="Ingresa el monto del pedido..."
                            validation={{
                                required: {
                                    value: true,
                                    message: 'Obligatorio'
                                },
                                min: {
                                    value: rango_inicial ?? 0,
                                    message: `El monto mínimo es $${rango_inicial ?? 0}`,
                                },
                                max: {
                                    value: rango_final ?? Number.MAX_SAFE_INTEGER,
                                    message: `El monto máximo es $${rango_final ?? ""}`,
                                },
                            }}
                        />

                        <Input
                            label={"Numero celular"}
                            name="celular"
                            type="text"
                            id="celular"
                            placeholder="Ingresa el numero celular del cliente..."
                            validation={{
                                required: {
                                    value: true,
                                    message: 'Obligatorio'
                                },
                                maxLength: {
                                    value: 15,
                                    message: 'Longitud maxima de 15 caracteres'
                                }
                            }}
                        />

                        <button
                            onClick={onSubmit}
                            className="flex items-center gap-1 p-5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-800"
                        >
                            Guardar
                        </button>
                    </form>
                </FormProvider>
            </div>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  img {
    max-width: 60%;
    max-height: 200px;
  }

  p{
    text-align: center;
    font-size: 1.2rem;
  }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 15px;
    }

    label {
      font-size: 20px;
      text-align: start;
      font-weight: 500;
    }

    input {
      padding: 8px 10px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: #675df1;
        box-shadow: 0 0 0 2px rgba(103, 93, 241, 0.15);
      }
    }

    button {
        width: 100%;
        margin-top: 15px;
    }
`;
