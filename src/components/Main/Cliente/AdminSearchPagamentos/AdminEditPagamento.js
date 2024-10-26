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
        } else if (err.response.status === 400) {
          setNotiMessage({
            type: "error",
            message: "Já existe uma máquina com esse nome",
          });
          setErrors((prev) => ({
            ...prev,
            nome: "Já existe uma máquina com esse nome",
          }));
        } else {
          setNotiMessage({
            type: "error",
            message: "Um erro ocorreu",
          });
        }
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
      </div>
    </div>
  );
};

export default AdminEditPagamento;
