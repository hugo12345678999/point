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
    contadorcredito: Number(maquinaInfos?.contadorcredito) ?? 0,
    contadorpelucia: Number(maquinaInfos?.contadorpelucia) ?? 0,
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
          contadorcredito: Number(data.contadorcredito),
          contadorpelucia: Number(data.contadorpelucia),
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

  const activateTelemetria = () => {
    axios
      .post(`${process.env.REACT_APP_SERVIDOR}/estadotelemetria/${id}`, {}, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        setNotiMessage({
          type: "success",
          message: "Telemetria ativada com sucesso!",
        });
      })
      .catch((err) => {
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "A sua sessão expirou, para continuar faça login novamente.",
          });
        } else {
          setNotiMessage({
            type: "error",
            message: "Um erro ocorreu ao ativar a telemetria.",
          });
        }
      });
  };

  const activateWhatsApp = () => {
    axios
      .post(`${process.env.REACT_APP_SERVIDOR}/estadowhatsapp/${id}`, {}, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        setNotiMessage({
          type: "success",
          message: "WhatsApp ativado com sucesso!",
        });
      })
      .catch((err) => {
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "A sua sessão expirou, para continuar faça login novamente.",
          });
        } else {
          setNotiMessage({
            type: "error",
            message: "Um erro ocorreu ao ativar o WhatsApp.",
          });
        }
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
        {/* Existing fields... */}

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
          className="Admin_Update_Pagamento_telemetriaBtn"
          onClick={activateTelemetria}
          disabled={isLoading}
        >
          ATIVAR TELEMETRIA
        </Button>
        <Button
          className="Admin_Update_Pagamento_whatsappBtn"
          onClick={activateWhatsApp}
          disabled={isLoading}
        >
          ATIVAR WHATSAPP
        </Button>
      </div>
    </div>
  );
};

export default AdminEditPagamento;
