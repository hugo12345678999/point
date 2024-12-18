import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./EditPagamento.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../utils/links";
import axios from "axios";
import question_icon from "../../../assets/images/question.png";

const EditPagamento = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const maquinaInfos = location.state;

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const [data, setData] = useState({
    nome: maquinaInfos?.nome ?? "",
    descricao: maquinaInfos?.descricao ?? "",
    estoque: Number(maquinaInfos?.estoque) ?? 0,
    estoquebaixo: Number(maquinaInfos?.estoquebaixo) ?? 0,
    estado: Number(maquinaInfos?.estado) ?? 0,
    contadorcredito: Number(maquinaInfos?.contadorcredito) ?? 0,
    contadorcreditobaixo: Number(maquinaInfos?.contadorcreditobaixo) ?? 0,
    contadorpelucia: Number(maquinaInfos?.contadorpelucia) ?? 0,
    contadorpeluciabaixo: Number(maquinaInfos?.contadorpeluciabaixo) ?? 0,
    store_id: Number(maquinaInfos?.storeId) ?? 0,
    valorDoPulso: maquinaInfos?.pulso ?? 0,
    maquininha_serial: String(maquinaInfos?.maquininha_serial),
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

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
        {
          id,
          nome: data.nome,
          descricao: data.descricao,
        
         
          contadorcreditobaixo: Number(data.contadorcreditobaixo),
          contadorpelucia: Number(data.contadorpelucia),
          contadorpeluciabaixo: Number(data.contadorpeluciabaixo),
          store_id: String(data.store_id),
          valorDoPulso: data.valorDoPulso,
          maquininha_serial: String(data.maquininha_serial),
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
        navigate(links.DASHBOARD_FORNECEDOR);
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
 
  const credito = () => {
    // check require
    let errorsTemp = {};

  

  
    if (data.contadorcredito < 0) {
      errorsTemp.contadorcredito = "RELOGIOO CREDITO é obrigatório";
    }
    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
        {
          id,

          contadorcredito: Number(data.contadorcredito),
         
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
        navigate(links.DASHBOARD_FORNECEDOR);
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

  const pelucia = () => {
    // check require
    let errorsTemp = {};

  

  
    if (data.contadorcredito < 0) {
      errorsTemp.estoque = "Estoque é obrigatório";
    }
    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }

    setIsLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_SERVIDOR}/maquina-cliente`,
        {
          id,

          estoque: Number(data.estoque),
         
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
        navigate(links.DASHBOARD_FORNECEDOR);
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




  return (
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">EDITAR MÁQUINA</div>
        </div>

        <Button
          className="EditPagamentos_header_back"
          onClick={() => {
            navigate(`${links.FORNECEDOR_SEARCH_CANAIS}/${id}`, {
              state: location.state,
            });
          }}
        >
          <span>VOLTAR</span>
        </Button>
      </div>

      <div className="Update_Pagamento_content">
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="nome">
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
            className={`${!!errors.nome ? "Update_Pagamento_inputError" : ""}`}
          />
          {errors.nome && (
            <div className="Update_Pagamento_itemFieldError">{errors.nome}</div>
          )}
        </div>
        <div className="Update_Pagamento_itemField">
          <label
            className="Update_Pagamento_itemFieldLabel"
            htmlFor="descricao"
          >
            Descricão:
          </label>
          <Input
            placeholder={"Máquina"}
            value={data.descricao}
            id="descricao"
            type="text"
            name="descricao"
            autoComplete="descricao"
            onChange={(event) => {
              handleChange("descricao", event.target.value);
            }}
            className={`${
              !!errors.descricao ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.descricao && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.descricao}
            </div>
          )}
        </div>
       
    
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="contadorcreditobaixo">
            RELOGIO CREDITO BAIXO:
          </label>
          <Input
            placeholder={"1.50"}
            value={data.contadorcreditobaixo}
            id="contadorcreditobaixo"
            type="number"
            name="contadorcreditobaixo"
            autoComplete="contadorcreditobaixo"
            onChange={(event) => {
              handleChange("contadorcreditobaixo", event.target.value);
            }}
            className={`${
              !!errors.contadorcreditobaixo ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.contadorcreditobaixo && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.contadorcreditobaixo}
            </div>
          )}
        </div>
       
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="contadorpelucia">
            RELOGIO PELUCIA BAIXO:
          </label>
          <Input
            placeholder={"1.50"}
            value={data.contadorpelucia}
            id="contadorpelucia"
            type="number"
            name="contadorpelucia"
            autoComplete="contadorpelucia"
            onChange={(event) => {
              handleChange("contadorpelucia", event.target.value);
            }}
            className={`${
              !!errors.contadorpelucia ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.estoque && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.contadorpelucia}
            </div>
          )}
        </div>
 
        <Button
          className="Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) onSave();
          }}
          disabled={isLoading}
        >
          SALVAR ALTERAÇÕES
        </Button>
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="contadorcredito">
            RELOGIO CREDITO DEFINITIVO:
          </label>
          <Input
            placeholder={"1.50"}
            value={data.contadorcredito}
            id="contadorcredito"
            type="number"
            name="contadorcredito"
            autoComplete="contadorcredito"
            onChange={(event) => {
              handleChange("contadorcredito", event.target.value);
            }}
            className={`${
              !!errors.contadorcredito ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.estoque && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.contadorcredito}
            </div>
          )}
        </div>
        <Button
          className="Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) credito();
          }}
          disabled={isLoading}
        >
          SALVAR CREDITO
        </Button>
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="estoque">
            RELOGIO PELUCIA DEFINITIVO:
          </label>
          <Input
            placeholder={"1.50"}
            value={data.estoque}
            id="estoque"
            type="number"
            name="estoque"
            autoComplete="estoque"
            onChange={(event) => {
              handleChange("estoque", event.target.value);
            }}
            className={`${
              !!errors.estoque ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.estoque && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.estoque}
            </div>
          )}
        </div>
        <Button
          className="Update_Pagamento_saveBtn"
          onClick={() => {
            if (!isLoading) pelucia();
          }}
          disabled={isLoading}
        >
          SALVAR PELUCIA
        </Button>
        
      </div>
    </div>
  );
};

export default EditPagamento;
