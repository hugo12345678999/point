import React, { useContext, useEffect, useState } from "react";
import LoadingAction from "../../../themes/LoadingAction/LoadingAction";
import "./EditarWhatsapp.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as links from "../../../utils/links";
import axios from "axios";
import question_icon from "../../../assets/images/question.png";

const EditarWhatsapp = (props) => {
  const location = useLocation();
  let navigate = useNavigate();

  const maquinaInfos = location.state;

  const { authInfo, setNotiMessage } = useContext(AuthContext);

  const [data, setData] = useState({
    nome: maquinaInfos?.nome ?? "",
    descricao: maquinaInfos?.descricao ?? "",
    whatsapp: maquinaInfos?.whatsapp ?? "",
    apikey: maquinaInfos?.apikey ?? "",
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

    if (data.whatsapp.trim() === "") {
      errorsTemp.valorDoPulso = "Este campo é obrigatório";
    }
    if (data.apikey.trim() === "") {
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
          whatsapp: data.whatsapp,
          apikey: data.apikey,
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
          <div className="Dashboard_staBlockTitle">Editar45678 Máquina</div>
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
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="nome">
            descricao:
          </label>
          <Input
            placeholder={"Máquina 1"}
            value={data.descricao}
            id="descricao"
            type="text"
            name="descricao"
            autoComplete="descricao"
            onChange={(event) => {
              handleChange("descricao", event.target.value);
            }}
            className={`${!!errors.descricao ? "Update_Pagamento_inputError" : ""}`}
          />
          {errors.descricao && (
            <div className="Update_Pagamento_itemFieldError">{errors.descricao}</div>
          )}
          
        </div>
        <div className="Update_Pagamento_itemField">
          <label
            className="Update_Pagamento_itemFieldLabel"
            htmlFor="whatsapp"
          >
            NUMERO DO WHATSAPP:
          </label>
          <Input
            placeholder={"Máquina"}
            value={data.whatsapp}
            id="whatsapp"
            type="number"
            name="whatsapp"
            autoComplete="whatsapp"
            onChange={(event) => {
              handleChange("whatsapp", event.target.value);
            }}
            className={`${
              !!errors.whatsapp ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.whatsapp && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.whatsapp}
            </div>
          )}
        </div>
       
        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="contadorcredito">
            API KEY 
          </label>
          <Input
            placeholder={"1.50"}
            value={data.apikey}
            id="apikey"
            type="number"
            name="apikey"
            autoComplete="apikey"
            onChange={(event) => {
              handleChange("apikey", event.target.value);
            }}
            className={`${
              !!errors.apikey ? "Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.apikey && (
            <div className="Update_Pagamento_itemFieldError">
              {errors.apikey}
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

      </div>
    </div>
  );
};

export default EditarWhatsapp;
