import React from "react";
import { Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as links from "../../../utils/links";

const PagamentosSearch = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleTelemetriaClick = () => {
    navigate(`${links.WHATSAPP}/${id}`);
  };

  const handleNotificacaoClick = () => {
    navigate(`${links.WHATSAPP}/${id}`);
  };

  return (
    <div className="PagamentosSearch_container">
      <div className="PagamentosSearch_header">
        <Button
          className="PagamentosSearch_header_button"
          onClick={handleTelemetriaClick}
        >
          TELEMETRIA
        </Button>
        <Button
          className="PagamentosSearch_header_button"
          onClick={handleNotificacaoClick}
        >
          NOTIFICAÇÃO
        </Button>
      </div>
    </div>
  );
};

export default PagamentosSearch;
