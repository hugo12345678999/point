import React, { useContext } from "react";
import { Button } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import * as links from "../../../utils/links";
import { AuthContext } from "../../../contexts/AuthContext";

const GruaCliente = (props) => {
  const location = useLocation();
  const maquinaInfos = location.state;
  const { setDataUser, authInfo, setNotiMessage } = useContext(AuthContext);
  const { id } = useParams();
  let navigate = useNavigate();
  const token = authInfo?.dataUser?.token;

  // Example data for demonstration, replace with actual data
  const exampleData = {
    probabilidade: "Alta",
    garraForte: "10%",
    garraMedia: "20%",
    garraFraca: "30%",
    garraPremio: "40%",
  };

  return (
    <div className="GruaCliente_container">
      <div className="GruaCliente_header">
        <Link className="GruaCliente_header_back" to={links.DASHBOARD_FORNECEDOR}>
          VOLTAR
        </Link>
      </div>
      <div className="GruaCliente_content">
        <div className="GruaCliente_info">
          <h2>Informações da Máquina</h2>
          <div className="GruaCliente_info_item">
            <span>Probabilidade:</span>
            <span>{exampleData.probabilidade}</span>
          </div>
          <div className="GruaCliente_info_item">
            <span>Garra Forte:</span>
            <span>{exampleData.garraForte}</span>
          </div>
          <div className="GruaCliente_info_item">
            <span>Garra Média:</span>
            <span>{exampleData.garraMedia}</span>
          </div>
          <div className="GruaCliente_info_item">
            <span>Garra Fraca:</span>
            <span>{exampleData.garraFraca}</span>
          </div>
          <div className="GruaCliente_info_item">
            <span>Garra Prêmio:</span>
            <span>{exampleData.garraPremio}</span>
          </div>
        </div>
        <div className="GruaCliente_buttons">
          <Button
            className="GruaCliente_button_edit"
            onClick={() => {
              navigate(`${links.EDIT_PROBABILIDADE_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Editar Probabilidade</span>
          </Button>
          <Button
            className="GruaCliente_button_edit"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_FORTE_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Editar Garra Forte</span>
          </Button>
          <Button
            className="GruaCliente_button_edit"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_MEDIA_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Editar Garra Média</span>
          </Button>
          <Button
            className="GruaCliente_button_edit"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_FRACA_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Editar Garra Fraca</span>
          </Button>
          <Button
            className="GruaCliente_button_edit"
            onClick={() => {
              navigate(`${links.EDIT_GARRA_PREMIO_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Editar Garra Prêmio</span>
          </Button>
          <Button
            className="GruaCliente_button_edit"
            onClick={() => {
              navigate(`${links.ALTERAR_GRUA_CLIENTE}/${id}`, {
                state: location.state,
              });
            }}
          >
            <AiOutlineEdit />
            <span>Alterar Configuração</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GruaCliente;
