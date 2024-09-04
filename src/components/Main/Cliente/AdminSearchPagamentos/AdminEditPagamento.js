import React, { useContext, useState } from "react";
import LoadingAction from "../../../../themes/LoadingAction/LoadingAction";
import "./AdminEditPagamento.css";
import { Button, Input } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as links from "../../../../utils/links";
import axios from "axios";

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
  const [isTelemetriaOn, setIsTelemetriaOn] = useState(false); // Novo estado para controlar a telemetria

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

  const handleTelemetriaToggle = () => {
    setIsTelemetriaOn((prev) => !prev); // Alterna o estado da telemetria
  };

  const onSave = () => {
    // Check required fields
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
        if (isTelemetriaOn) {
          return axios.post(
            `${process.env.REACT_APP_SERVIDOR}/estadowhatsapp/${clienteInfo.id}`,
            {},
            {
              headers: {
                "x-access-token": token,
                "content-type": "application/json",
              },
            }
          );
        } else {
          return axios.post(
            `${process.env.REACT_APP_SERVIDOR}/estadotelemetria/${clienteInfo.id}`,
            {},
            {
              headers: {
                "x-access-token": token,
                "content-type": "application/json",
              },
            }
          );
        }
      })
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
            className={`${
              !!errors.nome ? "Admin_Update_Pagamento_inputError" : ""
            }`}
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
            className={`${
              !!errors.descricao ? "Admin_Update_Pagamento_inputError" : ""
            }`}
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
              <img src={question_icon} alt="Ajuda" />
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
            className={`${
              !!errors.store_id ? "Admin_Update_Pagamento_inputError" : ""
            }`}
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
            Valor Do Pulso R$:
          </label>
          <Input
            placeholder={"1.50"}
            value={data.valorDoPulso}
            id="valorDoPulso"
            type="number"
            name="valorDoPulso"
            autoComplete="valorDoPulso"
            onChange={(event) => {
              handleChange("valorDoPulso", event.target.value);
            }}
            className={`${
              !!errors.valorDoPulso ? "Admin_Update_Pagamento_inputError" : ""
            }`}
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
            Estoque:
          </label>
          <Input
            placeholder={"0"}
            value={data.estoque}
            id="estoque"
            type="number"
            name="estoque"
            autoComplete="estoque"
            onChange={(event) => {
              handleChange("estoque", event.target.value);
            }}
            className={`${
              !!errors.estoque ? "Admin_Update_Pagamento_inputError" : ""
            }`}
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
            htmlFor="contadorcredito"
          >
            Contador Crédito:
          </label>
          <Input
            placeholder={"0"}
            value={data.contadorcredito}
            id="contadorcredito"
            type="number"
            name="contadorcredito"
            autoComplete="contadorcredito"
            onChange={(event) => {
              handleChange("contadorcredito", event.target.value);
            }}
            className={`${
              !!errors.contadorcredito ? "Admin_Update_Pagamento_inputError" : ""
            }`}
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
            htmlFor="contadorpelucia"
          >
            Contador Pelúcia:
          </label>
          <Input
            placeholder={"0"}
            value={data.contadorpelucia}
            id="contadorpelucia"
            type="number"
            name="contadorpelucia"
            autoComplete="contadorpelucia"
            onChange={(event) => {
              handleChange("contadorpelucia", event.target.value);
            }}
            className={`${
              !!errors.contadorpelucia ? "Admin_Update_Pagamento_inputError" : ""
            }`}
          />
          {errors.contadorpelucia && (
            <div className="Admin_Update_Pagamento_itemFieldError">
              {errors.contadorpelucia}
            </div>
          )}
        </div>

        <div className="Admin_Update_Pagamento_itemField">
          <label
            className="Admin_Update_Pagamento_itemFieldLabel"
            htmlFor="telemetria"
            style={{ display: "flex", alignItems: "center" }}
          >
            Telemetria:
            <Button
              className={`Admin_EditPagamentos_header_HelpPage ${isTelemetriaOn ? "on" : "off"}`}
              onClick={handleTelemetriaToggle}
              disabled={isLoading}
            >
              {isTelemetriaOn ? "ON" : "OFF"}
            </Button>
          </label>
        </div>

        <div className="Admin_Edit_Pagamentos_footer">
          <Button
            type="primary"
            className="Admin_Edit_Pagamentos_footer_button"
            onClick={onSave}
            disabled={isLoading}
          >
            SALVAR ALTERAÇÕES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditPagamento;
