import React, { useContext } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import * as links from "../../../utils/links";
import { AuthContext } from "../../../contexts/AuthContext";
import { AiOutlineEdit } from "react-icons/ai";

const GruaCliente = (props) => {
  const location = useLocation();
  const { id } = useParams();
  let navigate = useNavigate();
  const { authInfo } = useContext(AuthContext);

  return (
    <div className="GruaCliente_container">
      <div className="GruaCliente_square">
        <div className="GruaCliente_header">
          <Link className="GruaCliente_header_back" to={links.DASHBOARD_FORNECEDOR}>
            VOLTAR
          </Link>
        </div>
        <div className="GruaCliente_menu">
          <div 
            className="GruaCliente_menu_item"
            onClick={() => navigate(`${links.EDIT_PROBABILIDADE_CLIENTE}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Probabilidade</span>
          </div>
          <div 
            className="GruaCliente_menu_item"
            onClick={() => navigate(`${links.EDIT_GARRA_FORTE_CLIENTE}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Garra Forte</span>
          </div>
          <div 
            className="GruaCliente_menu_item"
            onClick={() => navigate(`${links.EDIT_GARRA_MEDIA_CLIENTE}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Garra Média</span>
          </div>
          <div 
            className="GruaCliente_menu_item"
            onClick={() => navigate(`${links.EDIT_GARRA_FRACA_CLIENTE}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Garra Fraca</span>
          </div>
          <div 
            className="GruaCliente_menu_item"
            onClick={() => navigate(`${links.EDIT_GARRA_PREMIO_CLIENTE}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Garra Prêmio</span>
          </div>
          <div 
            className="GruaCliente_menu_item"
            onClick={() => navigate(`${links.ALTERAR_GRUA_CLIENTE}/${id}`, { state: location.state })}
          >
            <AiOutlineEdit />
            <span>Alterar Grua</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GruaCliente;
