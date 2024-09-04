import React from "react";
import "./EditPagamento.css";
import { Button } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as links from "../../../utils/links";

const WhatsappApp = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="ConfigurarWhatsapp_container">
      <Button
        onClick={() => {
          navigate(`${links.FORNECEDOR_SEARCH_CANAIS}/${id}`, {
            state: location.state,
          });
        }}
      >
        CONFIGURAR
      </Button>
    </div>
  );
};

export default WhatsappApp;
