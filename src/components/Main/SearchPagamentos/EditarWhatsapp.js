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
    whatsapp: maquinaInfos?.whatsapp?.replace(/^55/, "") ?? "", // Remove '55' se já estiver presente
    apikey: maquinaInfos?.apikey ?? "",
    contadorpelucia: maquinaInfos?.contadorpelucia ?? "",
    estoque: maquinaInfos?.estoque ?? "",
    mercadoPagoId: maquinaInfos?.mercadoPagoId ?? "", // Adicionei essa linha para incluir mercadoPagoId
    estoque2: maquinaInfos?.estoque2 ?? "", // Adicionei essa linha para incluir mercadoPagoId
  });
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const token = authInfo?.dataUser?.token;

  const { id } = useParams();

  const handleChange = (name, value) => {
    // Adiciona o código '55' ao campo de WhatsApp
    if (name === "whatsapp") {
      value = `55${value.replace(/^55/, "")}`; // Adiciona '55' se não estiver presente
    }
    
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
    // Verificação de campos obrigatórios
    let errorsTemp = {};
  


    if (Object.keys(errorsTemp).length > 0) {
      setErrors(errorsTemp);
      return;
    }
  
    setIsLoading(true);
    axios
    .post(
      `${process.env.REACT_APP_SERVIDOR}/apikey/${id}`,
      {
      
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
      if (res.status === 200) {
        setNotiMessage({
          type: "success",
          message: "Dados salvos com sucesso!",
        });
      
      }
    })
    axios
    .post(
      `${process.env.REACT_APP_SERVIDOR}/whatsapp/${id}`,
      {
      
        whatsapp: data.whatsapp,
        
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
      if (res.status === 200) {
        setNotiMessage({
          type: "success",
          message: "Dados salvos com sucesso!",
        });
      
      }
    })
    // Requisição PUT para /maquina-cliente
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
        if (res.status === 200) {
          setNotiMessage({
            type: "success",
            message: "Dados salvos com sucesso!",
          });
        
        }
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
  
  const whatsapp = () => {
    setIsLoading(true);
  
    // Primeira requisição POST para registrar entrada de pelúcia
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/envia/${id}`,
        {
          valorAdicional: 10, // Usando o valor de mercadoPagoId
         
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
        setNotiMessage({
          type: "success",
          message: "Entrada do produto registrada e estoque atualizado com sucesso!",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Um erro ocorreu ao registrar a entrada do produto ou atualizar o estoque",
        });
      });
  };
  



  


  const onEntradaPelucia = () => {
    setIsLoading(true);
  
    // Primeira requisição POST para registrar entrada de pelúcia
    axios
      .post(
        `${process.env.REACT_APP_SERVIDOR}/entrada_pelucia/${id}/?valor=1`,
        {
          mercadoPagoId: data.mercadoPagoId, // Usando o valor de mercadoPagoId
          estoque2: data.mercadoPagoId, // Armazenando o valor de mercadoPagoId em estoque2
        },
        {
          headers: {
            "x-access-token": token,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        // Segunda requisição POST para atualizar o estoque
        return axios.post(
          `${process.env.REACT_APP_SERVIDOR}/informacao/${id}`,
          {
            informacao: data.mercadoPagoId, // Usando o valor de mercadoPagoId para atualizar estoque2
          },
          {
            headers: {
              "x-access-token": token,
              "content-type": "application/json",
            },
          }
        );
      })
      .then((res) => {
        setIsLoading(false);
        setNotiMessage({
          type: "success",
          message: "Entrada do produto registrada e estoque atualizado com sucesso!",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setNotiMessage({
          type: "error",
          message: "Um erro ocorreu ao registrar a entrada do produto ou atualizar o estoque",
        });
      });
  };
  
  
  
  
  return (
    <div className="PagamentosSearch_container">
      {isLoading && <LoadingAction />}
      <div className="PagamentosSearch_header">
        <div className="PagamentosSearch_header_left">
          <div className="Dashboard_staBlockTitle">EDITAR FUNCOES</div>
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
        {/* Campos de entrada e validação */}
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
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="descricao">
            Descrição:
          </label>
          <Input
            placeholder={"Descrição da Máquina"}
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
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="whatsapp">
            Número do WhatsApp:
          </label>
          <Input
            placeholder={"Número do WhatsApp"}
            value={data.whatsapp}
            id="whatsapp"
            type="number"
            name="whatsapp"
            autoComplete="whatsapp"
            onChange={(event) => {
              handleChange("whatsapp", event.target.value);
            }}
            className={`${!!errors.whatsapp ? "Update_Pagamento_inputError" : ""}`}
          />
          {errors.whatsapp && (
            <div className="Update_Pagamento_itemFieldError">{errors.whatsapp}</div>
          )}
        </div>

        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="apikey">
            API Key:
          </label>
          <Input
            placeholder={"API Key"}
            value={data.apikey}
            id="apikey"
            type="text"
            name="apikey"
            autoComplete="apikey"
            onChange={(event) => {
              handleChange("apikey", event.target.value);
            }}
            className={`${!!errors.apikey ? "Update_Pagamento_inputError" : ""}`}
          />
          {errors.apikey && (
            <div className="Update_Pagamento_itemFieldError">{errors.apikey}</div>
          )}
        </div>
        <Button
            type="primary"
            onClick={onSave}
            className="Update_Pagamento_saveBtn"
          >
            SALVAR ALTERAÇÕES
          </Button>
      

        <div className="Update_Pagamento_itemField">
          <label className="Update_Pagamento_itemFieldLabel" htmlFor="mercadoPagoId">
            INFORMACAO DO PRODUTO
          </label>
          <Input
            placeholder={"Informação da Pelúcia"}
            value={data.mercadoPagoId}
            id="mercadoPagoId"
            type="text"
            name="mercadoPagoId"
            autoComplete="mercadoPagoId"
            onChange={(event) => {
              handleChange("mercadoPagoId", event.target.value);
            }}
            className={`${!!errors.mercadoPagoId ? "Update_Pagamento_inputError" : ""}`}
          />
          {errors.mercadoPagoId && (
            <div className="Update_Pagamento_itemFieldError">{errors.mercadoPagoId}</div>
          )}
        </div>
        
        <div className="Update_Pagamento_itemField">
          <Button
            type="primary"
            onClick={onEntradaPelucia}
            
            className="Update_Pagamento_peluciaBtn"
          >
            REGISTRAR ENTRADA DO PRODUTO
          </Button>
        </div>
        <div className="Update_Pagamento_itemField">
          <Button
            type="primary"
            onClick={whatsapp}
            
            className="Update_Pagamento_whatsappBtn"
          >
           TESTAR WHATSAPP
          </Button>
        </div>

        <div className="Update_Pagamento_itemField">
          <img src={question_icon} alt="Info" />
          <span>Para adicionar o produto , Clique em registrar entrada do produto  </span>
        </div>
      </div>
    </div>
  );
};

export default EditarWhatsapp;