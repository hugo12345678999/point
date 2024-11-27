import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./AdminEditPagamento.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import axios from "axios";
import question_icon from "../../../../assets/images/question.png";

const AdminEditPagamento = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const { maquinaInfos, clienteInfo } = location.state;

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const [data, setData] = useState({
    nome: maquinaInfos?.nome ?? "",
    descricao: maquinaInfos?.descricao ?? "",
    estoque: Number(maquinaInfos?.estoque) ?? 0,
    estoquebaixo: Number(maquinaInfos?.estoquebaixo) ?? 0,
    incremento1: Number(maquinaInfos?.incremento1) ?? 0,
    valorBase1: Number(maquinaInfos?.valorBase1) ?? 0,
    incremento2: Number(maquinaInfos?.incremento2) ?? 0,
    valorBase2: Number(maquinaInfos?.valorBase2) ?? 0,
    incremento3: Number(maquinaInfos?.incremento3) ?? 0,
    valorBase3: Number(maquinaInfos?.valorBase3) ?? 0,
    incremento4: Number(maquinaInfos?.incremento4) ?? 0,
    valorBase4: Number(maquinaInfos?.valorBase4) ?? 0,

    contadorcredito: Number(maquinaInfos?.contadorcredito) ?? 0,
    contadorcreditobaixo: Number(maquinaInfos?.contadorcreditobaixo) ?? 0,
    contadorpelucia: Number(maquinaInfos?.contadorpelucia) ?? 0,
    maquininha_serial: String(maquinaInfos?.maquininha_serial),
    store_id: Number(maquinaInfos?.store_id) ?? 0,
    valorDoPulso: maquinaInfos?.pulso ?? 0,
  });
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const handleChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => {
      let errorsTemp = { ...prev };
      delete errorsTemp[name];
      return errorsTemp;
    });
  };

  const onSave = () => {
    // check require
    let errorsTemp = {};
    if (data.nome.trim() === "") {
      errorsTemp.nome = "Este campo é obrigatório";
    }
    if (data.descricao.trim() === "") {
      errorsTemp.descricao = "Este campo é obrigatório";
    }

    if (data.valorDoPulso < 0) {
      errorsTemp.valorDoPulso = "Este campo é obrigatório";
    }
    if (data.estoque < 0) {
      errorsTemp.estoque = "Estoque é obrigatório";
    }
    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }
   
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/maquina`,
        {
          id,
          nome: data.nome,
          descricao: data.descricao,
          estoque: Number(data.estoque),
          estoquebaixo: Number(data.estoquebaixo),
          contadorcreditobaixo: Number(data.contadorcreditobaixo),
          contadorcredito: Number(data.contadorcredito),
          contadorpelucia: Number(data.contadorpelucia),
          maquininha_serial: String(data.maquininha_serial),
          store_id: String(data.store_id),
          valorDoPulso: data.valorDoPulso,
        },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        navigate(`${links.CLIENTES_MAQUINAS}/${clienteInfo.id}`, {
          state: location.state.clienteInfo,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "A sua sessão expirou, para continuar faça login novamente.",
          });
        } else {
          setNotiMessage({
            type: "error",
            message: "Um erro ocorreu",
          });
        }
      });
  };
  
  const handletele = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/ativarmaxpoint/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "joystick ativada com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar telemetria.",
        });
      });
  };
  const handleJoystick = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/estadojoystick/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "joystick ativada com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar telemetria.",
        });
      });
  };




  const incrementoe = async (valorBase, incremento) => {
    try {
      // Define o estado de carregamento como verdadeiro
      setIsLoading(true);
  
      // Faz a requisição para o servidor com os valores no corpo
      const response = await axios.post(
        `${process.env.REACT_APP_SERVIDOR}/setar-valor/${id}`,
        { valorBase:  [data.valorBase1,data.valorBase2,data.valorBase3,data.valorBase4],
           incremento:  [data.incremento1,data.incremento2,data.incremento3,data.incremento4],
          
          
          }, // Corpo da requisição com os valores
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Define o estado de carregamento como falso
      setIsLoading(false);
  
      // Define a mensagem de sucesso
      setNotiMessage({
        type: "success",
        message: "Joystick ativado com sucesso!",
      });
  
      // Opcional: log da resposta do servidor
      console.log("Resposta do servidor:", response.data);
    } catch (error) {
      // Define o estado de carregamento como falso
      setIsLoading(false);
  
      // Define a mensagem de erro
      setNotiMessage({
        type: "error",
        message: "Erro ao ativar telemetrijjjja.",
      });
  
      // Exibe detalhes do erro no console
      console.error("Erro ao ativar joystick:", error);
    }
  };
  



  const handleWhatsApp = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/estadowhatsaap/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "WhatsApp ativado com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar WhatsApp.",
        });
      });
  };



  const handleplacaverde = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/placa-verde/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "WhatsApp ativado com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar placa-verde.",
        });
      });
  };
  const handleplacatoymix = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/placa-toy-mix/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "WhatsApp ativado com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar toy-mix.",
        });
      });
  };

  const handleplacapreta = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/placa-preta/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "WhatsApp ativado com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar placa-preta.",
        });
      });
  };
  const handleplacapocet = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/placa-pocket/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "WhatsApp ativado com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar placa-pocket.",
        });
      });
  };

  const handleplacadark = () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/placa-dark/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "WhatsApp ativado com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar placa-dark.",
        });
      });
  };
  const handleTelemetria= () => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/estadotelemetria/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "telemetria ativado com sucesso.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Erro ao ativar WhatsApp.",
        });
      });
  };


  return (
    <div className="Admin_PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="Admin_PagamentosSearch_header">
        <div className="Admin_PagamentosSearch_header_left">
          <div className="Admin_Dashboard_staBlockTitle">Editar Máquina</div>
        </div>

        <Button
          className="Admin_EditPagamentos_header_back"
          onClick={() => {
            navigate(`${links.CLIENTES_MAQUINAS_FORNECEDOR_SEARCH}/${id}`, {
              state: location.state,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <div className="Admin_Update_Pagamento_content">
        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="nome"
          >
            Nome:
          </label>
          <Input
            placeholder={"Máquina 1"}
            value={data.nome}
            id="nome"
            type="text"
            name="nome"
            autoComplete="nome"
            onChange={(event) => {
              handleChange("nome", event.target.value);
            }}
            className={!!errors.nome ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.nome && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.nome}
            </div>
          )}
        </div>
        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="descricao"
          >
            Descrição:
          </label>
          <Input
            placeholder={"Máquina da padaria de juquinha"}
            value={data.descricao}
            id="descricao"
            type="text"
            name="descricao"
            autoComplete="descricao"
            onChange={(event) => {
              handleChange("descricao", event.target.value);
            }}
            className={!!errors.descricao ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.descricao && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.descricao}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="store_id"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span>Store_id:</span>
            <Button
              className="Admin_EditPagamentos_header_HelpPage"
              onClick={() => {
                navigate(links.HELP_PAGE, {
                  state: {
                    ...location.state,
                    redirect_url: `${links.CLIENTES_MAQUINAS_EDIT_FORNECEDOR}/${id}`,
                  },
                });
              }}
              disabled={isLoading}
            >
              <img src={question_icon} alt="Help" />
            </Button>
          </label>
          <Input
            placeholder={"12345678"}
            value={data.store_id}
            id="store_id"
            name="store_id"
            min={0}
            autoComplete="store_id"
            onChange={(event) => {
              handleChange("store_id", event.target.value);
            }}
            className={!!errors.store_id ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.store_id && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.store_id}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="valorDoPulso"
          >
            Valor do Pulso:
          </label>
          <Input
            placeholder={"0.00"}
            value={data.valorDoPulso}
            id="valorDoPulso"
            type="number"
            min={0}
            name="valorDoPulso"
            autoComplete="valorDoPulso"
            onChange={(event) => {
              handleChange("valorDoPulso", event.target.value);
            }}
            className={!!errors.valorDoPulso ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.valorDoPulso && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.valorDoPulso}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="estoque"
          >
            RELOGIO PELUCIA:
          </label>
          <Input
            placeholder={"0"}
            value={data.estoque}
            id="estoque"
            type="number"
            min={0}
            name="estoque"
            autoComplete="estoque"
            onChange={(event) => {
              handleChange("estoque", event.target.value);
            }}
            className={!!errors.estoque ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.estoque && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.estoque}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="estoque"
          >
            RELOGIO CREDITO:
          </label>
          <Input
            placeholder={"0"}
            value={data.contadorcredito}
            id="contadorcredito"
            type="number"
            min={0}
            name="contadorcredito"
            autoComplete="contadorcredito"
            onChange={(event) => {
              handleChange("contadorcredito", event.target.value);
            }}
            className={!!errors.contadorcredito ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.contadorcredito && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.contadorcredito}
            </div>
          )}
        </div>
        
        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="maquininha_serial"
          >
            SERIAL MAQUINA PAGSEGURO:
          </label>
          <Input
            placeholder={"0"}
            value={data.maquininha_serial}
            id="maquininha_serial"
            type="text"
            min={0}
            name="maquininha_serial"
            autoComplete="maquininha_serial"
            onChange={(event) => {
              handleChange("maquininha_serial", event.target.value);
            }}
            className={!!errors.maquininha_serial ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.maquininha_serial && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.maquininha_serial}
            </div>
          )}

        </div>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) onSave();
          }}
          disabled={isLoading}
        >
          SALVAR ALTERAÇÕES
        </Button>
        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="valorBase1"
          >
           VALOR BASE 1:
          </label>
          <Input
            placeholder={"0"}
            value={data.valorBase1}
            id="valorBase1"
            type="text"
            min={0}
            name="valorBase1"
            autoComplete="valorBase1"
            onChange={(event) => {
              handleChange("valorBase1", event.target.value);
            }}
            className={!!errors.valorBase1 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.valorBase1 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.valorBase1}
            </div>
          )}
           </div>
           <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="incremento1"
          >
           PULSO 1:
          </label>
          <Input
            placeholder={"0"}
            value={data.incremento1}
            id="incremento1"
            type="text"
            min={0}
            name="incremento1"
            autoComplete="incremento1"
            onChange={(event) => {
              handleChange("incremento1", event.target.value);
            }}
            className={!!errors.incremento1 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.incremento1 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.incremento1}
            </div>
          )}
           </div>
           <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="valorBase2"
          >
           VALOR BASE 2:
          </label>
          <Input
            placeholder={"0"}
            value={data.valorBase2}
            id="valorBase2"
            type="text"
            min={0}
            name="valorBase2"
            autoComplete="valorBase2"
            onChange={(event) => {
              handleChange("valorBase2", event.target.value);
            }}
            className={!!errors.valorBase2 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.valorBase2 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.valorBase2}
            </div>
          )}
           </div>
           <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="incremento2"
          >
           PULSO 2:
          </label>
          <Input
            placeholder={"0"}
            value={data.incremento2}
            id="incremento2"
            type="text"
            min={0}
            name="incremento2"
            autoComplete="incremento2"
            onChange={(event) => {
              handleChange("incremento2", event.target.value);
            }}
            className={!!errors.incremento2 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.incremento2 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.incremento2}
            </div>
          )}
           </div>
           <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="valorBase3"
          >
           VALOR BASE 3:
          </label>
          <Input
            placeholder={"0"}
            value={data.valorBase3}
            id="valorBase3"
            type="text"
            min={0}
            name="valorBase3"
            autoComplete="valorBase3"
            onChange={(event) => {
              handleChange("valorBase3", event.target.value);
            }}
            className={!!errors.valorBase3 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.valorBase3 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.valorBase3}
            </div>
          )}
           </div>
           <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="incremento3"
          >
           PULSO 3:
          </label>
          <Input
            placeholder={"0"}
            value={data.incremento3}
            id="incremento3"
            type="text"
            min={0}
            name="incremento3"
            autoComplete="incremento3"
            onChange={(event) => {
              handleChange("incremento3", event.target.value);
            }}
            className={!!errors.incremento3 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.incremento1 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.incremento3}
            </div>
          )}
           </div>
           <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="valorBase4"
          >
           VALOR BASE 4:
          </label>
          <Input
            placeholder={"0"}
            value={data.valorBase4}
            id="valorBase4"
            type="text"
            min={0}
            name="valorBase4"
            autoComplete="valorBase4"
            onChange={(event) => {
              handleChange("valorBase4", event.target.value);
            }}
            className={!!errors.valorBase4 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.valorBase4 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.valorBase4}
            </div>
          )}
           </div>
           <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="incremento4"
          >
           PULSO 4:
          </label>
          <Input
            placeholder={"0"}
            value={data.incremento4}
            id="incremento4"
            type="text"
            min={0}
            name="incremento4"
            autoComplete="incremento4"
            onChange={(event) => {
              handleChange("incremento4", event.target.value);
            }}
            className={!!errors.incremento4 ? "Admin_Update_Pagamento_inputError" : ""}
          />
          {errors.incremento4 && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.incremento4}
            </div>
          )}
           </div>
           <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) incrementoe();
          }}
          disabled={isLoading}
        >
          SALVAR CREDITO
        </Button>
        <Button
          className="Admin_Update_Pagamento_deleteBtn"
          onClick={() => {
            navigate(`${links.CLIENTES_MAQUINAS_DELETE_FORNECEDOR}/${id}`, {
              state: location.state,
            });
          }}
          disabled={isLoading}
        >
          EXCLUIR MÁQUINA
        </Button>

        {/* New buttons */}
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleJoystick}
          disabled={isLoading}
        >
          ATIVAR JOYSTICK
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleWhatsApp}
          disabled={isLoading}
        >
          ATIVAR WHATSAPP
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleTelemetria}
          disabled={isLoading}
        >
          ATIVAR TELEMETRIA
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleplacaverde}
          disabled={isLoading}
        >
          PLACA VERDE
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleplacatoymix}
          disabled={isLoading}
        >
          PLACA TOY MIX
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleplacapreta}
          disabled={isLoading}
        >
          PLACA PRETA
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleplacapocet}
          disabled={isLoading}
        >
          PLACA POCKET
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handleplacadark}
          disabled={isLoading}
        >
          PLACA DARK
        </Button>
        <Button
          className="Admin_Update_Pagamento_saveBtn"
          onClick={handletele}
          disabled={isLoading}
        >
          MAX POINT TELEMETRIA
        </Button>
      </div>
    </div>
  );
};

export default AdminEditPagamento;
