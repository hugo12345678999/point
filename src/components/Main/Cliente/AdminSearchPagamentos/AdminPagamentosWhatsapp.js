import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlineEdit } from "react-icons/ai";
import "./AdminPagamentosWhatsapp.css";

const AdminPagamentosWhatsapp = () => {
  const location = useLocation();
  const { maquinaInfos } = location.state;

  const { setNotiMessage, setDataUser, authInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authInfo?.dataUser?.token;

  const [estoque, setEstoque] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (maquinaInfos?.id) {
      fetchData(maquinaInfos.id);
    }
  }, [maquinaInfos?.id]);

  const fetchData = (id) => {
    setIsLoading(true);
    axios
      .get(`${process.env.REACT_APP_SERVIDOR}/info-maquina/${id}`, {
        headers: {
          "x-access-token": token,
          "content-type": "application/json",
        },
      })
      .then((res) => {
        setIsLoading(false);
        // Atualizar o estado com o valor do estoque
        setEstoque(res.data.estoque);
      })
      .catch((err) => {
        setIsLoading(false);
        if ([401, 403].includes(err.response.status)) {
          setNotiMessage({
            type: "error",
            message:
              "A sua sessão expirou, para continuar faça login novamente.",
          });
          setDataUser(null);
        }
      });
  };

  return (
    <div className="Admin_PagamentosSearch_container">
      {isLoading && <div>Loading...</div>}
      <div className="Admin_PagamentosSearch_header">
        <Button
          className="Admin_PagamentosSearch_header_editBtn"
          onClick={() => {
            navigate(`/CLIENTES_MAQUINAS_EDIT_FORNECEDOR/${maquinaInfos.id}`);
          }}
        >
          <AiOutlineEdit />
          <span>Editar</span>
        </Button>
      </div>
      <div className="Admin_PagamentosSearch_body">
        <div className="Admin_PagamentosSearch_content">
          <div className="Admin_PagamentosSearch_titleList_main">
            <div className="Admin_PagamentosSearch_titleList">
              <div style={{ marginLeft: "2px" }}>RELOGIO PELUCIA</div>
              <div className="Admin_PagamentosSearch_nbList1">
                {estoque ?? "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPagamentosWhatsapp;
