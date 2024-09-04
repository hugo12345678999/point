import React, { useContext } from "react";
import "./EditPagamento.css";
import { Button } from "antd";
import { AuthContext } from "../../../contexts/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as links from "../../../utils/links";

const WhatsappApp = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const { authInfo, setNotiMessage } = useContext(AuthContext);
  const token = authInfo?.dataUser?.token;
  const { id } = useParams();

  const handleConfigurarWhatsapp = () => {
    // Navegar para a página de configuração do WhatsApp
    navigate(`${links.EDIT_WHATSAPP_MAQUINA}/${id}`);
  };

  return (
    <div className="ConfigurarWhatsapp_container">
      <Button
      
        onClick={handleConfigurarWhatsapp}
      >
        CONFIGURAR WHATSAPP
      </Button>
    </div>
  );
};

export default WhatsappApp;
