import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./point-adm.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import axios from "axios";
import question_icon from "../../../../assets/images/question.png";

const PointAdm = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const { maquinaInfos, clienteInfo } = location.state;

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const [data, setData] = useState({
    nomepoint: maquinaInfos?.nomepoint ?? "",
    tokenpoint: maquinaInfos?.tokenpoint ?? "",
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
    if (data.nomepoint.trim() === "") {
      errorsTemp.nomepoint = "Este campo é obrigatório";
    }
    if (data.tokenpoint.trim() === "") {
      errorsTemp.tokenpoint = "Este campo é obrigatório";
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
          nomepoint: data.nomepoint,
          tokenpoint: data.tokenpoint,
         
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
        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="nome"
          >
            NOME DA POINT:
          </label>
          <Input
            placeholder={"Máquina 1"}
            value={data.nomepoint}
            id="nomepoint"
            type="text"
            name="nomepoint"
            autoComplete="nomepoint"
            onChange={(event) => {
              handleChange("nomepoint", event.target.value);
            }}
            className={`${
              !!errors.nomepoint ? "Admin_Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.nomepoint && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.nomepoint}
            </div>
          )}
        </div>
        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="descricao"
          >
           TOKEN POINT
          </label>
          <Input
            placeholder={"Máquina da padaria de juquinha"}
            value={data.tokenpoint}
            id="tokenpoint"
            type="text"
            name="tokenpoint"
            autoComplete="tokenpoint"
            onChange={(event) => {
              handleChange("tokenpoint", event.target.value);
            }}
            className={`${
              !!errors.tokenpoint ? "Admin_Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.tokenpoint && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.tokenpoint}
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
      </div>
    </div>
  );
};

export default PointAdm;
